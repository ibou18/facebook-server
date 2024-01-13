const PaiementModel = require("../models/paiementModel");
const sendEmail = require("../utils/sendMail");
const { traitement } = require("../utils/traitement");
const ObjectID = require("mongoose").Types.ObjectId;
const paiement = require("../data/bill.json");
const fs = require("fs");

module.exports.getAll = async (req, res) => {
  const paiement = await PaiementModel.find().sort({ createdAt: -1 }).select();
  return res.status(200).send({ status: " success", paiement });
};

module.exports.uploadJson = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Do something with the uploaded file here, for example, save it to a database
  console.log("File received:", req.file);

  // Read the uploaded file
  fs.readFile(req.file.path, "utf8", async (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Error reading the file." });
    }

    // Parse the JSON data
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      return res.status(500).json({ error: "Error parsing JSON data." });
    }

    // Do something with the jsonData, for example, save it to a database
    console.log("Data from the file:", jsonData);

    const datatoSave = {
      payment_number: jsonData.payment_number,
      payment_date: jsonData.payment_date,
      payment_currency: jsonData.payment_currency,
      payment_amount: jsonData.payment_amount,
      total: jsonData.total,
      tab: jsonData.tab,
    };

    PaiementModel.create(datatoSave);

    const allPaiement = await PaiementModel.find().select();

    // Respond with a success message or any other data you want to send back
    return res.status(200).send({
      status: " success",
      data: allPaiement,
      message: "all Success and data in database",
    });
  });
};

module.exports.getPaiementbyName = async (req, res) => {
  const paiement = await PaiementModel.find().sort({ createdAt: -1 }).select();
  const facebook_Id = req.params.facebook_Id;
  let _temp = [];

  paiement.map((item) => {
    // console.log("🚀item", item.tab);
    _temp.push(item.tab);
  });
  const allTabs = _temp.flat();

  const result = allTabs.filter((item) => item.facebook_Id === facebook_Id);
  const total_remittance = result.reduce(
    (sum, item) => sum + item.remittance,
    0
  );
  console.log("total :>> ", total_remittance.toFixed(2));
  return res
    .status(200)
    .send({ status: " success", data: result, total_remittance });
};

module.exports.getAllEnded = async (req, res) => {
  const paiement = await PaiementModel.find({ statut: true })
    .sort({ updatedAt: -1 })
    .select();
  return res.status(200).send({ status: " success", paiement });
};

module.exports.info = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    const paiementInfo = await PaiementModel.findById(req.params.id).select();
    if (paiementInfo)
      return res.status(200).send({ status: "success", data: paiementInfo });
    else return res.status(404).send("Document not found");
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
};

module.exports.update = async (req, res) => {
  const { id, custom_id, update } = req.body;

  try {
    let updateQuery = {};
    for (let key in update) {
      updateQuery[`tab.$.${key}`] = update[key];
    }

    const data = await PaiementModel.findOneAndUpdate(
      { _id: id, "tab.custom_id": custom_id },
      { $set: updateQuery },
      { new: true }
    );

    console.log("data :>> ", data);

    res.status(200).send({ message: "Successfully updated. " });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports.delete = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PaiementModel.remove({ _id: req.params.id }).exec();
    res.status(200).send({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports.sendPaiement = async (req, res) => {
  console.log("Paiement controller", req.body);
  const resetUrl = `${process.env.CLIENT_URL}/commande/${req.body.id}`;
  let subject = `Vous avez recu une commande `;
  let message = `
       <h4>detail de votre facture sur senepave  </h3> 
       <h5>Detail :</h5>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
  try {
    sendEmail({
      to: req.body.commande.email,
      subject: subject,
      text: message,
    });
    return res
      .status(200)
      .send({ status: "success", message: "Successfully deleted. " });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "error", message: err });
  }
};

const sendMail = async (email, phone, numeroCommande, name, test) => {
  if (test) {
    let subject = `Vous avez recu une commande `;
    let message = `
      <h4> de Mr ${name}<br/> Tel ${phone}<br/>Email ${email}<br/></h3> 
      <h5>Numero de la commande: ${numeroCommande}</h5>
       <p> Connectez-vous pour voir les detaill. </p>
    `;
    try {
      sendEmail({
        to: "ibdiallo.ca0@gmail.com",
        subject: subject,
        text: message,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    let subject = `Message de senepave (Do not reply)`;
    let message = `
      <h3> Bonjour ${name}, <br/></h3> 
      <p> Nous avons bien reçu votre réservation de matériel et nous allons vous contacter dans les 24h suivant votre commande </p> 
      <p> Toute l'équipe Sénépave vous remercie de votre confiance </p> 
      <p> N'oubliez pas nous réalisons aussi la pose de Pavé suivant vos besoins </p> 
      <p> Cordialement,  </p> 
      <p> Aziz NDiaye, Directeur Général Senepave  </p> 
      <p> Visitez notre site Web www.senepave.com </p>
    `;
    try {
      sendEmail({
        to: email,
        subject: subject,
        text: message,
      });
    } catch (err) {
      console.log(err);
    }
  }
};

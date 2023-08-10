const BillModel = require("../models/billModel");
const sendEmail = require("../utils/sendMail");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

const ObjectID = require("mongoose").Types.ObjectId;
const bill = require("../data/bill.json");

module.exports.getAll = async (req, res) => {
  const bills = await BillModel.find().sort({ createdAt: -1 }).select();
  return res.status(200).send({ status: " success", bills });
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

    jsonData.tab.forEach((element) => {
      BillModel.create(element);
    });
    const allPaiement = await BillModel.find().select();

    // Respond with a success message or any other data you want to send back
    return res.status(200).send({
      status: " success",
      data: allPaiement,
      message: "all Success and data in database",
    });
  });
};

module.exports.saveBills = async (req, res) => {
  console.log("bill", bill);
  bill.tab.forEach((element) => {
    BillModel.create(element);
  });
  const allPaiement = await BillModel.find().select();

  return res.status(200).send({ status: " success", data: allPaiement });
};

module.exports.getAllEnded = async (req, res) => {
  const bill = await BillModel.find({ statut: true })
    .sort({ updatedAt: -1 })
    .select();
  return res.status(200).send({ status: " success", bill });
};

module.exports.create = async (req, res) => {
  try {
    let id = req.body.idPaiement ? req.body.idPaiement : null;

    const bill = {
      nomPaiement: req.body.nomPaiement,
      email: req.body.email,
      adresse: req.body.adresse,
      phone: req.body.phone,
      idPaiement: id,
      commandes: req.body.commandes,
    };
    const data = await BillModel.create(bill);

    if (id == null) {
      await sendMail(
        data.email,
        data.phone,
        data.numeroCommande,
        data.nomPaiement,
        true
      );
      await sendMail(
        data.email,
        data.phone,
        data.numeroCommande,
        data.nomPaiement,
        false
      );
    }

    return res.status(201).send({ bill: data });
  } catch (err) {
    return res.status(400).send({ statut: "success", message: err });
  }
};

// module.exports.infoby = (req, res) => {
//   const { facebook_name } = req.body;
//   console.log("facebook_name", facebook_name);
//   if (!ObjectID.isValid(req.params.id))
//     return res.status(400).send("ID unknown : " + req.params.id);
//   BillModel.findById(req.params.id, (err, docs) => {
//     if (!err) res.send(docs);
//     else console.log("ID unknown : " + err);
//   }).select();
// };

module.exports.info = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  let bill = await BillModel.findOne({ _id: req.params.id })
    // .populate("idClient")
    .select();
  if (bill) {
    return res.status(200).send({ status: "success", bill });
  }
};

module.exports.infoby = async (req, res) => {
  const { facebook_name } = req.body;
  console.log("facebook_name", facebook_name);
  if (!facebook_name)
    return res.status(400).send("ID unknown : " + req.params.id);
  await BillModel.find(
    { facebook_name: req.body.facebook_name },
    (err, docs) => {
      if (!err) {
        res.send({ status: " success", data: docs });
      } else console.log("ID unknown : " + err);
    }
  ).exec();
};

module.exports.update = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await BillModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          nomPaiement: req.body.nomPaiement,
          email: req.body.email,
          adresse: req.body.adresse,
          phone: req.body.phone,
          commandes: req.body.commandes,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) {
          return res.status(200).send({ statut: "sucess", bill: docs });
        }
        if (err) {
          return res.status(500).send({ statut: "sucess", message: err });
        }
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

module.exports.delete = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await BillModel.remove({ _id: req.params.id }).exec();
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

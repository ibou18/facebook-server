const PaiementModel = require("../models/paiementModel");
const sendEmail = require("../utils/sendMail");
const { traitement } = require("../utils/traitement");
const ObjectID = require("mongoose").Types.ObjectId;
const paiement = require("../data/bill.json");

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

  // Respond with a success message or any other data you want to send back
  return res.json({ message: "File uploaded successfully." });
};

module.exports.getPaiementbyName = async (req, res) => {
  console.log("paiement", paiement);
  paiement.tab.forEach((element) => {
    PaiementModel.create(element);
  });
  // const paiement = await PaiementModel.find({ _id: req.params._id })
  //   .sort({ createdAt: -1 })
  //   .select();
  // return res.status(200).send({ status: " success", data });
};

module.exports.getAllEnded = async (req, res) => {
  const paiement = await PaiementModel.find({ statut: true })
    .sort({ updatedAt: -1 })
    .select();
  return res.status(200).send({ status: " success", paiement });
};

module.exports.create = async (req, res) => {
  try {
    let id = req.body.idPaiement ? req.body.idPaiement : null;
    // if (req.body.idPaiement === null) {
    //   const paiement = await PaiementModel.create({
    //     name: req.body.nomPaiement,
    //     email: req.body.email,
    //     adresse: req.body.adresse,
    //     tel: req.body.phone,
    //   });
    //   id = paiement._id;
    // }
    const paiement = {
      nomPaiement: req.body.nomPaiement,
      email: req.body.email,
      adresse: req.body.adresse,
      phone: req.body.phone,
      idPaiement: id,
      commandes: req.body.commandes,
    };
    const data = await PaiementModel.create(paiement);

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

    return res.status(201).send({ paiement: data });
  } catch (err) {
    return res.status(400).send({ statut: "success", message: err });
  }
};

module.exports.info = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  PaiementModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select();
};

module.exports.update = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await PaiementModel.findOneAndUpdate(
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
          return res.status(200).send({ statut: "sucess", paiement: docs });
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

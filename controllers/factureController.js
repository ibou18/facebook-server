const FactureModel = require("../models/factureModel");
const DevisModel = require("../models/devisModel");
const sendEmail = require("../utils/sendMail");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAll = async (req, res) => {
  const factures = await FactureModel.find()
    .sort({ createdAt: -1 })
    .populate("idClient")
    .select();
  return res.status(200).send({ status: "success", factures });
};
module.exports.create = async (req, res) => {
  const nb = await FactureModel.find().countDocuments();
  const facture = {
    idClient: req.body.idClient,
    idDevis: req.body.idDevis,
    nomClient: req.body.nomClient,
    email: req.body.email,
    adresse: req.body.adresse,
    dateFin: req.body.dateFin,
    phone: req.body.phone,
    commandes: req.body.commandes,
    statut: req.body.statut,
    numeroFacture: nb + 1,
    tva: req.body.tva,
    montantHt: req.body.montantHt,
    montantTtc: req.body.montantTtc,
  };
  try {
    const data = await FactureModel.create(facture);
    await DevisModel.findOneAndUpdate(
      { _id: req.body.idDevis },
      {
        $set: {
          statut: true,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return res.status(201).send({ status: "success", facture: data });
  } catch (err) {
    return res.status(200).send({ status: "error", message: err });
  }
};
module.exports.info = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  let facture = await FactureModel.findOne({ _id: req.params.id })
    .populate("idClient")
    .select();
  if (facture) {
    return res.status(200).send({ status: "success", facture });
  }
};

module.exports.update = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await FactureModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          idClient: req.body.idClient,
          tarifTransport: req.body.tarifTransport,
          nombreJour: req.body.nombreJour,
          materiels: req.body.materiels,
          paves: req.body.paves,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.delete = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await FactureModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.addPayment = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnu : " + req.params.id);
  }
  if (req.body.montantPaye == undefined) {
    return res.status(400).send("montant null");
  }
  let facture = await FactureModel.findById(req.params.id);
  if (facture.montantTotalTva == facture.montantTotalPaye) {
    return res.status(200).send("facture deja solder");
  }
  if (
    facture.montantTotalTva <
    facture.montantTotalPaye + req.body.montantPaye
  ) {
    return res.status(200).send("montant superieur");
  }

  try {
    return await FactureModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          payments: {
            montantPaye: req.body.montantPaye,
            timestamp: new Date().getTime(),
          },
        },
      },
      { new: true, upsert: true }
    ).exec((err, docs) => {
      let m = 0;
      if (!err) {
        docs.payments.forEach((payment) => {
          m = m + payment.montantPaye;
        });
        FactureModel.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              montantTotalPaye: m,
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true },
          (err, docs) => {
            if (!err) return res.send(docs);
            if (err) return res.status(500).send({ message: err });
          }
        );
      } else return res.status(400).send(err);
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.editPayment = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID inconnue : " + req.params.id);
  }
  if (req.body.montantPaye == undefined) {
    return res.status(400).send("montant vide : ");
  }

  try {
    return await FactureModel.findById(req.params.id, (err, docs) => {
      const editPayment = docs.payments.find((payment) =>
        payment._id.equals(req.body.paymentId)
      );
      if (!editPayment) {
        return res.status(404).send("payment n'existe pas");
      }
      console.log(
        docs.montantTotalPaye + req.body.montantPaye - editPayment.montantPaye,
        docs.montantTotalTva
      );
      if (
        docs.montantTotalTva <
        docs.montantTotalPaye + req.body.montantPaye - editPayment.montantPaye
      ) {
        return res.status(200).send("erreur de calcule");
      }

      editPayment.montantPaye = req.body.montantPaye;
      return docs.save((err) => {
        let m = 0;
        if (!err) {
          docs.payments.forEach((payment) => {
            m = m + payment.montantPaye;
          });
          FactureModel.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                montantTotalPaye: m,
              },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
              if (!err) return res.send(docs);
              if (err) return res.status(500).send({ message: err });
            }
          );
        } else return res.status(500).send(err);
      });
    });
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.deletePayment = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id);
  if (req.body.paymentId == undefined) {
    return res.status(400).send("params empty");
  }
  try {
    return FactureModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          payments: {
            _id: req.body.paymentId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        let m = 0;
        if (!err) {
          docs.payments.forEach((payment) => {
            m = m + payment.montantPaye;
          });
          FactureModel.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: {
                montantTotalPaye: m,
              },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
              if (!err) return res.send(docs);
              if (err) return res.status(500).send({ message: err });
            }
          );
        } else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return res.status(400).send(err);
  }
};

module.exports.sendFacture = async (req, res) => {
  console.log("REQ", req.body);
  const resetUrl = `${process.env.CLIENT_URL}/facture/${req.body.id}`;
  let subject = `Vous avez recu une Facture `;
  let message = `
       <h4>detail de votre facture sur senepave  </h3> 
       <h5>Detail :</h5>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
  try {
    sendEmail({
      to: req.body.facture.email,
      subject: subject,
      text: message,
    });
    return res.status(200).send({ message: "Successfully deleted. " });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: "error", message: err });
  }
};

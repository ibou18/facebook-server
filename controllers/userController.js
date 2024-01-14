const UserModel = require("../models/userModel");
const FactureModel = require("../models/factureModel");
const BillModel = require("../models/billModel");
const ClientModel = require("../models/clientModel");
const PaiementModel = require("../models/paiementModel");
const sendEmail = require("../utils/sendMail");

const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
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

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    return res
      .status(200)
      .send({ status: "success", message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).send({ status: "success", message: err });
  }
};

module.exports.getStatistique = async (req, res) => {
  const totalPaiement = await PaiementModel.find().countDocuments();
  const totalBill = await BillModel.find().countDocuments();
  const totalClient = await ClientModel.find().countDocuments();
  const factures = await FactureModel.find().select();
  // const facturesF = await FactureModel.find().group('createdAt').select();

  let monthGraph = await PaiementModel.aggregate([
    {
      $addFields: {
        convertedDate: {
          $toDate: "$payment_date",
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$convertedDate" } },
        MontantTotal: {
          $sum: { $toDouble: "$payment_amount" }, // Convertir remittance en nombre avant de l'additionner
        },
      },
    },
    {
      $sort: {
        _id: 1, // trier par _id en ordre croissant
      },
    },
  ]);

  let yearGraph = await PaiementModel.aggregate([
    {
      $addFields: {
        convertedDate: {
          $toDate: "$payment_date",
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y", date: "$convertedDate" } },
        MontantTotal: {
          $sum: { $toDouble: "$payment_amount" }, // Convertir payment_amount en nombre avant de l'additionner
        },
      },
    },
    {
      $sort: {
        _id: 1, // trier par _id en ordre croissant
      },
    },
  ]);

  return res.status(200).send({
    status: "success",
    statistique: {
      totalPaiement,
      totalBill,
      totalClient,
      monthGraph,
      yearGraph,
    },
  });
};

module.exports.sendMailContact = async (req, res) => {
  let subject = `Message provenant du formulaire de contact `;
  message = `
      <h4>Mr ${req.body.name}<br/> Tel ${req.body.phone}<br/>Email ${req.body.email}<br/></h3> 
       <p>${req.body.message}. </p>
    `;

  try {
    await sendEmail({
      to: "barryaliou980@gmail.com",
      subject: subject,
      text: message,
    });
    return res.status(200).send({
      status: "success",
      message: "message envoyé avec succes",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.sendDocument = async (req, res) => {
  let subject = `Senepave - Document(s) `;
  let message = ` Bonjour,
  Veuillez trouver ci joint les documents. <br/> <br/>
  Cordialement, <br/>
  Sénépave, Aziz Ndiaye  <br/>
  Tél.: +33 6 41 08 55 57  <br/> <br/>
  `;
  let attachmentFiles = [];
  req.body.files.forEach((element) => {
    attachmentFiles.push({
      filename: element.label,
      href: element.file,
      contentType: "application/pdf",
    });
  });

  try {
    await sendEmail({
      to: req.body.email,
      subject: subject,
      text: message,
      attachments: attachmentFiles,
    });
    return res.status(200).send({
      status: "success",
      message: "message envoyé avec succes",
    });
  } catch (err) {
    console.log(err);
  }
};

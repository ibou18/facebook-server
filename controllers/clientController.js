const ClientModel = require("../models/clientModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllClient = async (req, res) => {
  const clients = await ClientModel.find().select();
  return res.status(200).send({ status: "success", clients });
};

module.exports.getClient = async (req, res) => {
  const clients = await ClientModel.findOne({
    facebook_Id: req.params.id,
  }).select();

  console.log("clients :>> ", clients);
  return res.status(200).send({ status: "success", clients });
};

module.exports.createBulk = async (req, res) => {
  const bulkData = [
    {
      facebook_Id: "1503518003199421",
      facebook_name: "Pathè Moloko",
      name: "Pathè Moloko",
      pourcentage: 0.7,
      email: "PathèMoloko@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "1554909011221861",
      facebook_name: "Anata fooly",
      name: "Anata fooly",
      pourcentage: 0.7,
      email: "Anatafooly@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "101983759180001",
      facebook_name: "Habib Fatako",
      name: "Habib Fatako",
      pourcentage: 0.7,
      email: "HabibFatako@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "104650564990487",
      facebook_name: "Fashion Shop by ADA",
      name: "Fashion Shop by ADA",
      pourcentage: 0.7,
      email: "FashionShopbyADA@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "102577008652506",
      facebook_name: "Hadja ousmane sow labé officiel",
      name: "Hadja ousmane sow labé officiel",
      pourcentage: 0.7,
      email: "Hadjaousmanesowlabéofficiel@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "658234430975680",
      facebook_name: "K2R Welcome PROD",
      name: "K2R Welcome PROD",
      pourcentage: 0.7,
      email: "K2RWelcomePROD@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "105613565010880",
      facebook_name: "Kade Seck Officiel",
      name: "Kade Seck Officiel",
      pourcentage: 0.7,
      email: "KadeSeckOfficiel@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "103548195257395",
      facebook_name: "M'boma",
      name: "M'boma",
      pourcentage: 0.7,
      email: "M'boma@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "106867395064329",
      facebook_name: "Mamadi condé",
      name: "Mamadi condé",
      pourcentage: 0.7,
      email: "Mamadicondé@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "434527290083181",
      facebook_name: "Oumi korka Sow",
      name: "Oumi korka Sow",
      pourcentage: 0.7,
      email: "OumikorkaSow@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "100421322205275",
      facebook_name: "Paikoun Saré Officiel",
      name: "Paikoun Saré Officiel",
      pourcentage: 0.7,
      email: "PaikounSaréOfficiel@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "103946372041953",
      facebook_name: "PSTV officiel",
      name: "PSTV officiel",
      pourcentage: 0.7,
      email: "PSTVofficiel@facebook.com",
      phone: "0123456789",
    },
    {
      facebook_Id: "101486234964042",
      facebook_name: "Diallo mix toun",
      name: "Diallo mix toun",
      pourcentage: 0.7,
      email: "diallomixtoun@facebook.com",
      phone: "0123456789",
    },
  ];
  try {
    bulkData.map((item) => ClientModel.create(item));
    return res.status(201).send({ status: "success" });
  } catch (err) {
    return res.status(400).send({ status: "error", message: err });
  }
};
module.exports.create = async (req, res) => {
  try {
    const client = await ClientModel.create(req.body);
    return res.status(201).send({ status: "success", client });
  } catch (err) {
    return res.status(400).send({ status: "error", message: err });
  }
};

module.exports.update = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await ClientModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          paiement: req.body.paiement,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(400).send({ status: "success", message: err });
  }
};

module.exports.delete = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send({ status: "error", message: "ID unknown " });

  try {
    await ClientModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(400).send({ status: "success", message: err });
  }
};

module.exports.sendWhatsapp = async (req, res) => {
  // Download the helper library from https://www.twilio.com/docs/node/install
  // Find your Account SID and Auth Token at twilio.com/console
  // and set the environment variables. See http://twil.io/secure
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      from: "whatsapp:+224625635591",
      body: "Hello there 🚀 !",
      to: "whatsapp:+33767314126",
    })
    .then((message) => {
      console.log(message.sid);
      res.status(200).json({ status: "Success", message });
    })
    .catch((err) => {
      console.log("err", err);
      res.status(400).json({ status: "error", err });
    });
};

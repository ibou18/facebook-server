const ClientModel = require("../models/clientModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllClient = async (req, res) => {
  const clients = await ClientModel.find().select();
  return res.status(200).send({ status: "success", clients });
};

module.exports.getClient = async (req, res) => {
  const clients = await ClientModel.findOne({ _id: req.params.id }).select();
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
    },
    {
      facebook_Id: "1554909011221861",
      facebook_name: "Anata fooly",
      name: "Anata fooly",
      pourcentage: 0.7,
      email: "Anatafooly@facebook.com",
    },
    {
      facebook_Id: "101983759180001",
      facebook_name: "Habib Fatako",
      name: "Habib Fatako",
      pourcentage: 0.7,
      email: "HabibFatako@facebook.com",
    },
    {
      facebook_Id: "104650564990487",
      facebook_name: "Fashion Shop by ADA",
      name: "Fashion Shop by ADA",
      pourcentage: 0.7,
      email: "FashionShopbyADA@facebook.com",
    },
    {
      facebook_Id: "102577008652506",
      facebook_name: "Hadja ousmane sow labé officiel",
      name: "Hadja ousmane sow labé officiel",
      pourcentage: 0.7,
      email: "Hadjaousmanesowlabéofficiel@facebook.com",
    },
    {
      facebook_Id: "658234430975680",
      facebook_name: "K2R Welcome PROD",
      name: "K2R Welcome PROD",
      pourcentage: 0.7,
      email: "K2RWelcomePROD@facebook.com",
    },
    {
      facebook_Id: "105613565010880",
      facebook_name: "Kade Seck Officiel",
      name: "Kade Seck Officiel",
      pourcentage: 0.7,
      email: "KadeSeckOfficiel@facebook.com",
    },
    {
      facebook_Id: "103548195257395",
      facebook_name: "M'boma",
      name: "M'boma",
      pourcentage: 0.7,
      email: "M'boma@facebook.com",
    },
    {
      facebook_Id: "106867395064329",
      facebook_name: "Mamadi condé",
      name: "Mamadi condé",
      pourcentage: 0.7,
      email: "Mamadicondé@facebook.com",
    },
    {
      facebook_Id: "434527290083181",
      facebook_name: "Oumi korka Sow",
      name: "Oumi korka Sow",
      pourcentage: 0.7,
      email: "OumikorkaSow@facebook.com",
    },
    {
      facebook_Id: "100421322205275",
      facebook_name: "Paikoun Saré Officiel",
      name: "Paikoun Saré Officiel",
      pourcentage: 0.7,
      email: "PaikounSaréOfficiel@facebook.com",
    },
    {
      facebook_Id: "103946372041953",
      facebook_name: "PSTV officiel",
      name: "PSTV officiel",
      pourcentage: 0.7,
      email: "PSTVofficiel@facebook.com",
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

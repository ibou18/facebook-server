const ConstantModel = require("../models/constantsModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllConstant = async (req, res) => {
  const constants = await ConstantModel.find().select();
  res.status(200).json(constants);
};
module.exports.create = async (req, res) => {
  const { tva, pricePerFuel, highwayTariff, charges } = req.body;
  const constant = {
    tva: tva,
    pricePerFuel: pricePerFuel,
    highwayTariff: highwayTariff,
    charges: charges,
  };

  try {
    const data = await ConstantModel.create(constant);
    res.status(201).json({ constant: data });
  } catch (err) {
    res.status(200).send(err);
  }
};

module.exports.update = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await ConstantModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          tva: req.body.tva,
          pricePerFuel: req.body.pricePerFuel,
          highwayTariff: req.body.highwayTariff,
          charges: req.body.charges,
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
    await ConstantModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

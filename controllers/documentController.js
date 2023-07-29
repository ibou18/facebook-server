const DocumentModel = require("../models/documentModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAll = async (req, res) => {
  const documents = await DocumentModel.find().select();
  return res.status(200).send({ status: "success", documents });
};

module.exports.create = async (req, res) => {
  const file = {
    label: req.body.label,
    url: req.file.location,
  };
  try {
    const data = await DocumentModel.create(file);
    return res.status(201).json({ status: "success", file: data });
  } catch (err) {
    return res.status(400).send({ status: "success", message: err });
  }
};

module.exports.delete = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await DocumentModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

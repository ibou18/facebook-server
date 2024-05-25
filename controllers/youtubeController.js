const YoutubeModel = require("../models/YoutubeModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAll = async (req, res) => {
  const youtubes = await YoutubeModel.find().select();
  res.status(200).json(youtubes);
};
module.exports.create = async (req, res) => {
  console.log("req.body", req.body);

  try {
    const data = await YoutubeModel.create(req.body);
    console.log("data", data);
    return res.status(201).json({ status: "success", data });
  } catch (err) {
    res.status(200).send(err);
  }
};

module.exports.info = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  YoutubeModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select();
};

module.exports.update = async (req, res) => {
  console.log(req.body);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await YoutubeModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
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
    await YoutubeModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

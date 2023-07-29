const PaveModel = require("../models/paveModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAll = async (req, res) => {
  const paves = await PaveModel.find().select();
  res.status(200).json(paves);
};
module.exports.create = async (req, res) => {
  let fileNames = [];
  if (req.files) {
    req.files.forEach(async (file) => {
      let tmp = {
        src: file.location,
      };
      fileNames.push(tmp);
    });
  }
  const pave = {
    description: req.body.description,
    nomPave: req.body.nomPave,
    prixVente: req.body.prixVente,
    prixAchat: req.body.prixAchat,
    tarifPose: req.body.tarifPose,
    gamme: req.body.gamme,
    images: fileNames,
    livraison: req.body.livraison,
    epaisseurs: req.body.epaisseurs,
    tailles: req.body.tailles,
    couleurs: req.body.couleurs,
  };
  try {
    const data = await PaveModel.create(pave);
    return res.status(201).json({ status: "success", pave: data });
  } catch (err) {
    res.status(200).send(err);
  }
};

module.exports.info = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  PaveModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select();
};

module.exports.update = async (req, res) => {
  console.log(req.body);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  if (req.body.deleteId) {
    if (Array.isArray(req.body.deleteId)) {
      req.body.deleteId.forEach(async (element) => {
        await deleteImage(req.params.id, element);
      });
    } else {
      await deleteImage(req.params.id, req.body.deleteId);
    }
  }
  if (req.files) {
    req.files.forEach(async (file) => {
      await addImages(req.params.id, file.location);
    });
  }
  try {
    // await PaveModel.findOneAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $set: {
    //       description: req.body.description,
    //       nomPave: req.body.nomPave,
    //       prixVente: req.body.prixVente,
    //       prixAchat: req.body.prixAchat,
    //       tarifPose: req.body.tarifPose,
    //       gamme: req.body.gamme,
    //       livraison: req.body.livraison,
    //       epaisseurs: req.body.epaisseurs,
    //       tailles: req.body.tailles,
    //       couleurs: req.body.couleurs,
    //     },
    //   },
    //   { new: true, upsert: true, setDefaultsOnInsert: true },
    //   (err, docs) => {
    //     if (!err) return res.status(200).send({ status: "success", docs });
    //     if (err) return res.status(400).send({ status: "Error", message: err });
    //   }
    // );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.delete = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await PaveModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

const deleteImage = async (id, deleteId) => {
  try {
    return PaveModel.findByIdAndUpdate(
      id,
      {
        $pull: {
          images: {
            _id: deleteId,
          },
        },
      },
      { new: true },
      (err, docs) => {
        if (!err) {
          return true;
        } else false;
      }
    );
  } catch (err) {
    return false;
  }
};

const addImages = async (id, url) => {
  await PaveModel.findByIdAndUpdate(
    { _id: id },
    {
      $push: {
        images: {
          src: url,
        },
      },
    }
  ).exec();
};

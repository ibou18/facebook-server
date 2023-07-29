const MaterielModel = require("../models/materielsModel");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAll = async (req, res) => {
  const materiels = await MaterielModel.find();
  return res.status(200).json({ status: "success", materiels });
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
  const { name, prixUnitaire, couleur, unite, description, prixAchat } =
    req.body;
  const materiel = {
    name: name,
    images: fileNames.length != 0 ? fileNames : null,
    couleur: couleur,
    unite: unite,
    prixUnitaire: prixUnitaire,
    prixAchat: prixAchat,
    description: description,
    taille: description,
    epaisseur: description,
  };

  try {
    const data = await MaterielModel.create(materiel);
    return res.status(201).json({ status: "success", materiel: "data" });
  } catch (err) {
    return res.status(400).send({ status: "error", message: err });
  }
};
module.exports.info = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);
  MaterielModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select();
};

module.exports.update = async (req, res) => {
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
    await MaterielModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          unite: req.body.unite,
          description: req.body.description,
          prixUnitaire: req.body.prixUnitaire,
          prixAchat: req.body.prixAchat,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send({ status: "success", materiel: docs });
        if (err) return res.status(500).send({ status: "error", message: err });
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
    await MaterielModel.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .json({ status: "success", message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err });
  }
};

const upload = async (file, fileName) => {
  await pipeline(
    file.stream,
    fs.createWriteStream(`../client/public/images/materiels/${fileName}`)
  ).then(() => {
    return fileName;
  });
  // fs.close(0, (err) => {
  //   if (err) throw err;
  //   console.log("No errors");
  // });
};

const deleteImage = async (id, deleteId) => {
  try {
    return MaterielModel.findByIdAndUpdate(
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
  await MaterielModel.findByIdAndUpdate(
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

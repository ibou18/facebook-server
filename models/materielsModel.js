const mongoose = require("mongoose");

const materielShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    prixUnitaire: {
      type: Number,
      required: true,
    },
    prixAchat: {
      type: Number,
    },
    couleur: {
      type: String,
    },
    description: {
      type: String,
    },
    images: {
      type: [
        {
          src: {
            type: String,
            required: true,
          },
        },
      ],
    },
    unite: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const MaterielModel = mongoose.model("Materiel", materielShema);

module.exports = MaterielModel;

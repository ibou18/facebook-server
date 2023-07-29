const mongoose = require("mongoose");

const paveSchema = new mongoose.Schema(
  {
    nomPave: {
      type: String,
      required: true,
    },
    gamme: {
      type: String,
      required: true,
    },
    prixAchat: {
      type: Number,
    },
    prixVente: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 4,
    },
    images: {
      type: [
        {
          name: {
            type: String,
          },
          src: {
            type: String,
            required: true,
          },
        },
      ],
    },
    couleurs: [String],
    description: {
      type: String,
      required: true,
    },
    tailles: [String],
    epaisseurs: [Number],
    tarifPose: {
      type: Number,
      required: true,
    },
    livraison: {
      type: Number, // Exemples 5 semaines
    },
  },
  {
    timestamps: true,
  }
);
const PaveModel = mongoose.model("Pave", paveSchema);

module.exports = PaveModel;

const mongoose = require("mongoose");

const factureShema = new mongoose.Schema(
  {
    idClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    idDevis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Devis",
      unique: true,
    },
    numeroFacture: {
      type: Number,
    },
    nomClient: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    adresse: {
      type: String,
      required: true,
    },
    tel:{
      type: String,
    },
    dateFin: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    commandes: {
      type: [
        {
          detail: {
            type: String,
            // required: true,
            default: "",
          },
          prix: {
            type: Number,
            // required: true,
          },
          produitName: {
            type: String,
            // required: true,
          },
          quantite: {
            type: String,
            // required: true,
          },
          sousTotal: {
            type: String,
            // required: true,
          },
          unite: {
            type: String,
            default: "",
          },
        },
      ],
    },
    statut: {
      type: String,
      required: true,
      enum: ["Non payé", "Payé", "Annuler", "En cours"],
      default: "Non payé",
    },
    isProfessional: {
      type: Boolean,
      default: true,
    },
    tva: {
      type: Number,
      required: true,
    },
    montantHt: {
      type: Number,
      required: true,
    },
    montantTtc: {
      type: Number,
      required: true,
    },
    payments: {
      type: [
        {
          montantPaye: Number,
          timestamp: Number,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const FactureModel = mongoose.model("Facture", factureShema);

module.exports = FactureModel;

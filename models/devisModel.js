const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);
const devisShema = new mongoose.Schema(
  {
    idClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    numeroCommande: {
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
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
devisShema.plugin(AutoIncrement, {
  id: "numero_commande",
  inc_field: "numeroCommande",
});
const DevisModel = mongoose.model("Devis", devisShema);
module.exports = DevisModel;

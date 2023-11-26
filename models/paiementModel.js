const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);
const paiementShema = new mongoose.Schema(
  {
    Payee: {
      type: Number,
    },
    payment_number: {
      type: Number,
    },
    payment_date: {
      type: Date,
      required: true,
    },
    payment_currency: {
      type: String,
      required: true,
    },
    payment_amount: {
      type: String,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    tab: {
      type: Array,
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
// paiementShema.plugin(AutoIncrement, {
//   id: "numero_commande",
//   inc_field: "numeroCommande",
// });
const PaiementModel = mongoose.model("Paiement", paiementShema);
module.exports = PaiementModel;

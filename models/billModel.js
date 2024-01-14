const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const billShema = new mongoose.Schema(
  {
    idClient: {
      type: String,
      ref: "Client",
    },
    conversion: {
      type: Number,
    },
    payout_reference: {
      type: String,
    },
    payout_number: {
      type: String,
    },
    payment_date: {
      type: String,
    },
    payment_currency: {
      type: String,
    },
    conversion: {
      type: Number,
    },
    pourcentage: {
      type: Number,
    },
    payout_period_start: {
      type: String,
      // required: true,
    },
    payout_period_end: {
      type: String,
      // required: true,
    },
    product: {
      type: String,
      // required: true,
    },
    facebook_Id: {
      type: String,
      // required: true,
    },
    facebook_name: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    payment_number: {
      type: Number,
    },
    remittance: {
      type: Number,
    },
    Total: {
      type: String,
      required: false,
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
// billShema.plugin(AutoIncrement, {
//   id: "numero_commande",
//   inc_field: "numeroCommande",
// });
const BillModel = mongoose.model("Bill", billShema);
module.exports = BillModel;

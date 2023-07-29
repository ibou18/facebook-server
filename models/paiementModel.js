const mongoose = require("mongoose");
var AutoIncrement = require("mongoose-sequence")(mongoose);
const paiementShema = new mongoose.Schema(
  {
    idClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    Payment_Number: {
      type: Number,
    },
    Payment_Date: {
      type: Date,
      required: true,
    },
    Payment_Currency: {
      type: String,
      required: true,
    },
    Payment_Amount: {
      type: String,
      required: true,
    },
    Total: {
      type: String,
      required: true,
    },
    tab: {
      type: [
        {
          payout_reference: {
            type: Number,
            // required: true,
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
          facebook_name: {
            type: String,
            // required: true,
          },
          facebook_Id: {
            type: String,
            default: "",
          },
          remittance: {
            type: Number,
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
// paiementShema.plugin(AutoIncrement, {
//   id: "numero_commande",
//   inc_field: "numeroCommande",
// });
const PaiementModel = mongoose.model("Paiement", paiementShema);
module.exports = PaiementModel;

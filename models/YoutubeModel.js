const mongoose = require("mongoose");
const { Client } = require("twilio/lib/base/BaseTwilio");
const youtubeShema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    amount_receipt: {
      type: Number,
    },
    payment_number: {
      type: String,
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
    rate: {
      type: String,
      required: true,
    },
    commission: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// youtubeShema.plugin(AutoIncrement, {
//   id: "numero_commande",
//   inc_field: "numeroCommande",
// });
const YoutubeModel = mongoose.model("Youtube", youtubeShema);
module.exports = YoutubeModel;

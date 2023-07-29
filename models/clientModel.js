const mongoose = require("mongoose");
const { isEmail } = require("validator");

const clientSchema = new mongoose.Schema(
  {
    idBill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bill",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      trim: true,
    },
    facebook_name: {
      type: String,
    },
    facebook_Id: {
      type: String,
    },
    pourcentage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into display: 'block',

const ClientModel = mongoose.model("Client", clientSchema);

module.exports = ClientModel;

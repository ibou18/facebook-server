const e = require("express");
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
      required: true,
    },
    facebook_Id: {
      type: String,
      required: true,
    },
    vpn_name: {
      type: String,
      enum: ["NordVPN", "ExpressVPN", "CyberGhost"],
      default: "",
    },
    vpn_account: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      length: 10,
    },
    pourcentage: {
      type: Number,
    },
    method_paiment: {
      type: String,
    },
    status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into display: 'block',

const ClientModel = mongoose.model("Client", clientSchema);

module.exports = ClientModel;

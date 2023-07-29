const mongoose = require("mongoose");

const constantsSchema = new mongoose.Schema(
  {
    pricePerFuel: {
      type: Number,
      required: true,
    },
    highwayTariff: {
      type: Number,
      required: true,
    },
    charges: {
      type: Number,
      required: true,
    },
    fraisAchat: {
      type: Number,
      required: true,
    },
    tva: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const ConstantsModel = mongoose.model("Constant", constantsSchema);

module.exports = ConstantsModel;

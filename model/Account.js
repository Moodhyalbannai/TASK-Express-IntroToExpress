const { Schema, model } = require("mongoose");

const AccountSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  funds: {
    type: Number,
    default: 0,
  },
});

module.exports = model("Account", AccountSchema);

const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
  {
    eth: {
      type: String,
    },
    tron: {
      type: String,
    },
    btc: {
      type: String,
    },
    bnb: {
      type: String,
    },
    usdt: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', WalletSchema);

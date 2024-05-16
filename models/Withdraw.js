const mongoose = require('mongoose');
const moment = require('moment');

const WithdrawSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['processing', 'sent'],
      default: 'processing',
    },
    date: {
      type: String,
      default: moment().format('YYYY-DD-MM'),
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdraw', WithdrawSchema);

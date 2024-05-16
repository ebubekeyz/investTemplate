const mongoose = require('mongoose');
const moment = require('moment');

const PackageItemSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  percent: {
    type: Number,
    required: true,
  },

  days: {
    type: Number,
    required: true,
  },
});

const PackageSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['paid', 'not-paid', 'expired'],
      default: 'not-paid',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide amount'],
    },
    receipt: {
      type: String,
      required: [true, 'Please provide receipt'],
    },
    coin: {
      type: String,
      required: [true, 'Please select coin'],
    },
    package: [PackageItemSchema],

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

module.exports = mongoose.model('Package', PackageSchema);

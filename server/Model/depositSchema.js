const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Deposit amount is required'],
    min: [0, 'Deposit amount cannot be negative']
  },
  accountType: {
    type: String,
    required: [true, 'Account type is required']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  image: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  txid: {
    type: String,
    required: [true, 'Transaction ID is required']
  }
}, { timestamps: true });

const Deposit = mongoose.model('deposit', depositSchema);

module.exports = Deposit;
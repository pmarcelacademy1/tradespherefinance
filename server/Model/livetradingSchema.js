const mongoose = require('mongoose');

const livetradeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Market'],
    default: 'Market'
  },
  currencypair: {
    type: String,
    required: true
  },
  lotsize: {
    type: Number,
    required: true,
    min: [0, 'Lot size cannot be negative']
  },
  entryPrice: {
    type: Number,
    required: true,
    min: [0, 'Entry price cannot be negative']
  },
  stopLoss: {
    type: Number,
    required: true
  },
  takeProfit: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['UP', 'DOWN']
  },
  leverage: {
    type: Number,
    required: true,
    min: [1, 'Leverage must be at least 1'],
    max: [50, 'Leverage cannot exceed 50']
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'closed'],
    default: 'open'
  },
  profitLoss: {
    type: Number,
    default: 0
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });

const Livetrading = mongoose.model('livetrade', livetradeSchema);
module.exports = Livetrading;
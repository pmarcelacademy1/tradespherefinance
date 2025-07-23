const mongoose = require('mongoose');

const miningSchema = new mongoose.Schema({
  coin: {
    type: String,
    required: true,
    enum: ['Bitcoin', 'Ethereum', 'BNB', 'Doge', 'Atom']
  },
  amount: {
    type: Number,
    required: true
  },
  profit: {
    type: Number, // Profit in coin (e.g., 0.01 BTC)
    required: true
  },
  duration: {
    type: Number, // Duration in days
    required: true
  },
  hashRate: {
    type: String, // e.g., "10 TH/s", "20 MH/s"
    required: true
  },
  image: {
    type: String
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  dailyProfit: {
    type: Number // Profit per day in coin
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, { timestamps: true });

const Mining = mongoose.model('mining', miningSchema);

module.exports = Mining;
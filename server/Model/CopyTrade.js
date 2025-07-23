const mongoose = require('mongoose');

const copyTradeSchema = new mongoose.Schema({
  traderName: {
    type: String,
    required: true,
    enum: ['eToro CopyTrader™', 'AI Trading Bot', 'Ultimate Trading Bot', 'Pionex - Crypto Trading']
  },
  profitShare: {
    type: Number,
    required: true,
    min: [0, 'Profit share cannot be negative'],
    max: [100, 'Profit share cannot exceed 100']
  },
  winRate: {
    type: Number,
    required: true,
    min: [0, 'Win rate cannot be negative'],
    max: [100, 'Win rate cannot exceed 100']
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least 1']
  },
  accountType: {
    type: String,
    required: true,
    enum: [
      'Trading Account',
      'Bitcoin Mining Account',
      'Ethereum Mining Account',
      'Dogecoin Mining Account',
      'Binance Coin Mining Account',
      'Cosmos (ATOM) Mining Account'
    ]
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration must be at least 1 day']
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date // Removed 'required' since it's computed
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed'],
    default: 'active'
  },
  currentProfit: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });

// Calculate endDate before saving
copyTradeSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('startDate') || this.isModified('duration')) {
    if (!this.startDate || !this.duration) {
      return next(new Error('startDate and duration are required to calculate endDate'));
    }
    const durationMs = this.duration * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    this.endDate = new Date(this.startDate.getTime() + durationMs);
  }
  next();
});

const CopyTrade = mongoose.model('copyTrade', copyTradeSchema);
module.exports = CopyTrade;
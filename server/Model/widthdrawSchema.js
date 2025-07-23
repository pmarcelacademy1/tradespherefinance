const mongoose = require('mongoose');

const widthdrawSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  narration: {
    type: String,
    default: 'Narration'
  },
  from: {
    type: String,
    required: true // Stores the account type (e.g., "Trading Account")
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('widthdraw', widthdrawSchema);
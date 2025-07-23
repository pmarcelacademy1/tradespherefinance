const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  isSuspended: {
    type: Boolean,
    default: false
  },
  first_name: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true
  },
  last_name: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please enter an email'],
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please enter your phone number'],
    trim: true
  },
  currency: {
    type: String,
    required: [true, 'Please select a currency']
  },
  country: {
    type: String,
    required: [true, 'Please select a country']
  },
  state: {
    type: String,
    required: [true, 'Please enter your state']
  },
  city: {
    type: String,
    required: [true, 'Please enter your city']
  },
  btc_add: {
    type: String,
    default: "3Mw4ea2t477iCKRWvMfdjNsCTwSfEA6ZqS"
  },
  eth_add: {
    type: String,
    default: "0x8fD21E66abcD25fD24Fd367Ead0a3206D79eb7CD"
  },
  xrp_add: {
    type: String,
    default: "Loading"
  },

  rune_add: {
    type: String,
    default: "Loading"
  },
  xlm_add: {
    type: String,
    default: "Loading"
  },
  doge_add: {
    type: String,
    default: "Loading"
  },
  sol_add: {
    type: String,
    default: "Loading"
  },
  usdt_add: {
    type: String,
    default: "TKPW6cg3CTwo4vSG1fUzbAP6HBaPrZfFqt"
  },
    annLink: {
        type: String,
        default: 'settings_page'
    },
   annText: {
        type: String,
        default: 'Please verify your identity by uploading a valid government-issued identification card'
    },
  gender: {
    type: String,
    required: [true, 'Please select a gender']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  security_question: {
    type: String,
    required: [true, 'Please select a security question']
  },
  security_answer: {
    type: String,
    required: [true, 'Please enter a security answer'],
    trim: true
  },
  session: {
    type: String,
    default: "0/0"
  },
  image: {
    type: String
  },
  balance: {
    type: Number,
    default: 0
  },
  available: {
    type: String,
    default: "0.00"
  },
  zip_code: {
    type: String,
    default: "None"
  },
  address: {
    type: String,
    default: "None"
  },
  bonus: {
    type: String,
    default: "0.00"
  },
  widthdrawBalance: {
    type: String,
    default: "0.00"
  },
  profit: {
    type: String,
    default: "0.00"
  },
  totalDeposit: {
    type: String,
    default: "0.00"
  },
  totalWidthdraw: {
    type: String,
    default: "0.00"
  },
  prog: {
    type: Number,
    default: 0
  },
  otp: {
    type: Number,
    default: 0
  },
  otpExpires: {
    type: Date,
    default: null
  },
  verificationCode: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  kycVerified: {
    type: Boolean,
    default: false
  },
  verifiedStatus: {
    type: String,
    default: 'Account not yet Verified!'
  },
  copyTrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'copyTrade'
  }],
  livetrades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'livetrade'
  }],
  upgrades: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'upgrade'
  },
  verified: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'verify'
  },
  deposits: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'deposit'
  },
  widthdraws: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'widthdraw'
  },
  minings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'mining' }],
  role: {
    type: Number,
    default: 0
  },
  accountTypes: {
    type: [{
      name: {
        type: String,
        required: true
      },
      minDeposit: {
        type: Number,
        required: true,
        min: [0, 'Minimum deposit cannot be negative']
      }
    }],
    default: [
      { name: "Trading Account", minDeposit: 0 },
      { name: "Bitcoin Mining Account", minDeposit: 0 },
      { name: "Ethereum Mining Account", minDeposit: 0 },
      { name: "Dogecoin Mining Account", minDeposit: 0 },
      { name: "Binance Coin Mining Account", minDeposit: 0 },
      { name: "Cosmos (ATOM) Mining Account", minDeposit: 0 }
    ]
  }
}, { timestamps: true });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// Static login method
// Static login method with plain text password comparison
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('incorrect email');
  }
  if (!user.isVerified) {
    throw Error('Your account is not verified. Please verify it or create another account.');
  }
  if (user.isSuspended) {
    throw Error('Your account is suspended. If you believe this is a mistake, please contact support at support@signalsmine.org.');
  }
  // Direct string comparison for passwords
  if (password !== user.password) {
    throw Error('incorrect password');
  }
  return user;
};
const User = mongoose.model('user', userSchema);
module.exports = User;
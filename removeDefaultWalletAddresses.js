const mongoose = require('mongoose');
const removeDefaultWalletAddresses = require('./updateUsers');

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://pius1:pius123@webdevelopment.xav1dsx.mongodb.net/tradespheresfinance', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

removeDefaultWalletAddresses()
  .then(() => {
    console.log('Default wallet addresses removed successfully.');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Failed to remove default wallet addresses:', error);
    mongoose.connection.close();
  });
  
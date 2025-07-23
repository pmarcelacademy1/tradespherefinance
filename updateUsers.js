const User = require('./server/Model/User'); // Adjust the path to your User model

async function removeDefaultWalletAddresses() {
  try {
    const result = await User.updateMany(
      {}, // Empty filter to match all users
      {
        $unset: {
          btc_add: "",
          eth_add: "",
          xrp_add: "",
          rune_add: "",
          xlm_add: "",
          doge_add: "",
          sol_add: "",
          usdt_add: ""
        }
      }
    );
    console.log(`Successfully updated ${result.modifiedCount} user documents.`);
    return result;
  } catch (error) {
    console.error('Error removing default wallet addresses:', error);
    throw error;
  }
}

module.exports = removeDefaultWalletAddresses;
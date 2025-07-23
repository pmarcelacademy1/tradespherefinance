const express = require('express');
// const multer = require('multer');
const router = express.Router();

const userController = require('../controllers/userController');




router.get('/dashboard',userController.dashboardPage);

router.get('/dashboard/:id',userController.dashboardPages);

router.get('/navbarPage',userController.navbarPage);

// router.get('/verify',userController.verifyPage);
router.get('/account_verification/:id',userController.account_verificationPage);
router.get('/verification/:id',userController.id_verificationPage);
router.post('/verify/:id', userController.verifyPage_post);

router.get('/account/:id',userController.accountPage);
router.get('/settings_page',userController.editProfilePage);
router.get('/update_address/:id',userController.update_addressPage);
router.post('/update_address/:id', userController.update_addressPage_Post);

router.get('/password_change/:id',userController.password_changePage);
// Process password change
router.post('/password_change/:id', userController.password_changeSubmit);
router.get('/update_photo/:id',userController.update_photoPage);
// Process photo update
router.post('/update_photo/:id', userController.update_photoSubmit);

router.get('/profile_view',userController.profile_viewPage);
router.get('/watchlist',userController.watchlistPage);
router.get('/update_email/:id',userController.update_emailPage);
// Process email update
router.post('/update_email/:id', userController.update_emailSubmit);

router.get('/trade/:id',userController.livePage);
router.post('/trade/:id',userController.createTrade);
router.get('/tradeHistory/:id', userController.tradeHistoryPage)
router.post('/trade/close/:userId/:tradeId', userController.closeTrade);
router.get('/coin-price', userController.getCoinPrice);

router.get('/mining/:id',userController.miningPage);
router.post('/miningRequest/:id', userController.miningRequest_post);
router.get('/miningHistory/:id', userController.miningHistory);


router.get('/copy_traders/:id',userController.copyTradesPage);

router.post('/copy_trade/:id', userController.createCopyTrade);

router.get('/copy_trades_ongoing/:id', userController.copyTradesOngoingPage);
// New profit endpoint
router.get('/copy_trades_profit/:id', userController.getCopyTradesProfit);

router.get('/account_types/:id',userController.upgradePage);
router.post('/accountUpgrade/:id',userController.upgradePage_post);
router.get('/upgradeHistory/:id', userController.upgradeHistory);

router.get('/deposit/:id', userController.depositPage);
router.post('/deposit/:id', userController.depositPage_post);
router.get('/payment_method/:id', userController.payment_methodPage);
// router.get('/bitcoin_deposit', userController.bitcoin_depositPage);

router.get('/get_address/:id', userController.all_addressPage);

router.get('/depositHistory/:id',userController.depositHistory);

router.get('/withdraw/:id',userController.widthdrawPage);
router.get('/bank_withdraw/:id',userController.bank_withdrawPage);
router.get('/bitcoin_withdraw/:id',userController.bitcoin_withdrawPage);
router.get('/paypal_withdraw/:id',userController.paypal_withdrawPage);
router.get('/cashapp_withdraw/:id',userController.cashapp_withdrawPage);
router.get('/gcash_withdraw/:id',userController.gcash_withdrawPage);
router.post('/withdraw/:id',userController.widthdrawPage_post);

router.get('/withdrawHistory/:id', userController.withdrawHistory);

router.get('/buy_coins', userController.buyCrypto)


module.exports = router;


const express = require("express");

const router = express.Router();

const { homePage, aboutPage, contactPage, affliatePage, licensePage, faqPage, termsPage, startguidePage, registerPage, loginPage, register_post,verifyEmailPage,verifyEmail_post, login_post, loginAdmin, logout_get, copyPage, cryptoPage, cryptoMinPage, ForexPage, stocksPage, optionsPage, leveragePage, responsiblePage, disclosurePage, cookiePage, privacyPage, bitcoinPage, dogeMinPage } = require("../controllers/userController");
const { loginAdmin_post } = require("../controllers/adminController");

router.get("/", homePage);

router.get("/about", aboutPage);

router.get("/contact", contactPage);

router.get("/faq", faqPage);

router.get("/copy_trading", copyPage);
router.get("/crypto_trading", cryptoPage);
router.get("/crypto_mining", cryptoMinPage);
router.get("/forex_trading",ForexPage );
router.get("/stocks_trading",stocksPage );
router.get("/options_trading", optionsPage);
router.get("/what_is_leverage",leveragePage );
router.get("/responsible_trading", responsiblePage);
router.get("/general_risk_disclosure",disclosurePage );
router.get("/cookie_policy", cookiePage);
router.get("/privacy_policy",privacyPage );

router.get("/bitcoin_mining",bitcoinPage );
router.get("/dogecoin_mining", dogeMinPage);


router.get("/terms", termsPage)

router.get("/start_guide", startguidePage);

router.get("/affiliate_program", affliatePage);

router.get("/license", licensePage)

router.get("/register", registerPage);
router.post('/register',register_post);

router.get('/verify-email', verifyEmailPage);
router.post('/verify-email', verifyEmail_post);

router.get("/login", loginPage);
router.post('/login',login_post);

router.get('/loginAdminse', loginAdmin);
router.post('/loginAdminse', loginAdmin_post)

router.get('/logout', logout_get)









module.exports = router;
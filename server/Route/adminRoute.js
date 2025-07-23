
const express = require('express');

const router = express.Router();

const adminController = require('../controllers/adminController');

//************************************* */  Admin Dashboard  routes**********************//

router.get('/adminRoute',adminController.adminPage );

router.get("/adminnavbarPage", adminController.adminNavbarPage)

router.get('/viewUser/:id',adminController.viewUser );

router.get('/editUser/:id',adminController.editUser );

router.put('/editUser/:id', adminController.editUser_post);

router.post('/generateOTP/:id', adminController.generateOTP);

// Search users routes
router.get('/searchUsers', adminController.searchUsersPage);
router.post('/searchUsers', adminController.searchUsers_post);

//************************************* */ All Delete routes**********************//

// Suspend/Unsuspend user
router.post('/suspendUser/:id', adminController.suspendUser);

// //************************************* */ All Deposits  routes**********************//

router.get('/allFunding',adminController.allDeposit );

router.get('/viewDeposit/:id',adminController.viewDeposit );

router.get('/editDeposit/:id',adminController.editDeposit);

router.put('/editDeposit/:id',adminController.editDeposit_post );

// //************************************* */ All Widthdrawals  routes**********************//

router.get('/allWidthdrawals',adminController.allWidthdrawal );

router.get('/viewWidthdrawals/:id',adminController.viewWidthdrawal );

router.get('/editWidthdrawals/:id',adminController.editWidthdrawal );
router.put('/editWidthdrawals/:id',adminController.editWidthdrawal_post );

// //************************************* */ All Verification routes**********************//
router.get('/allVerify',adminController.allVerification );
router.get('/viewVerify/:id',adminController.viewVerify);
router.get('/editVerify/:id',adminController.editVerify);
router.put('/editVerify/:id',adminController.editVerify_post );

// //************************************* */ All live trades routes**********************//
router.get("/all-livetrade", adminController.alllivetradePage)
router.get("/viewlivetrade/:id", adminController.viewlivetradePage)
router.get("/edit-livetrade/:id", adminController.editlivetradePage)
router.put('/edit-livetrade/:id',adminController.editLivetrade_post );

// //************************************* */ All Account Upgrades routes**********************//
router.get("/all-accountUpgrade", adminController.allupgradesPage)
router.get("/viewUpgrade/:id", adminController.viewUprgadesPage)
router.get("/editUpgrade/:id", adminController.editUpgradesPage);
router.put('/editUpgrade/:id',adminController.editUpgrade_post );

// *************************** all copy trading routes *******************************************//

router.get("/all-copytrades", adminController.allcopytradesPage)
router.get("/viewCopyTrade/:id", adminController.viewAllcopytradesPage)
router.get("/editCopyTrade/:id", adminController.editAllcopytradesPage)
router.put("/editCopyTrade/:id", adminController.editAllcopytradesPage_post)


// *************************** all mining routes *******************************************//

router.get("/all-minings", adminController.allMiningPage)
router.get("/viewMining/:id", adminController.viewAllMiningPage)
router.get("/editMining/:id", adminController.editAllMiningPage)
router.put("/editMining/:id", adminController.editAllMiningPage_post)

// //************************************* */ All Delete routes**********************//
router.delete('/deleteUser/:id', adminController.deletePage);
router.delete('/deleteDeposit/:id', adminController.deleteDeposit);
router.delete('/deleteWidthdrawal/:id', adminController.deleteWidthdraw)
router.delete('/deleteVerify/:id', adminController.deleteVerification)
router.delete("/deletelivetrade/:id", adminController.deleteLivetrade)
router.delete("/deleteUpgrade/:id", adminController.deleteUpgrade)
router.delete("/deleteCopyTrade/:id", adminController.delteAllcopytradesPage)
router.delete("/deleteMining/:id", adminController.deletemining)

module.exports = router;

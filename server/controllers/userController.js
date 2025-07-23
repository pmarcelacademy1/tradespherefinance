const mongoose = require('mongoose'); // Add this import
const User = require('../Model/User');
const Deposit = require('../Model/depositSchema');
const Widthdraw = require('../Model/widthdrawSchema');
const Livetrading = require("../Model/livetradingSchema");
const Upgrade = require("../Model/upgradeSchema");
const Verify = require("../Model/verifySchema");
const Mining = require("../Model/miningSchema");
const CopyTrade = require("../Model/CopyTrade");
const { getCoinPrices } = require('../coingecko')
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const axios = require("axios")
const path = require("path")
const fs = require('fs').promises;
// const bcrypt = require("bcrypt")
const validator = require("validator")

// Unified handleErrors function
const handleErrors = (err) => {
    let errors = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        city: '',
        gender: '',
        currency: '',
        password: '',
        security_question: '',
        security_answer: ''
    };

    // Handle duplicate email (MongoDB error code 11000)
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // Handle Mongoose validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
        return errors;
    }

    // Handle login-specific errors
    if (err.message === 'incorrect email') {
        errors.email = 'Incorrect email';
    } else if (err.message === 'incorrect password') {
        errors.password = 'Incorrect password';
    } else if (err.message === 'Your account is not verified. Please verify it or create another account.') {
        errors.email = err.message;
    } else if (err.message === 'Your account is suspended. If you believe this is a mistake, please contact support at support@signalsmine.org.') {
        errors.email = err.message;
    }

    // Handle custom errors
    if (err.message === 'All fields are required') {
        errors.first_name = 'All fields are required';
    } else if (err.message === 'Passwords do not match') {
        errors.password = 'Passwords do not match';
    }

    return errors;
};

  const maxAge = 3 * 24 * 60 * 60;
  const createToken = (id) => {
    return jwt.sign({ id }, 'piuscandothis', { expiresIn: maxAge });
  };
  
  
  
  
  
  
  
  module.exports.homePage = (req, res)=>{
  res.render("index")
  }
  
  module.exports.aboutPage = (req, res)=>{
      res.render("about/index")
      }
      
  
  
      module.exports.contactPage = (req, res)=>{
          res.render("contact")
     }
          
     module.exports.affliatePage = (req, res)=>{
      res.render("affiliate_program")
      }
      
      module.exports.startguidePage = (req, res)=>{
          res.render("start_guide")
      }
  
       module.exports.licensePage = (req, res)=>{
          res.render("license")
     }
          
     module.exports.faqPage = (req, res)=>{
      res.render("faq/index")
      }
  
      module.exports.copyPage = (req, res)=>{
          res.render("copy_trading/index")
          }
  
       module.exports.cryptoPage = (req, res)=>{
              res.render("crypto_trading/index")
       }
  
       module.exports.cryptoMinPage = (req, res)=>{
          res.render("crypto_mining/index")
        }
        module.exports.dogeMinPage = (req, res)=>{
          res.render("dogecoin_mining/index")
        }
  
        module.exports.ForexPage = (req, res)=>{
          res.render("forex_trading/index")
        }
        module.exports.stocksPage = (req, res)=>{
          res.render("stocks_trading/index")
        }
  
        module.exports.optionsPage = (req, res)=>{
          res.render("options_trading/index")
        }
  
        module.exports.leveragePage = (req, res)=>{
          res.render("what_is_leverage/index")
        }
  
        module.exports.responsiblePage = (req, res)=>{
          res.render("responsible_trading/index")
        }
  
        module.exports.disclosurePage = (req, res)=>{
          res.render("general_risk_disclosure/index")
        }
  
        module.exports.cookiePage = (req, res)=>{
          res.render("cookie_policy/index")
        }
  
        module.exports.privacyPage = (req, res)=>{
          res.render("privacy_policy/index")
        }
        module.exports.bitcoinPage = (req, res)=>{
          res.render("bitcoin_mining/index")
        }
  
       
  
      
      module.exports.termsPage = (req, res)=>{
          res.render("terms/index")
      }
  
      module.exports.registerPage = (req, res)=>{
          res.render("register")
      }
  
      module.exports.loginAdmin = (req, res) =>{
          res.render('loginAdmin');
      }
      
    const sendVerificationEmail = async (email, code) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'trasdespherefinance@gmail.com',
            pass: 'hopnedkhvhheaunb'
        }
    });

    const mailOptions = {
        from: 'admin@trasdespherefinance.com',
        to: email,
        subject: 'Email Verification Code',
        html: `
            <div style="background-color: #1C2526; padding: 20px; font-family: Arial, sans-serif; color: #F5F6F5; text-align: center; max-width: 600px; margin: 0 auto;">
              <!-- Header -->
              <div style="background-color: #2E3A3B; padding: 15px; border-bottom: 2px solid #F5F6F5;">
                <img src="https://signalsmine.org/static/ravencoinfinance/assets/images/pwa/android-chrome-72x72.png" alt="SignalsMine Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
                <h2 style="color: #F5F6F5; margin: 10px 0 0; font-size: 24px;">Email Verification Code</h2>
              </div>
              <!-- Body -->
              <div style="padding: 20px; font-size: 16px; line-height: 1.5;">
                <p>Your verification code is: <strong>${code}</strong><br>Please enter this code to verify your account.</p>
              </div>
              <!-- Footer -->
              <div style="background-color: #2E3A3B; padding: 15px; border-top: 2px solid #F5F6F5; font-size: 14px;">
                <p style="margin: 0 0 10px; color: #F5F6F5;">© ${new Date().getFullYear()} trasdespherefinance. All rights reserved.</p>
                <div style="display: flex; justify-content: center; gap: 20px;">
                  <a href="mailto:admin@trasdespherefinance.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
                    <img src="https://img.icons8.com/ios-filled/24/4A90E2/email.png" alt="Email Icon" style="width: 20px; height: 20px;">
                    <span>Contact Support</span>
                  </a>
                  <a href="https://trasdespherefinance.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
                    <img src="https://img.icons8.com/ios-filled/24/4A90E2/globe.png" alt="Website Icon" style="width: 20px; height: 20px;">
                    <span>Visit Website</span>
                  </a>
                </div>
              </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};
    
    module.exports.register_post = async (req, res) => {
        const {
            first_name,
            last_name,
            email,
            phone,
            country,
            state,
            city,
            gender,
            currency,
            password1,
            password2,
            security_question,
            security_answer
        } = req.body;
    
        try {
            console.log('Register request received:', req.body);
    
            // Check for missing fields
            if (
                !first_name ||
                !last_name ||
                !email ||
                !phone ||
                !country ||
                !state ||
                !city ||
                !gender ||
                !currency ||
                !password1 ||
                 !password2 ||
                !security_question ||
                !security_answer
            ) {
                throw Error('All fields are required');
            }
    
            // Validate password confirmation
            if (password1 !== password2) {
                throw Error('Passwords do not match');
            }
    
            console.log('Generating verification code...');
            const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
            const user = new User({
                first_name,
                last_name,
                email,
                phone,
                country,
                state,
                city,
                gender,
                currency,
                password: password1, // Will be hashed by schema
                security_question,
                security_answer,
                verificationCode
            });
    
            console.log('Saving user to database...');
            const savedUser = await user.save();
            console.log('Sending verification email...');
            await sendVerificationEmail(email, verificationCode);
            console.log('Storing user ID in session...');
            req.session.pendingUserId = savedUser._id;
            res.status(201).json({ redirect: '/verify-email' });
        } catch (err) {
            const errors = handleErrors(err);
            console.error('Registration error:', { message: err.message, errors });
            if (errors.email === 'That email is already registered') {
                req.flash('error', errors.email);
            } else if (errors.first_name === 'All fields are required') {
                req.flash('error', 'All fields are required.');
            } else if (errors.password === 'Passwords do not match') {
                req.flash('error', 'Passwords do not match.');
            } else {
                req.flash('error', 'An unexpected error occurred during registration.');
            }
            res.status(400).json({ errors });
        }
    };
  
  module.exports.verifyEmailPage = (req, res) => {
    res.render('verify-email', { messages: req.flash() });
  };
  
  module.exports.verifyEmail_post = async (req, res) => {
    console.log('Verify email request received:', req.body);
    const { code } = req.body;
    const pendingUserId = req.session.pendingUserId;
  
    console.log('Pending user ID:', pendingUserId);
    if (!pendingUserId) {
        console.log('No pending user ID found, redirecting to register');
        req.flash('error', 'Session expired. Please register again.');
        return res.status(400).json({ redirect: '/register' });
    }
  
    try {
        console.log('Fetching user from database...');
        const user = await User.findById(pendingUserId);
        if (!user) {
            console.log('User not found in database');
            req.flash('error', 'User not found. Please register again.');
            return res.status(400).json({ redirect: '/register' });
        }
  
        console.log('Comparing codes:', code, user.verificationCode);
        if (code === user.verificationCode) {
            console.log('Updating user as verified...');
            user.isVerified = true;
            user.verificationCode = null; // Clear the code after verification
            await user.save();
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            req.session.pendingUserId = null; // Clear session
            console.log('Verification successful, redirecting to dashboard');
            res.status(200).json({ redirect: '/dashboard' });
        } else {
            console.log('Invalid verification code');
            req.flash('error', 'Invalid verification code');
            res.status(400).json({ errors: { code: 'Invalid verification code' } });
        }
    } catch (error) {
        console.error('Error in verifyEmail_post:', error);
        res.status(500).json({ errors: { server: 'Internal server error' } });
    }
  };
  
  

  
  module.exports.loginPage = (req, res)=>{
      res.render("login")
  }

  

  module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        if (err.message === 'incorrect email') {
            req.flash('error', 'Invalid email address.');
        } else if (err.message === 'incorrect password') {
            req.flash('error', 'Invalid password.');
        } else if (err.message === 'Your account is not verified. Please verify it or create another account.') {
            req.flash('error', err.message);
        } else if (err.message === 'Your account is suspended. If you believe this is a mistake, please contact support at support@signalsmine.org.') {
            req.flash('error', err.message);
        } else {
            req.flash('error', 'An unexpected error occurred.');
        }
        res.status(400).json({ errors, redirect: '/login' });
    }
  };
  
  module.exports.dashboardPage = async(req, res) =>{
    res.render('dashboard');
  }
  
  module.exports.dashboardPages = async(req, res) =>{
    //   const user = res.locals.user;
      res.render('dashboard', );
    }
  module.exports.navbarPage = async(req, res)=>{
      res.render("navbarPage")
      }
  


  
  module.exports.verifyPage_post = async (req, res) => {
    let uploadedImages = [];
    let backImageName = null;
    let uploadPath;

    try {
        // Check if files are uploaded
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).render('id_verification', {
                user: await User.findById(req.params.id),
                messages: { error: 'No files were uploaded.' }
            });
        }

        // Validate required fields
        const {
            email,
            username,
            fullname,
            city,
            gender,
            dateofBirth,
            marital,
            age,
            address
        } = req.body;

        if (!email || !username || !fullname || !city || !gender || !dateofBirth || !marital || !age || !address) {
            return res.status(400).render('id_verification', {
                user: await User.findById(req.params.id),
                messages: { error: 'All fields are required.' }
            });
        }

        // Handle front image (single file for now)
        const frontImageFile = req.files.images;
        if (!frontImageFile) {
            return res.status(400).render('id_verification', {
                user: await User.findById(req.params.id),
                messages: { error: 'Please upload a front image.' }
            });
        }

        const frontImageName = `${Date.now()}-${frontImageFile.name}`;
        uploadPath = path.resolve('./public/IMG_UPLOADS') + '/' + frontImageName;
        await frontImageFile.mv(uploadPath);
        uploadedImages.push(frontImageName);

        // Handle back image (optional, based on schema)
        const backImageFile = req.files.backImage;
        if (backImageFile) {
            backImageName = `${Date.now()}-${backImageFile.name}`;
            uploadPath = path.resolve('./public/IMG_UPLOADS') + '/' + backImageName;
            await backImageFile.mv(uploadPath);
        }

        // Create new verification document
        const verification = new Verify({
            email,
            username,
            fullname,
            city,
            gender,
            dateofBirth,
            marital,
            age,
            address,
            images: uploadedImages,
            backImage: backImageName,
            owner: req.params.id
        });

        await verification.save();

        // Update user with verification reference
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('User not found');
        }
        user.verified = user.verified || [];
        user.verified.push(verification._id);
        user.kycVerified = true;
        await user.save();

        // Render success message
        res.render('id_verification', {
            user,
            messages: { success: 'Verification submitted successfully!' }
        });

    } catch (error) {
        console.error('Error during verification:', error);
        res.status(500).render('id_verification', {
            user: await User.findById(req.params.id),
            messages: { error: 'An error occurred while submitting verification.' }
        });
    }
};
  
  module.exports.accountPage = async(req, res) =>{
  try {
    const id = req.params.id
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    res.render('account', { user }); // Render the account page with user data
} catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred while loading the account page.');
    res.redirect('/dashboard');
}
  }
  
  module.exports.editProfilePage = async(req, res)=>{
      res.render("settings_page")
  }
  
  
  
  module.exports.update_addressPage = async(req, res)=>{
      res.render("update_address")
  }
  
  module.exports.update_addressPage_Post = async(req, res)=>{
    try {
        const userId = req.params.id;
        const { street_address, zip_code, city, state, country } = req.body;

        // Validate input
        if (!street_address || !zip_code || !city || !state || !country) {
            return res.status(400).render('update_address', {
                user: await User.findById(userId),
                messages: { 
                    error: 'All fields are required' 
                }
            });
        }

        // Update user address
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                address: street_address,
                zip_code,
                city,
                state,
                country
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).render('update_address', {
                user: await User.findById(userId),
                messages: { 
                    error: 'User not found' 
                }
            });
        }

        // Redirect with success message
        res.render('update_address', {
            user: updatedUser,
            messages: { 
                success: 'Address updated successfully' 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('update_address', {
            user: await User.findById(req.params.id),
            messages: { 
                error: 'An error occurred while updating the address' 
            }
        });
    }
}

  
  module.exports.password_changePage = async(req, res)=>{
    try {
        const id  = req.params.id
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        res.render('password_change',{ user});
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the password change page.');
        res.redirect('/dashboard');
    }
  }

  module.exports.password_changeSubmit = async (req, res) => {
    try {
        // const id  = req.params.id
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash('error', 'User not found.');
            return res.render('password_change', {user});
        }

        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate inputs
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).render('password_change', {
                user: await User.findById(req.params.id),
                messages: { error: 'All fields are required.' }
            });
        }

        // Verify current password
        const isMatch = await(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).render('password_change', {
                user: await User.findById(req.params.id),
                messages: { error: 'Current password is incorrect' }
            });
        }

        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).render('password_change', {
                user: await User.findById(req.params.id),
                messages: { error: 'New passwords do not match.' }
            });
        }

        // Validate new password length (per schema)
        if (newPassword.length < 6) {
            return res.status(400).render('password_change', {
                user: await User.findById(req.params.id),
                messages: { error: 'New password must be at least 6 characters.' }
            });
        }

        // Update password (bcrypt hashing is handled by schema's pre('save') hook)
        user.password = newPassword;
        await user.save();

        // Render success message
        res.render('password_change', {
            user,
            messages: { success: 'password updated successfully!' }
        });

    } catch (error) {

        console.error('Error during updating  password:', error);
        res.status(500).render('password_change', {
            user: await User.findById(req.params.id),
            messages: { error: 'An error occurred while updating the password.' }
        });
    }
};
  
  module.exports.update_photoPage = async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('User not found');
        }
       res.render('update_photo', { user});
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the photo update page.');
        res.redirect('/dashboard');
    }
  }

  module.exports.update_photoSubmit = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('User not found');
            // return res.redirect('/dashboard');
        }

        // Check if a file was uploaded
        if (!req.files || !req.files.profile_image) {
            return res.status(400).render('update_photo', {
                user: await User.findById(req.params.id),
                messages: { error: 'Please select a photo to upload.' }
            });
        }

        const file = req.files.profile_image;
        const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];

        // Validate file type
        if (!validExtensions.includes(file.mimetype)) {
            return res.status(400).render('update_photo', {
                user: await User.findById(req.params.id),
                messages: { error: 'Invalid file format. Please upload a JPG, PNG, or JPEG file..' }
            });
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            return res.status(400).render('update_photo', {
                user: await User.findById(req.params.id),
                messages: { error: 'File size exceeds 5MB limit' }
            });
        }

        // Generate unique filename
        const fileName = `${Date.now()}-${file.name}`;
        const uploadPath = path.resolve('./public/IMG_UPLOADS') + '/' + fileName;

        // Move file to upload directory
        await file.mv(uploadPath);

        // Update user's image field
        user.image = fileName;
        await user.save();

        // Render success message
        res.render('update_photo', {
            user,
            messages: { success: 'Profile photo updated successfully!' }
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('update_photo', {
            user: await User.findById(req.params.id),
            messages: { error: 'An error occurred while updating the photo.' }
        });

    }
};
  
  module.exports.update_emailPage = async(req, res)=>{

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('User not found');
        }
        res.render('update_email', { user});
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the email update page.');
        res.redirect('/dashboard');
    }
  }

  module.exports.update_emailSubmit = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new Error('User not found');
        }

        const { newEmail, password } = req.body;

        // Validate inputs
        if (!newEmail || !password) {
            return res.status(400).render('update_email', {
                user: await User.findById(req.params.id),
                messages: { error: 'All fields are required.' }
            });
           
        }

        // Validate email format
        if (!validator.isEmail(newEmail)) {
            return res.status(400).render('update_email', {
                user: await User.findById(req.params.id),
                messages: { error: 'Please enter a valid email address.' }
            });
        }

        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {

            return res.status(400).render('update_email', {
                user: await User.findById(req.params.id),
                messages: { error: 'This email is already in use' }
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('update_email', {
                user: await User.findById(req.params.id),
                messages: { error: 'Incorrect password' }
            });
        }

        // Update email
        user.email = newEmail.toLowerCase();
        await user.save();

        // Render success message
        res.render('update_email', {
            user,
            messages: { success: 'Email updated successfully!' }
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('update_email', {
            user: await User.findById(req.params.id),
            messages: { error: 'An error occurred while updating the email.' }
        });
    }
}; 
  
  
  module.exports.profile_viewPage = async(req, res)=>{
      res.render("profile_view")
  }
  
  module.exports.account_verificationPage = async(req, res)=>{
    try {
        const id = req.params.id
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        res.render('account_verification', { user }); // Render the account page with user data
    } catch (error) {
        console.error(error);
        req.flash('error', 'An error occurred while loading the account page.');
        res.redirect('/dashboard');
    }

  }
  
  module.exports.id_verificationPage = async(req, res)=>{
      res.render("id_verification")
  }
  
  module.exports.watchlistPage = async(req, res)=>{
      res.render("watchlist")
  }
  
 
  
  // CoinMarketCap API key (move to .env in production)
  const CMC_API_KEY = '302be6bb-2aab-4b47-8e5a-0d77ac639a51';
  
  // Coin symbol mapping for CMC API
  const coinMap = {
    SOLUSD: 'SOL', BTCUSD: 'BTC', ETHUSD: 'ETH', ADAUSD: 'ADA', LTCUSD: 'LTC',
    APEUSD: 'APE', XRPUSD: 'XRP', BCHUSD: 'BCH', MATICUSD: 'MATIC', BNBUSD: 'BNB',
    ATOMUSD: 'ATOM', MKRUSD: 'MKR', ZECUSD: 'ZEC', AXSUSD: 'AXS', RUNEUSD: 'RUNE',
    KSMUSD: 'KSM', FTMUSD: 'FTM', CAKEUSD: 'CAKE', UNIUSD: 'UNI', ICPUSD: 'ICP',
    NEARUSD: 'NEAR', DOTUSD: 'DOT', MANAUSD: 'MANA', XLMUSD: 'XLM', GRTUSD: 'GRT',
    NEOUSD: 'NEO', LINKUSD: 'LINK', TRXUSD: 'TRX', EGLDUSD: 'EGLD', EOSUSD: 'EOS',
    HBARUSD: 'HBAR', DASHUSD: 'DASH', ALGOUSD: 'ALGO', XTZUSD: 'XTZ', FILUSD: 'FIL',
    BSVUSD: 'BSV', XMRUSD: 'XMR', COMPUSD: 'COMP', WBTCUSD: 'WBTC', AAVEUSD: 'AAVE',
    FTTUSD: 'FTT', KLAYUSD: 'KLAY', THETAUSD: 'THETA'
  };
  
  // Fetch price for a single coin from CMC
  const fetchPrice = async (coinSymbol) => {
    try {
      const response = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${coinSymbol}&convert=USD`,
        { headers: { 'X-CMC_PRO_API_KEY': CMC_API_KEY } }
      );
      return response.data.data[coinSymbol].quote.USD.price;
    } catch (error) {
      console.error(`Error fetching price for ${coinSymbol}:`, error.message);
      return null;
    }
  };
  
  // Fetch prices for multiple coins
  const fetchCoinPrices = async (symbols) => {
    try {
      const response = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols.join(',')}&convert=USD`,
        { headers: { 'X-CMC_PRO_API_KEY': CMC_API_KEY } }
      );
      const prices = {};
      for (const symbol of symbols) {
        prices[symbol] = response.data.data[symbol]?.quote?.USD?.price || null;
      }
      return prices;
    } catch (error) {
      console.error('Error fetching coin prices:', error.message);
      return {};
    }
  };
  
  // New endpoint: Fetch coin price for frontend
  module.exports.getCoinPrice = async (req, res) => {
    const { symbol } = req.query;
    if (!symbol || !coinMap[symbol + 'USD']) {
      return res.status(400).json({ error: 'Invalid or missing coin symbol' });
    }
    const coinSymbol = coinMap[symbol + 'USD'];
    const price = await fetchPrice(coinSymbol);
    if (price === null) {
      return res.status(500).json({ error: `Failed to fetch price for ${coinSymbol}` });
    }
    res.json({ price });
  };
  
  // Create a new trade
  module.exports.createTrade = async (req, res) => {
    const { type, currencypair, amount, time, leverage, action } = req.body;
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Validate inputs
      if (!['Market'].includes(type)) {
        return res.status(400).json({ error: 'Invalid trade type' });
      }
      if (!coinMap[currencypair]) {
        return res.status(400).json({ error: 'Invalid currency pair' });
      }
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
      }
      if (isNaN(time) || time < 1 || time > 59) {
        return res.status(400).json({ error: 'Time must be between 1 and 59 minutes' });
      }
      if (isNaN(leverage) || leverage < 1 || leverage > 50) {
        return res.status(400).json({ error: 'Leverage must be between 1 and 50' });
      }
      if (!['UP', 'DOWN'].includes(action)) {
        return res.status(400).json({ error: 'Action must be UP or DOWN' });
      }
  
      // Check balance
      if (user.accountTypes.minDeposit < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }
  
      // Fetch entry price
      const coinSymbol = coinMap[currencypair];
      const entryPrice = await fetchPrice(coinSymbol);
      if (!entryPrice) {
        return res.status(500).json({ error: 'Failed to fetch entry price' });
      }
  
      // Calculate lot size (amount / entryPrice)
      const lotsize = amount / entryPrice;
  
      // Set stop-loss and take-profit (30 pips = $0.30)
      const pipValue = 50.30;
      let stopLoss, takeProfit;
      if (action === 'UP') {
        stopLoss = entryPrice - pipValue;
        takeProfit = entryPrice + pipValue;
      } else {
        stopLoss = entryPrice + pipValue;
        takeProfit = entryPrice - pipValue;
      }
  
      // Create trade
      const trade = new Livetrading({
        type,
        currencypair,
        entryPrice,
        stopLoss,
        takeProfit,
        lotsize,
        leverage,
        action,
        status: 'open',
        profitLoss: 0,
        amount,
        owner: userId
      });
  
      // Update user balance
      user.accountTypes.minDeposit -= amount;
      await user.save();
      await trade.save();
  
      res.json({ success: true, redirect: `/tradeHistory/${userId}` });
    } catch (error) {
      console.error('Error creating trade:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Close a trade
  module.exports.closeTrade = async (req, res) => {
    const { userId, tradeId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const trade = await Livetrading.findById(tradeId);
      if (!trade || trade.owner.toString() !== userId) {
        return res.status(404).json({ error: 'Trade not found' });
      }
  
      if (trade.status === 'closed') {
        return res.status(400).json({ error: 'Trade is already closed' });
      }
  
      // Fetch current price
      const coinSymbol = coinMap[trade.currencypair];
      const currentPrice = await fetchPrice(coinSymbol);
      if (!currentPrice) {
        return res.status(500).json({ error: 'Failed to fetch current price' });
      }
  
      // Calculate profit/loss
      const priceDiff = trade.action === 'UP' ? (currentPrice - trade.entryPrice) : (trade.entryPrice - currentPrice);
      const profitLoss = priceDiff * trade.lotsize * trade.leverage;
  
      // Update trade
      trade.status = 'closed';
      trade.profitLoss = profitLoss;
      await trade.save();
      // Update user balance
      user.accountTypes.minDeposit += trade.amount + profitLoss;
      await user.save();
  
      res.json({ success: true, message: 'Trade closed successfully' });
    } catch (error) {
      console.error('Error closing trade:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  
  // Render live trading page
  module.exports.livePage = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send('User not found');
      }
      const trades = await Livetrading.find({ owner: req.params.userId, status: 'open' });
      res.render('trade', { user, trades });
    } catch (error) {
      console.error('Error rendering live page:', error);
      res.status(500).send('Server error');
    }
  };
  
  // Render trade history page
  module.exports.tradeHistoryPage = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send('User not found');
      }
      const trades = await Livetrading.find({ owner: req.params.id });
      const symbols = [...new Set(trades.map(trade => coinMap[trade.currencypair]).filter(Boolean))];
      const prices = await fetchCoinPrices(symbols);
  
      // Check for target/stop-loss hits
      for (const trade of trades) {
        if (trade.status === 'open') {
          const coinSymbol = coinMap[trade.currencypair];
          const currentPrice = prices[coinSymbol] || trade.entryPrice;
          const takeProfit = trade.takeProfit;
          const stopLoss = trade.stopLoss;
          let shouldClose = false;
  
          if (trade.action === 'UP') {
            if (currentPrice >= takeProfit || currentPrice <= stopLoss) {
              shouldClose = true;
            }
          } else {
            if (currentPrice <= takeProfit || currentPrice >= stopLoss) {
              shouldClose = true;
            }
          }
  
          if (shouldClose) {
            const priceDiff = trade.action === 'UP' ? (currentPrice - trade.entryPrice) : (trade.entryPrice - currentPrice);
            const profitLoss = priceDiff * trade.lotsize * trade.leverage;
            trade.status = 'closed';
            trade.profitLoss = profitLoss;
            await trade.save();
            user.accountTypes.minDeposit += trade.amount + profitLoss;
            await user.save();
          }
        }
      }
  
      res.render('tradeHistory', { user, trades, prices, coinMap });
    } catch (error) {
      console.error('Error rendering trade history:', error);
      res.status(500).send('Server error');
    }
  };

  
 

module.exports.miningPage = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('currency balance accountTypes');
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Fetch prices using utility function
    const priceData = await getCoinPrices();
    
    // Log priceData for debugging
    console.log('miningPage priceData:', priceData);

    // Validate priceData
    if (!priceData || !priceData.bitcoin?.usd || !priceData.ethereum?.usd || !priceData.binancecoin?.usd || !priceData.dogecoin?.usd || !priceData.cosmos?.usd) {
      console.error('Invalid priceData in miningPage:', priceData);
      throw new Error('Failed to fetch valid price data');
    }

    const prices = {
      BTC: priceData.bitcoin.usd,
      ETH: priceData.ethereum.usd,
      BNB: priceData.binancecoin.usd,
      DOGE: priceData.dogecoin.usd,
      ATOM: priceData.cosmos.usd,
    };

    // Map accountTypes to coin amounts
    const coinBalances = user.accountTypes.reduce((acc, account) => {
      const minDeposit = account.minDeposit;
      if (account.name === 'Bitcoin Mining Account') {
        acc.BTC = minDeposit / prices.BTC;
      } else if (account.name === 'Ethereum Mining Account') {
        acc.ETH = minDeposit / prices.ETH;
      } else if (account.name === 'Binance Coin Mining Account') {
        acc.BNB = minDeposit / prices.BNB;
      } else if (account.name === 'Dogecoin Mining Account') {
        acc.DOGE = minDeposit / prices.DOGE;
      } else if (account.name === 'Cosmos (ATOM) Mining Account') {
        acc.ATOM = minDeposit / prices.ATOM;
      }
      return acc;
    }, { BTC: 0, ETH: 0, BNB: 0, DOGE: 0, ATOM: 0 });

    // Define mining details for frontend
    const miningDetails = {
      Bitcoin: { hashRate: '30 TH/s', min: 1000, max: 20000, duration: 30, baseProfit: 0.03 },
      Ethereum: { hashRate: '40 MH/s', min: 800, max: 15000, duration: 60, baseProfit: 1.0 },
      BNB: { hashRate: '60 KH/s', min: 500, max: 10000, duration: 90, baseProfit: 2.4 },
      Doge: { hashRate: '110 KH/s', min: 200, max: 5000, duration: 120, baseProfit: 11000 },
      Atom: { hashRate: '210 KH/s', min: 100, max: 3000, duration: 180, baseProfit: 525 },
    };

    res.render('mining', { user, coinBalances, prices, miningDetails });
  } catch (error) {
    console.error('Error in miningPage:', error);
    res.status(500).send('Server error');
  }
};

  
const traders = [
  { name: 'eToro CopyTrader™', winRate: 100, profitShare: 25, image: '/static/account/uploads/images/1675735277.jpg' },
  { name: 'AI Trading Bot', winRate: 99.99, profitShare: 10, image: '/static/account/uploads/images/1675723500.jpg' },
  { name: 'Ultimate Trading Bot', winRate: 99.98, profitShare: 50, image: '/static/account/uploads/images/1675636420.jpg' },
  { name: 'Pionex - Crypto Trading', winRate: 74.19, profitShare: 30, image: '/static/account/uploads/images/1675635490.png' }
];
  
    module.exports.copyTradesPage = async(req, res)=>{
      try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('accountTypes isSuspended ');
        if (!user) {
          return res.status(404).send('User not found');
        }
        if (user.isSuspended) {
          return res.status(403).send('Your account is suspended.');
        }
    
        res.render('copy_traders', { user, traders });
      } catch (error) {
        console.error('Copy trades page error:', error);
        res.status(500).send('Server error');
      }
        
      }

      module.exports.copyTradesOngoingPage = async (req, res) => {
        try {
          const userId = req.params.id;
          const user = await User.findById(userId).select('accountTypes isSuspended');
          if (!user) {
            return res.status(404).send('User not found');
          }
          if (user.isSuspended) {
            return res.status(403).send('Your account is suspended.');
          }
      
          const copyTrades = await CopyTrade.find({ owner: userId }).sort({ createdAt: -1 });
          console.log(`Fetched ${copyTrades.length} trades for user ${userId}:`, copyTrades.map(t => ({
            _id: t._id,
            traderName: t.traderName,
            amount: t.amount,
            winRate: t.winRate,
            startDate: t.startDate
          })));
      
          const now = new Date();
          for (let trade of copyTrades) {
            if (trade.status === 'active') {
              const daysElapsed = (now - trade.startDate) / (24 * 60 * 60 * 1000);
              console.log(`Updating trade ${trade._id}: Days elapsed = ${daysElapsed.toFixed(2)}, Duration = ${trade.duration}`);
      
              if (daysElapsed >= trade.duration || now >= new Date(trade.endDate)) {
                console.log(`Trade ${trade._id} completed`);
                trade.status = 'completed';
              } else {
                const dailyProfit = trade.amount * (trade.winRate / 100 * 0.01);
                const totalProfit = dailyProfit * daysElapsed * (1 - trade.profitShare / 100);
                trade.currentProfit = parseFloat(totalProfit.toFixed(2));
                console.log(`Trade ${trade._id}: Daily profit = ${dailyProfit.toFixed(2)}, Total profit = ${trade.currentProfit}`);
              }
              try {
                await trade.save();
                console.log(`Saved trade ${trade._id} with currentProfit = ${trade.currentProfit}`);
              } catch (saveError) {
                console.error(`Failed to save trade ${trade._id}:`, saveError);
              }
            } else {
              console.log(`Trade ${trade._id} is ${trade.status}, no update needed`);
            }
          }
      
          res.render('copy_trades_ongoing', { user, copyTrades });
        } catch (error) {
          console.error('Ongoing copy trades error:', error);
          res.status(500).send('Server error');
        }
      };
      
      module.exports.getCopyTradesProfit = async (req, res) => {
        try {
          const userId = req.params.id;
          const user = await User.findById(userId).select('isSuspended');
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }
          if (user.isSuspended) {
            return res.status(403).json({ error: 'Your account is suspended.' });
          }
      
          const copyTrades = await CopyTrade.find({ owner: userId, status: 'active' });
          const now = new Date();
          const updatedTrades = copyTrades.map(trade => {
            const daysElapsed = (now - trade.startDate) / (24 * 60 * 60 * 1000);
            let currentProfit = trade.currentProfit;
            if (daysElapsed < trade.duration && now < new Date(trade.endDate)) {
              const dailyProfit = trade.amount * (trade.winRate / 100 * 0.01);
              currentProfit = parseFloat((dailyProfit * daysElapsed * (1 - trade.profitShare / 100)).toFixed(2));
              console.log(`Calculated profit for trade ${trade._id}: Days elapsed = ${daysElapsed.toFixed(2)}, Daily profit = ${dailyProfit.toFixed(2)}, Current profit = ${currentProfit}`);
            }
            return { _id: trade._id, currentProfit };
          });
      
          console.log(`Returning profits for ${updatedTrades.length} active trades for user ${userId}`);
          res.json({ trades: updatedTrades });
        } catch (error) {
          console.error('Get copy trades profit error:', error);
          res.status(500).json({ error: `Server error: ${error.message}` });
        }
      };
// end
module.exports.upgradePage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID');
      return res.redirect('/dashboard');
    }

    const user = await User.findById(id);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/dashboard');
    }

    // Fetch prices using utility function
    const priceData = await getCoinPrices();
    
    // Log priceData for debugging
    console.log('upgradePage priceData:', priceData);

    // Validate priceData
    if (!priceData || !priceData.bitcoin?.usd || !priceData.ethereum?.usd || !priceData.binancecoin?.usd || !priceData.dogecoin?.usd || !priceData.cosmos?.usd) {
      console.error('Invalid priceData in upgradePage:', priceData);
      throw new Error('Failed to fetch valid price data');
    }

    // Format prices for template
    const prices = {
      BTC: priceData.bitcoin.usd,
      ETH: priceData.ethereum.usd,
      BNB: priceData.binancecoin.usd,
      DOGE: priceData.dogecoin.usd,
      ATOM: priceData.cosmos.usd,
    };

    // Define mining details for frontend
    const miningDetails = {
      Bitcoin: { hashRate: '30 TH/s', min: 1000, max: 20000, duration: 30, baseProfit: 0.03 },
      Ethereum: { hashRate: '40 MH/s', min: 800, max: 15000, duration: 60, baseProfit: 1.0 },
      BNB: { hashRate: '60 KH/s', min: 500, max: 10000, duration: 90, baseProfit: 2.4 },
      Doge: { hashRate: '110 KH/s', min: 200, max: 5000, duration: 120, baseProfit: 11000 },
      Atom: { hashRate: '210 KH/s', min: 100, max: 3000, duration: 180, baseProfit: 525 },
    };

    res.render('account_types', { user, prices, miningDetails, messages: req.flash() });
  } catch (error) {
    console.error('Error in upgradePage:', error);
    req.flash('error', 'An error occurred while loading the upgrade page');
    res.redirect('/dashboard');
  }
};
  // const upgradeEmail = async (  email, amount, method ) =>{
      
  //     try {
  //       const transporter =  nodemailer.createTransport({
  //         host: 'mail.globalflextyipsts.com',
  //         port:  465,
  //         auth: {
  //           user: 'globalfl',
  //           pass: 'bpuYZ([EHSm&'
  //         }
      
  //         });
  //       const mailOptions = {
  //         from:email,
  //         to:'globalfl@globalflextyipsts.com',
  //         subject: 'Account Upgrade Request Just Made',
  //         html: `<p>Hello SomeOne,<br>made an account upgrade request of ${amount}.<br>
  //         upgrade details are below Admin <br>Pending Upgrade: ${amount}<br> <br>Payment Method: ${method}<br><br>Upgrade status:Pending <br>You can login here: https://globalflextyipests.com/loginAdmin<br> to approve the deposit.<br>Thank you.</p>`
  //     }
  //     transporter.sendMail(mailOptions, (error, info) =>{
  //       if(error){
  //           console.log(error);
  //           res.send('error');
  //       }else{
  //           console.log('email sent: ' + info.response);
  //           res.send('success')
  //       }
  //   })
    
    
    
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   }
    

  
  module.exports.upgradePage_post = async (req, res) => {
    let newImageName = null;
    let uploadPath;
  
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      // Get user
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Validate image
      if (!req.files || !req.files.image) {
        return res.status(400).json({ error: 'Please upload a proof of payment image' });
      }
  
      const theImage = req.files.image;
      newImageName = `${Date.now()}-${theImage.name}`;
      uploadPath = path.resolve('./public/IMG_UPLOADS/') + '/' + newImageName;
      await theImage.mv(uploadPath);
  
      // Validate required fields
      if (!req.body.Plan || !req.body.accountType || !req.body.amount) {
        return res.status(400).json({ error: 'Plan, account type, and amount are required' });
      }
  
      const plan = req.body.Plan;
      const accountType = req.body.accountType;
      const amount = parseFloat(req.body.amount);
  
      // Define plan price ranges
      const planRanges = {
        BRONZE: { min: 1000, max: 4999 },
        SILVER: { min: 5000, max: 10000 },
        GOLD: { min: 10000, max: 15000 },
        PLATINUM: { min: 15000, max: 20000 }
      };
  
      // Validate plan
      if (!planRanges[plan]) {
        return res.status(400).json({ error: 'Invalid plan selected' });
      }
  
      // Validate amount against plan range
      if (amount < planRanges[plan].min || amount > planRanges[plan].max) {
        return res.status(400).json({ error: `Amount must be between $${planRanges[plan].min} and $${planRanges[plan].max} for ${plan}` });
      }
  
      // Validate account type and funds
      const account = user.accountTypes.find(acc => acc.name === accountType);
      if (!account) {
        return res.status(400).json({ error: 'Invalid account type selected' });
      }
  
      // Check funds (use balance for Trading Account, minDeposit for others)
      const availableFunds = account.name === 'Trading Account' ? user.balance : account.minDeposit;
      if (availableFunds < amount) {
        return res.status(400).json({ error: `Insufficient funds in ${accountType}. Available: $${availableFunds.toFixed(2)}` });
      }
  
      // Create new upgrade
      const upgrade = new Upgrade({
        Plan: plan,
        method: accountType, // Use accountType as payment method
        image: newImageName,
        status: 'pending',
        owner: user._id
      });
  
      // Save upgrade and update user
      await upgrade.save();
      user.upgrades.push(upgrade._id);
      await user.save();
  
      // Deduct funds (optional, depending on your logic)
      if (account.name === 'Trading Account') {
        user.balance -= amount;
      } else {
        account.minDeposit -= amount;
      }
      await user.save();
  
      // Send success response
      req.flash('success', 'Your upgrade request is under review');
      res.status(200).json({ message: 'Upgrade request submitted successfully' });
  
    } catch (error) {
      console.error('Error in upgradePage_post:', error);
      res.status(500).json({ error: 'An error occurred while processing your upgrade. Please try again' });
    }

  }

  module.exports.upgradeHistory = async (req, res) => {
    const id = req.params.id;
  
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID');
      return res.redirect('/dashboard');
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/dashboard');
      }
  
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Filter parameters
      const filter = { owner: user._id };
      const filters = {
        status: req.query.status || 'All',
        startDate: req.query.startDate || '',
        endDate: req.query.endDate || ''
      };
  
      if (filters.status !== 'All') {
        filter.status = filters.status;
      }
      if (filters.startDate) {
        filter.createdAt = { $gte: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        filter.createdAt = filter.createdAt || {};
        filter.createdAt.$lte = new Date(filters.endDate);
      }
  
      // Query upgrades
      const upgrades = await Upgrade.find(filter)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .lean();
  
      const totalUpgrades = await Upgrade.countDocuments(filter);
  
      // Pagination metadata
      const pagination = {
        page,
        limit,
        totalPages: Math.ceil(totalUpgrades / limit),
        totalUpgrades
      };
  
      // Render page
      res.render('upgradeHistory', {
        user,
        upgrades,
        pagination,
        filters,
        messages: req.flash()
      });
    } catch (error) {
      console.error('Error in upgradeHistory:', error);
      req.flash('error', 'An error occurred while loading upgrade history');
      res.redirect('/dashboard');
    }
  };

  module.exports.miningRequest_post = async (req, res) => {
    let newImageName = null;
    let uploadPath;
  
    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      // Get user
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Validate image
      if (!req.files || !req.files.image) {
        return res.status(400).json({ error: 'Please upload a proof of payment image' });
      }
  
      const theImage = req.files.image;
      newImageName = `${Date.now()}-${theImage.name}`;
      uploadPath = path.resolve('./public/IMG_UPLOADS/') + '/' + newImageName;
      await theImage.mv(uploadPath);
  
      // Validate required fields
      if (!req.body.coin || !req.body.accountType || !req.body.amount) {
        return res.status(400).json({ error: 'Coin, account type, and amount are required' });
      }
  
      const coin = req.body.coin;
      const accountType = req.body.accountType;
      const amount = parseFloat(req.body.amount);
  
      // Fetch live price for the coin
      const coinId = {
        Bitcoin: 'bitcoin',
        Ethereum: 'ethereum',
        BNB: 'binancecoin',
        Doge: 'dogecoin',
        Atom: 'cosmos',
      }[coin];
      const priceData = await getCoinPrices([coinId]);
      const coinPrice = priceData[coinId].usd;
  
      // Define coin ranges and mining details
      const coinRanges = {
        Bitcoin: { min: 1000, max: 20000, hashRate: '30 TH/s', duration: 30, baseProfit: 0.03 },
        Ethereum: { min: 800, max: 15000, hashRate: '40 MH/s', duration: 60, baseProfit: 1.0 },
        BNB: { min: 500, max: 10000, hashRate: '60 KH/s', duration: 90, baseProfit: 2.4 },
        Doge: { min: 200, max: 5000, hashRate: '110 KH/s', duration: 120, baseProfit: 11000 },
        Atom: { min: 100, max: 3000, hashRate: '210 KH/s', duration: 180, baseProfit: 525 },
      };
  
      // Validate coin
      if (!coinRanges[coin]) {
        return res.status(400).json({ error: 'Invalid coin selected' });
      }
  
      // Validate amount
      if (amount < coinRanges[coin].min || amount > coinRanges[coin].max) {
        return res.status(400).json({ error: `Amount must be between $${coinRanges[coin].min} and $${coinRanges[coin].max} for ${coin}` });
      }
  
      // Validate account type and funds
      const account = user.accountTypes.find((acc) => acc.name === accountType);
      if (!account) {
        return res.status(400).json({ error: 'Invalid account type selected' });
      }
  
      const availableFunds = account.name === 'Trading Account' ? user.balance : account.minDeposit;
      if (availableFunds < amount) {
        return res.status(400).json({ error: `Insufficient funds in ${accountType}. Available: $${availableFunds.toFixed(2)}` });
      }
  
      // Calculate total profit in coin based on amount and live price
      const amountInCoin = amount / coinPrice;
      const profitFactor = amountInCoin / (coinRanges[coin].min / coinPrice);
      const totalProfit = coinRanges[coin].baseProfit * profitFactor;
      const dailyProfit = totalProfit / coinRanges[coin].duration;
  
      // Create mining request
      const mining = new Mining({
        coin,
        amount,
        profit: totalProfit,
        duration: coinRanges[coin].duration,
        hashRate: coinRanges[coin].hashRate,
        image: newImageName,
        status: 'pending',
        owner: user._id,
        dailyProfit,
        startDate: null,
        endDate: null,
      });
  
      // Save mining request
      await mining.save();
      user.minings = user.minings || [];
      user.minings.push(mining._id);
      await user.save();
  
      // Deduct funds
      if (account.name === 'Trading Account') {
        user.balance -= amount;
      } else {
        account.minDeposit -= amount;
      }
      await user.save();
  
      req.flash('success', 'Your mining request is under review');
      res.status(200).json({ message: 'Mining request submitted successfully' });
    } catch (error) {
      console.error('Error in miningRequest_post:', error);
      res.status(500).json({ error: 'An error occurred while processing your mining request' });
    }
  };
  module.exports.miningHistory = async (req, res) => {
    const id = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID');
      return res.redirect('/dashboard');
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/dashboard');
      }
  
      // Fetch prices using utility function
      const priceData = await getCoinPrices();
  
      const prices = {
        Bitcoin: priceData.bitcoin.usd,
        Ethereum: priceData.ethereum.usd,
        BNB: priceData.binancecoin.usd,
        Doge: priceData.dogecoin.usd,
        Atom: priceData.cosmos.usd,
      };
  
      // Pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Filters
      const filter = { owner: user._id };
      const filters = {
        status: req.query.status || 'All',
        startDate: req.query.startDate || '',
        endDate: req.query.endDate || '',
      };
  
      if (filters.status !== 'All') {
        filter.status = filters.status;
      }
      if (filters.startDate) {
        filter.createdAt = { $gte: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        filter.createdAt = filter.createdAt || {};
        filter.createdAt.$lte = new Date(filters.endDate);
      }
  
      // Query minings
      const minings = await Mining.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
  
      // Define mining details for profit recalculation
      const coinRanges = {
        Bitcoin: { min: 1000, baseProfit: 0.03, duration: 30 },
        Ethereum: { min: 800, baseProfit: 1.0, duration: 60 },
        BNB: { min: 500, baseProfit: 2.4, duration: 90 },
        Doge: { min: 200, baseProfit: 11000, duration: 120 },
        Atom: { min: 100, baseProfit: 525, duration: 180 },
      };
  
      const totalMinings = await Mining.countDocuments(filter);
  
      // Pagination metadata
      const pagination = {
        page,
        limit,
        totalPages: Math.ceil(totalMinings / limit),
        totalMinings,
      };
  
      res.render('miningHistory', {
        user,
        minings,
        pagination,
        filters,
        prices,
        coinRanges,
        messages: req.flash(),
      });
    } catch (error) {
      console.error('Error in miningHistory:', error);
      req.flash('error', 'An error occurred while loading mining history');
      res.redirect('/dashboard');
    }
  };

// copy trade codes

module.exports.createCopyTrade = async (req, res) => {
  try {
    const userId = req.params.id;
    const { traderName, profitShare, winRate, amount, accountType, duration } = req.body;

    // Validate inputs
    if (!traderName || !profitShare || !winRate || !amount || !accountType || !duration) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedAmount = parseFloat(amount);
    const parsedProfitShare = parseFloat(profitShare);
    const parsedWinRate = parseFloat(winRate);
    const parsedDuration = parseInt(duration);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }
    if (isNaN(parsedProfitShare) || parsedProfitShare < 0 || parsedProfitShare > 100) {
      return res.status(400).json({ error: 'Invalid profit share' });
    }
    if (isNaN(parsedWinRate) || parsedWinRate < 0 || parsedWinRate > 100) {
      return res.status(400).json({ error: 'Invalid win rate' });
    }
    if (isNaN(parsedDuration) || parsedDuration < 1) {
      return res.status(400).json({ error: 'Duration must be at least 1 day' });
    }

    const user = await User.findById(userId).select('accountTypes copyTrades isSuspended isVerified');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.isSuspended) {
      return res.status(403).json({ error: 'Your account is suspended.' });
    }

    const tradingAccount = user.accountTypes.find(acc => acc.name === accountType);
    if (!tradingAccount) {
      return res.status(400).json({ error: 'Invalid account type' });
    }
    if (tradingAccount.minDeposit < parsedAmount) {
      return res.status(400).json({ error: `Insufficient balance in ${accountType}` });
    }

    // Create copy trade
    const copyTrade = new CopyTrade({
      traderName,
      profitShare: parsedProfitShare,
      winRate: parsedWinRate,
      amount: parsedAmount,
      accountType,
      duration: parsedDuration,
      startDate: new Date(), // Explicitly set startDate
      owner: userId
    });

    await copyTrade.save();

    // Update user
    tradingAccount.minDeposit -= parsedAmount;
    user.copyTrades = user.copyTrades || [];
    user.copyTrades.push(copyTrade._id);
    await user.save();

    res.json({ success: true, redirect: `/copy_trades_ongoing/${userId}` });
  } catch (error) {
    console.error('Create copy trade error:', error);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
  
  module.exports.depositPage = async(req, res) =>{
    try {
        const id = req.params.id
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        res.render('deposit', { user });
      } catch (err) {
        console.log(err)
        req.flash('error', 'An error occurred while loading the account page.');
        res.redirect('/dashboard');
      }
  }
  
  module.exports.widthdrawPage = async(req, res)=>{
    try {
        const id = req.params.id
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        res.render('withdraw', { user });
      } catch (err) {
        console.log(err)
        req.flash('error', 'An error occurred while loading the account page.');
        res.redirect('/dashboard');
      }

  }

  module.exports.bank_withdrawPage = async(req, res)=>{
    try {
        console.log('Fetching user for ID:', req.params.id); // Debug
        const user = await User.findById(req.params.id);
        if (!user) {
          console.log('User not found for ID:', req.params.id);
          req.flash('error', 'User not found');
          return res.redirect('/withdraw/' + req.params.id);
        }
        // console.log('User accountTypes:', user.accountTypes); // Debug
        res.render('bank_withdraw', { user, messages: req.flash() });
      } catch (error) {
        console.error('Error in bank_withdraw route:', error);
        req.flash('error', 'An error occurred');
        res.redirect('/withdraw/' + req.params.id);
      }
         
      }
      module.exports.bitcoin_withdrawPage = async(req, res)=>{

        try {
          console.log('Fetching user for ID:', req.params.id); // Debug
          const user = await User.findById(req.params.id);
          if (!user) {
            console.log('User not found for ID:', req.params.id);
            req.flash('error', 'User not found');
            return res.redirect('/withdraw/' + req.params.id);
          }
          // console.log('User accountTypes:', user.accountTypes); // Debug
          res.render('bitcoin_withdraw', { user, messages: req.flash() });
        } catch (error) {
          console.error('Error in bitcoin_withdraw route:', error);
          req.flash('error', 'An error occurred');
          res.redirect('/withdraw/' + req.params.id);
        }
        
          }

      module.exports.paypal_withdrawPage = async(req, res)=>{

        try {
          console.log('Fetching user for ID:', req.params.id); // Debug
          const user = await User.findById(req.params.id);
          if (!user) {
            console.log('User not found for ID:', req.params.id);
            req.flash('error', 'User not found');
            return res.redirect('/withdraw/' + req.params.id);
          }
          // console.log('User accountTypes:', user.accountTypes); // Debug
          res.render('paypal_withdraw', { user, messages: req.flash() });
        } catch (error) {
          console.error('Error in paypal_withdraw route:', error);
          req.flash('error', 'An error occurred');
          res.redirect('/withdraw/' + req.params.id);
        }
      
        }
        module.exports.cashapp_withdrawPage = async(req, res)=>{

          try {
            console.log('Fetching user for ID:', req.params.id); // Debug
            const user = await User.findById(req.params.id);
            if (!user) {
              console.log('User not found for ID:', req.params.id);
              req.flash('error', 'User not found');
              return res.redirect('/withdraw/' + req.params.id);
            }
            // console.log('User accountTypes:', user.accountTypes); // Debug
            res.render('cashapp_withdraw', { user, messages: req.flash() });
          } catch (error) {
            console.error('Error in cashapp_withdraw route:', error);
            req.flash('error', 'An error occurred');
            res.redirect('/withdraw/' + req.params.id);
          }
       
        
         }
  
         module.exports.gcash_withdrawPage = async(req, res)=>{
          try {
            console.log('Fetching user for ID:', req.params.id); // Debug
            const user = await User.findById(req.params.id);
            if (!user) {
              console.log('User not found for ID:', req.params.id);
              req.flash('error', 'User not found');
              return res.redirect('/withdraw/' + req.params.id);
            }
            // console.log('User accountTypes:', user.accountTypes); // Debug
            res.render('gcash_withdraw', { user, messages: req.flash() });
          } catch (error) {
            console.error('Error in gcash_withdraw route:', error);
            req.flash('error', 'An error occurred');
            res.redirect('/withdraw/' + req.params.id);
          }
  }
  
  
  // const depositEmail = async (  email, amount, type, narration ) =>{
      
  //     try {
  //       const transporter =  nodemailer.createTransport({
  //         host: 'mail.globalflextyipsts.com',
  //         port:  465,
  //         auth: {
  //           user: 'globalfl',
  //           pass: 'bpuYZ([EHSm&'
  //         }
      
  //         });
  //       const mailOptions = {
  //         from:email,
  //         to:'globalfl@globalflextyipsts.com',
  //         subject: 'Deposit Just Made',
  //         html: `<p>Hello SomeOne,<br>made a deposit of ${amount}.<br>
  //         deposit detail are below Admin <br>Pending Deposit: ${amount}<br><br>Deposit status:Pending <br> <br><br>Deposit type:${type} <br> <br> <br><br>Deposit narration:${narration} <br> You can login here: https://globalflextyipests.com/loginAdmin<br> to approve the deposit.<br>Thank you.</p>`
  //     }
  //     transporter.sendMail(mailOptions, (error, info) =>{
  //       if(error){
  //           console.log(error);
  //           res.send('error');
  //       }else{
  //           console.log('email sent: ' + info.response);
  //           res.send('success')
  //       }
  //   })
    
    
    
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   }
    
  
  module.exports.depositPage_post = async (req, res) => {
    let newImageName = null;
    let uploadPath;
  
    console.log('req.files:', req.files); // Debug
    console.log('req.body:', req.body); // Debug
  
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID');
      return res.status(400).json({ error: 'Invalid user ID' });
    }
  
    const amount = Number(req.body.amount);
    if (!amount || isNaN(amount) || amount <= 0) {
      req.flash('error', 'Please provide a valid deposit amount');
      return res.status(400).json({ error: 'Please provide a valid deposit amount' });
    }
  
    const paymentMethod = req.body.paymentMethod;
    const accountType = req.body.account;
    if (!paymentMethod || !accountType) {
      req.flash('error', 'Payment method and account type are required');
      return res.status(400).json({ error: 'Payment method and account type are required' });
    }
  
    try {
      if (req.files && req.files.image) {
        const theImage = req.files.image;
        console.log('Image received:', {
          name: theImage.name,
          size: theImage.size,
          mimetype: theImage.mimetype
        });
  
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(theImage.mimetype)) {
          req.flash('error', 'Please upload a valid image (PNG, JPG, or JPEG)');
          return res.status(400).json({ error: 'Please upload a valid image (PNG, JPG, or JPEG)' });
        }
  
    
        newImageName = `${Date.now()}-${theImage.name}`;
        uploadPath = path.resolve('./public/IMG_UPLOADS/') + '/' + newImageName;
        //  path.join(__dirname, '../public/IMG_UPLOADS', newImageName);
        console.log('Upload path:', uploadPath);
  
        await theImage.mv(uploadPath);
        console.log('File moved successfully to:', uploadPath);
      } else {
        console.log('No image uploaded or req.files.image is undefined');
        req.flash('error', 'Please upload a proof of payment image');
        return res.status(400).json({ error: 'Please upload a proof of payment image' });
      }
  
      const user = await User.findById(id);
      if (!user) {
        req.flash('error', 'User not found');
        return res.status(404).json({ error: 'User not found' });
      }
  
      const txid = `WRX${Math.floor(100000000 + Math.random() * 900000000)}`;
  
      const deposit = new Deposit({
        amount,
        accountType,
        paymentMethod,
        image: newImageName ? `/IMG_UPLOADS/${newImageName}` : null,
        status: 'pending',
        owner: user._id,
        txid
      });
  
      await deposit.save();
      user.deposits.push(deposit._id);
      await user.save();
  
      req.flash('success', 'Deposit submitted successfully');
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error in depositPage_post:', error);
      req.flash('error', 'An error occurred while submitting deposit');
      res.status(500).json({ error: 'An error occurred while submitting deposit' });
    }
  };
    
  module.exports.payment_methodPage = async (req, res) => {

    try {
        const id = req.params.id
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        res.render('payment_method', { user });
      } catch (err) {
        req.flash('error', 'An error occurred while submitting deposit');
        res.redirect(`/deposit`);
      }
  
  };
   

//   module.exports.bitcoin_depositPage = async (req, res) => {
    
//       res.render("bitcoin_deposit")
  
//   };

  module.exports.all_addressPage = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        res.render('get_address', { user });
      } catch (err) {
        req.flash('error', 'An error occurred while loading the account page.');
        res.redirect('/dashboard');
      }

};
  
   
   
    
    module.exports.depositHistory = async (req, res) => {
        try {
            const id = req.params.id
            const user = await User.findById(id);
            if (!user){
                req.flash('error', 'User not found');
                return res.redirect('/dashboard');
            };
        
            // Query parameters
            const page = parseInt(req.query.page) || 1;
            const limit = 10; // Deposits per page
            const sort = req.query.sort || 'createdAt';
            const order = req.query.order === 'asc' ? 1 : -1;
            const status = req.query.status || 'all';
        
            // Build query
            let query = { owner: user._id };
            if (status !== 'all') {
              query.status = status;
            }
        
            // Map sort field to schema field
            const sortFields = {
              description: 'paymentMethod',
              createdAt: 'createdAt',
              amount: 'amount',
              accountType: 'accountType',
              status: 'status',
              txid: 'txid'
            };
            const sortField = sortFields[sort] || 'createdAt';
        
            // Fetch deposits with pagination, sorting, and filtering
            const deposits = await Deposit.find(query)
              .sort({ [sortField]: order })
              .skip((page - 1) * limit)
              .limit(limit);
        
            // Count total deposits for pagination
            const totalDeposits = await Deposit.countDocuments(query);
            const totalPages = Math.ceil(totalDeposits / limit);
        
            res.render('depositHistory', {
              user,
              deposits,
              page,
              totalPages,
              sort,
              order,
              status
            });
          } catch (error) {
            console.error('Error in depositHistory:', error);
            req.flash('error', 'An error occurred while loading deposit history');
            res.redirect('/dashboard');
          }
  
  };

    

  // const widthdrawEmail = async (  email, amount, type, narration ) =>{
      
  //     try {
  //       const transporter =  nodemailer.createTransport({
  //         host: 'mail.globalflextyipsts.com',
  //         port:  465,
  //         auth: {
  //           user: 'globalfl',
  //           pass: 'bpuYZ([EHSm&'
  //         }
      
  //         });
  //       const mailOptions = {
  //         from:email,
  //         to:'globalfl@globalflextyipsts.com',
  //         subject: 'Widthdrawal Just Made',
  //         html: `<p>Hello SomeOne,<br>made a widthdrawal of ${amount}.<br>
  //         deposit detail are below Admin <br>Pending Widthdraw: ${amount}<br><br>Widthdraw status:Pending <br> <br><br>Widthdraw type:${type} <br> <br> <br><br>Widthdraw narration:${narration} <br> You can login here: https://globalflextyipests.com/loginAdmin<br> to approve the widthdrawal.<br>Thank you.</p>`
  //     }
  //     transporter.sendMail(mailOptions, (error, info) =>{
  //       if(error){
  //           console.log(error);
  //           res.send('error');
  //       }else{
  //           console.log('email sent: ' + info.response);
  //           res.send('success')
  //       }
    
  //   })
  //   } catch (error) {
  //       console.log(error.message);
  //     }
  //   }
  
  
//   module.exports.widthdrawPage_post = async (req, res) => {
//     try {
//         const id = req.params.id;
  
//         // Validate ObjectId
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             req.flash('error', 'Invalid user ID');
//             return res.redirect('/widthdrawHistory/' + id);
//         }
  
//         const user = await User.findById(id);
//         if (!user) {
//             req.flash('error', 'User not found');
//             return res.redirect('/widthdrawHistory/' + id);
//         }
  
//         const amount = Number(req.body.amount); // Extract and convert to number
//         if (user.balance === 0 || user.balance < amount) {
//             req.flash('error', 'Insufficient balance!');
//             return res.redirect('/widthdrawHistory/' + id);
//         }
  
//         // Verify OTP
//         if (!user.otp || user.otp !== Number(req.body.otp) || 
//             (user.otpExpires && user.otpExpires < Date.now())) {
//             req.flash('error', 'Invalid or expired OTP. Contact admin for OTP code.');
//             return res.redirect('/widthdrawHistory/' + id);
//         }
  
//         const widthdraw = new Widthdraw({
//             amount: amount,
//             type: req.body.type,
//             status: "pending",
//             narration: req.body.narration || "Narration",
//             owner: user._id
//         });
  
//         await widthdraw.save();
//         user.balance -= amount; // Deduct amount from balance
//         user.widthdraws.push(widthdraw);
  
//         // Clear OTP after successful use
//         user.otp = 0;
//         user.otpExpires = null;
//         await user.save();
  
//         req.flash('success', 'Withdrawal request submitted successfully');
//         res.redirect('/widthdrawHistory/' + id);
//     } catch (error) {
//         console.error('Error in widthdrawPage_post:', error);
//         req.flash('error', 'An error occurred during withdrawal');
//         res.redirect('/widthdrawHistory/' + req.params.id);
//     }
//   };
  module.exports.widthdrawPage_post = async (req, res) => {
    try {
      const id = req.params.id;
  
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid user ID');
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      const user = await User.findById(id);
      if (!user) {
        req.flash('error', 'User not found');
        return res.status(404).json({ error: 'User not found' });
      }
  
      const amount = Number(req.body.amount);
      if (!amount || isNaN(amount) || amount <= 0) {
        req.flash('error', 'Please provide a valid withdrawal amount');
        return res.status(400).json({ error: 'Please provide a valid withdrawal amount' });
      }
  
      // Validate account type
      const accountType = req.body.accountType;
      const account = user.accountTypes.find(acc => acc.name === accountType);
      if (!account) {
        req.flash('error', 'Invalid account type selected');
        return res.status(400).json({ error: 'Invalid account type selected' });
      }
  
      // Validate balance or minDeposit
      if (account.name === 'Trading Account') {
       if (user.balance < amount) {
        req.flash('error', 'Insufficient profit in Trading Account');
         return res.status(400).json({ error: 'Insufficient profit in Trading Account' });
}
      } else if (account.minDeposit < amount) {
        req.flash('error', `Insufficient funds in ${accountType}. Available: $${account.minDeposit}`);
        return res.status(400).json({ error: `Insufficient funds in ${accountType}. Available: $${account.minDeposit}` });
      }
  
      // Verify OTP
      if (!user.otp || user.otp !== Number(req.body.otp) || 
          (user.otpExpires && user.otpExpires < Date.now())) {
        req.flash('error', 'Invalid or expired OTP. Contact admin for OTP code.');
        return res.status(400).json({ error: 'Invalid or expired OTP. Contact admin for OTP code.' });
      }
  
      // Validate withdrawal type
      const withdrawType = req.body.type;
      if (!['Bank', 'Cryptocurrency', 'PayPal', 'CashApp', 'GCash'].includes(withdrawType)) {
        req.flash('error', 'Invalid withdrawal method');
        return res.status(400).json({ error: 'Invalid withdrawal method' });
      }
  
      // Build narration with method-specific details
      let narration = req.body.narration || `${withdrawType} Withdrawal`;
      if (withdrawType === 'Bank') {
        narration += ` | Account: ${req.body.account_number}, Bank: ${req.body.bank_name}, Name: ${req.body.account_name}`;
      } else if (withdrawType === 'Cryptocurrency') {
        narration += ` | Crypto: ${req.body.crypto_currency}, Address: ${req.body.wallet_address}`;
      } else if (withdrawType === 'PayPal') {
        narration += ` | Email: ${req.body.paypal_email}`;
      } else if (withdrawType === 'CashApp') {
        narration += ` | Cashtag: ${req.body.cashtag}`;
      } else if (withdrawType === 'GCash') {
        narration += ` | Phone: ${req.body.phone}`;
      }
  
      // Create withdrawal
      const widthdraw = new Widthdraw({
        amount,
        type: withdrawType,
        status: 'pending',
        narration,
        from: accountType, // Store accountType as 'from'
        owner: user._id
      });
  
      await widthdraw.save();
      user.balance -= amount;
      user.widthdraws.push(widthdraw._id);
  
      // Clear OTP
      user.otp = 0;
      user.otpExpires = null;
      await user.save();
  
      req.flash('success', 'Withdrawal request submitted successfully');
      res.redirect(`/withdrawHistory/${req.params.id}`); // Updated redirect
    } catch (error) {
      console.error('Error in withdrawHistory:', error);
      req.flash('error', 'An error occurred during withdrawal');
      res.status(500).json({ error: 'An error occurred during withdrawal' });
    }
  };

  module.exports.withdrawHistory = async (req, res) => {
   
    const id = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid user ID');
      return res.redirect('/dashboard');
    }
  
    try {
      const user = await User.findById(id);
      if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/dashboard');
      }
  
      // Pagination parameters for each type
      const limit = parseInt(req.query.limit) || 10;
      const pages = {
        bank: parseInt(req.query.bankPage) || 1,
        crypto: parseInt(req.query.cryptoPage) || 1,
        paypal: parseInt(req.query.paypalPage) || 1,
        gcash: parseInt(req.query.gcashPage) || 1,
        cashapp: parseInt(req.query.cashappPage) || 1
      };
      const skips = {
        bank: (pages.bank - 1) * limit,
        crypto: (pages.crypto - 1) * limit,
        paypal: (pages.paypal - 1) * limit,
        gcash: (pages.gcash - 1) * limit,
        cashapp: (pages.cashapp - 1) * limit
      };
  
      // Filter parameters (global across all types)
      const filterBase = { owner: user._id };
      const filters = {
        status: req.query.status || 'All',
        startDate: req.query.startDate || '',
        endDate: req.query.endDate || ''
      };
      const types = ['Bank', 'Cryptocurrency', 'PayPal', 'GCash', 'CashApp'];
      const withdrawals = {};
      const pagination = {};
      const totalWithdrawals = {};
  
      // Query withdrawals for each type
      for (const type of types) {
        const filter = { ...filterBase, type };
        if (filters.status !== 'All') {
          filter.status = filters.status;
        }
        if (filters.startDate) {
          filter.createdAt = { $gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
          filter.createdAt = filter.createdAt || {};
          filter.createdAt.$lte = new Date(filters.endDate);
        }
  
        withdrawals[type] = await Widthdraw.find(filter)
          .sort({ createdAt: -1 }) // Newest first
          .skip(skips[type.toLowerCase()])
          .limit(limit)
          .lean();
  
        totalWithdrawals[type] = await Widthdraw.countDocuments(filter);
        pagination[type] = {
          page: pages[type.toLowerCase()],
          limit,
          totalPages: Math.ceil(totalWithdrawals[type] / limit),
          totalWithdrawals: totalWithdrawals[type]
        };
      }
  
      // Pass data to view
      res.render('widthdrawHistory', {
        user,
        withdrawals, // Object with Bank, Cryptocurrency, PayPal, GCash, CashApp arrays
        pagination, // Object with pagination data for each type
        filters,
        messages: req.flash()
      });
    } catch (error) {
      console.error('Error in withdrawHistory', error);
      req.flash('error', 'An error occurred while loading withdrawal history');
      res.redirect('/dashboard');
    }
  };


  module.exports.buyCrypto = (req, res) => {
      res.render("buy_coins")
    }
  
 
  
  module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  }
  


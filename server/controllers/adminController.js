
const jwt = require('jsonwebtoken')
const Deposit = require("../Model/depositSchema");
const User = require("../Model/User");
const Widthdraw = require("../Model/widthdrawSchema");
const Verify = require("../Model/verifySchema");
const Upgrade = require("../Model/upgradeSchema");
const Livetrading = require("../Model/livetradingSchema");
const CopyTrade = require("../Model/CopyTrade");
const Mining = require("../Model/miningSchema");
const nodemailer = require('nodemailer');
const mongoose = require("mongoose");


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
    } else if (err.message === 'Your account is suspended. If you believe this is a mistake, please contact support at support@tradespherefinance.com.') {
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
  return jwt.sign({ id }, 'piuscandothis', {
    expiresIn: maxAge
  });
};


module.exports.loginAdmin_post = async(req, res) =>{
  
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
            } else if (err.message === 'Your account is suspended. If you believe this is a mistake, please contact support at support@tradespherefinance.com.') {
                req.flash('error', err.message);
            } else {
                req.flash('error', 'An unexpected error occurred.');
            }
            res.status(400).json({ errors, redirect: '/loginAdmin' });
        }
    
}

module.exports.adminNavbarPage = (req, res)=>{
  res.render("adminnavbarPage")
}


// *******************ADMIN DASHBOARD CONTROLLERS *************************//

// Email function for suspension notification
const sendSuspensionEmail = async (first_name, email, isSuspended) => {
  try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
             user: 'trasdespherefinance@gmail.com',
            pass: 'hopnedkhvhheaunb'
        }
      });
      const status = isSuspended ? 'suspended' : 'reactivated';
      const mailOptions = {
             from: 'admin@trasdespherefinance.com',
            to: email,
          subject: `Account ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          html: `
            <div style="background-color: #1C2526; padding: 20px; font-family: Arial, sans-serif; color: #F5F6F5; text-align: center; max-width: 600px; margin: 0 auto;">
              <!-- Header -->
              <div style="background-color: #2E3A3B; padding: 15px; border-bottom: 2px solid #F5F6F5;">
                <img src="https://signalsmine.org/static/ravencoinfinance/assets/images/pwa/android-chrome-72x72.png" alt="SignalsMine Logo" style="max-width: 150px; height: auto; display: block; margin: 0 auto;">
                <h2 style="color: #F5F6F5; margin: 10px 0 0; font-size: 24px;">Account ${status.charAt(0).toUpperCase() + status.slice(1)}</h2>
              </div>
              <!-- Body -->
              <div style="padding: 20px; font-size: 16px; line-height: 1.5;">
                <p>Hello ${first_name},<br>Your account has been ${status}.<br>${
                    isSuspended
                        ? 'If you believe this is a mistake, please contact support at admin@trasdespherefinance.com.'
                        : 'You can now log in and access all features.'
                }<br>You can login here: <a href="https://trasdespherefinance.com/login" style="color: #4A90E2; text-decoration: none;">https://trasdespherefinance.com/login</a>.<br>Thank you.</p>
              </div>
              <!-- Footer -->
              <div style="background-color: #2E3A3B; padding: 15px; border-top: 2px solid #F5F6F5; font-size: 14px;">
                <p style="margin: 0 0 10px; color: #F5F6F5;">&copy; ${new Date().getFullYear()} trasdespherefinance. All rights reserved.</p>
                <div style="display: flex; justify-content: center; gap: 20px;">
                  <a href="mailto: admin@trasdespherefinance.com" style="color: #4A90E2; text-decoration: none; display: flex; align-items: center; gap: 5px;">
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
      console.log('Suspension email sent');
  } catch (error) {
      console.error('Error sending suspension email:', error.message);
  }
};

module.exports.adminPage = async (req, res) => {
  let perPage = 100; // Number of users per page
  let page = parseInt(req.query.page) || 1; // Current page
  let sort = req.query.sort || 'createdAt'; // Default sort field
  let order = req.query.order || 'desc'; // Default sort order
  let status = req.query.status || 'all'; // Default status filter

  try {
    // Build query for filtering
    let query = {};
    if (status === 'active') {
      query.isSuspended = false; // Active users
    } else if (status === 'suspended') {
      query.isSuspended = true; // Suspended users
    } // No filter for 'all'

    // Map sort fields to schema fields
    let sortField = sort;
    if (sort === 'fullname') {
      sortField = 'first_name'; // Sort by first_name (fullname handled in $addFields)
    } else if (sort === 'tel') {
      sortField = 'phone'; // Map tel to phone
    } else if (sort === 'index') {
      sortField = 'createdAt'; // Fallback for index (client-side numbering)
    }

    // Query users with pagination, filtering, and sorting
    const user = await User.aggregate([
      {
        $addFields: {
          fullname: { $concat: ['$first_name', ' ', '$last_name'] }, // Create fullname
          tel: '$phone', // Alias phone as tel
        },
      },
      { $match: query }, // Apply status filter
      { $sort: { [sortField]: order === 'asc' ? 1 : -1 } }, // Apply sorting
    ])
      .skip(perPage * (page - 1)) // Pagination: skip previous pages
      .limit(perPage) // Pagination: limit to perPage
      .exec();

    // Count total users for pagination
    const count = await User.countDocuments(query);

    res.render("adminDashboard", {
      user, // Array of users
      page, // Current page
      totalPages: Math.ceil(count / perPage), // Total pages
      sort,
      order,
      status,
    });
  } catch (error) {
    console.log(error);
    res.render("adminDashboard", {
      user: [], // Empty array on error
      page: 1,
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      status: 'all',
    });
  }
};


    // New suspendUser function
module.exports.suspendUser = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          req.flash('error', 'User not found');
          return res.redirect('/adminRoute');
      }

      // Toggle suspension status
      user.isSuspended = !user.isSuspended;
      await user.save();

      // Send email notification
      await sendSuspensionEmail(user.first_name, user.email, user.isSuspended);

      req.flash('success', `User ${user.isSuspended ? 'suspended' : 'reactivated'} successfully`);
      res.redirect('/adminRoute');
  } catch (error) {
      console.error('Error in suspendUser:', error);
      req.flash('error', 'Error updating user suspension status');
      res.redirect('/adminRoute');
  }
};




module.exports.viewUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id })
      .populate('widthdraws') // Populate withdrawal details
      .populate('deposits') // Populate deposit details
      .populate('upgrades') // Populate upgrade details
      .populate('livetrades') // Populate live trade details
      .populate('verified') // Populate verification details
      .populate('copyTrades') // Populate copy trade details
      .populate('minings') // Populate mining details
      .lean(); // Convert to plain JS object for manipulation

    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // Derive fullname and tel
    user.fullname = `${user.first_name} ${user.last_name}`;
    user.tel = user.phone;

    res.render('viewUser', {
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'An error occurred while fetching user details' });
  }
};


module.exports.editUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).lean();

    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // Derive fullname and tel
    user.fullname = `${user.first_name} ${user.last_name}`;
    user.tel = user.phone;

    res.render('editUser', {
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'An error occurred while fetching user details' });
  }
};

module.exports.editUser_post = async (req, res) => {
  try {
    // Log submitted accountTypes for debugging
    console.log('Submitted accountTypes:', req.body.accountTypes);

    // Extract and sanitize form data
    const updates = {
      isSuspended: req.body.isSuspended === 'true',
      first_name: req.body.first_name?.trim(),
      last_name: req.body.last_name?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      phone: req.body.phone?.trim(),
      currency: req.body.currency?.trim(),
      country: req.body.country?.trim(),
      state: req.body.state?.trim(),
      city: req.body.city?.trim(),
      btc_add: req.body.btc_add?.trim() || 'Loading',
      eth_add: req.body.eth_add?.trim() || 'Loading',
      xrp_add: req.body.xrp_add?.trim() || 'Loading',
      rune_add: req.body.rune_add?.trim() || 'Loading',
      xlm_add: req.body.xlm_add?.trim() || 'Loading',
      doge_add: req.body.doge_add?.trim() || 'Loading',
      sol_add: req.body.sol_add?.trim() || 'Loading',
      usdt_add: req.body.usdt_add?.trim() || 'Loading',
      gender: req.body.gender?.trim(),
      security_question: req.body.security_question?.trim(),
      session: req.body.session?.trim() || '0/0',
      balance: parseFloat(req.body.balance) || 0,
      available: req.body.available?.trim() || '0.00',
      zip_code: req.body.zip_code?.trim() || 'None',
      address: req.body.address?.trim() || 'None',
      bonus: req.body.bonus?.trim() || '0.00',
      widthdrawBalance: req.body.widthdrawBalance?.trim() || '0.00',
      profit: req.body.profit?.trim() || '0.00',
      totalDeposit: req.body.totalDeposit?.trim() || '0.00',
      totalWidthdraw: req.body.totalWidthdraw?.trim() || '0.00',
      prog: parseInt(req.body.prog) || 0,
      isVerified: req.body.isVerified === 'true',
      kycVerified: req.body.kycVerified === 'true',
      verifiedStatus: req.body.verifiedStatus?.trim() || 'Account not yet Verified!',
      role: parseInt(req.body.role) || 0,
      annLink: req.body.annLink?.trim() || 'settings_page',
      annText: req.body.annText?.trim() || 'Please verify your identity by uploading a valid government-issued identification card',
    };

    // Handle accountTypes array
    if (req.body.accountTypes && Array.isArray(req.body.accountTypes)) {
      // Handle flat array of strings (temporary workaround)
      if (typeof req.body.accountTypes[0] === 'string') {
        updates.accountTypes = [];
        for (let i = 0; i < req.body.accountTypes.length; i += 2) {
          const name = req.body.accountTypes[i]?.trim();
          const minDeposit = parseFloat(req.body.accountTypes[i + 1]);
          if (name && !isNaN(minDeposit)) {
            updates.accountTypes.push({
              name,
              minDeposit,
            });
          }
        }
      } else {
        // Expected structure: array of objects
        updates.accountTypes = req.body.accountTypes
          .filter(type => type.name?.trim() && type.minDeposit !== undefined && type.minDeposit !== '')
          .map(type => {
            const minDeposit = parseFloat(type.minDeposit);
            return {
              name: type.name.trim(),
              minDeposit: isNaN(minDeposit) ? 0 : minDeposit,
            };
          });
      }
      // If no valid accountTypes remain, use schema default
      if (updates.accountTypes.length === 0) {
        updates.accountTypes = [
          { name: 'Trading Account', minDeposit: 0 },
          { name: 'Bitcoin Mining Account', minDeposit: 0 },
          { name: 'Ethereum Mining Account', minDeposit: 0 },
          { name: 'Dogecoin Mining Account', minDeposit: 0 },
          { name: 'Binance Coin Mining Account', minDeposit: 0 },
          { name: 'Cosmos (ATOM) Mining Account', minDeposit: 0 },
        ];
      }
    } else {
      // If accountTypes not submitted, keep existing or use default
      const user = await User.findById(req.params.id);
      updates.accountTypes = user?.accountTypes || [
        { name: 'Trading Account', minDeposit: 0 },
        { name: 'Bitcoin Mining Account', minDeposit: 0 },
        { name: 'Ethereum Mining Account', minDeposit: 0 },
        { name: 'Dogecoin Mining Account', minDeposit: 0 },
        { name: 'Binance Coin Mining Account', minDeposit: 0 },
        { name: 'Cosmos (ATOM) Mining Account', minDeposit: 0 },
      ];
    }

    // Update user with validators
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // Log updated accountTypes for verification
    console.log('Updated accountTypes:', user.accountTypes);

    res.redirect(`/editUser/${req.params.id}`);
  } catch (error) {
    console.error('Update error:', error);

    // Prepare user data to repopulate form
    const user = {
      _id: req.params.id,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone: req.body.phone,
      currency: req.body.currency,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      btc_add: req.body.btc_add,
      eth_add: req.body.eth_add,
      xrp_add: req.body.xrp_add,
      rune_add: req.body.rune_add,
      xlm_add: req.body.xlm_add,
      doge_add: req.body.doge_add,
      sol_add: req.body.sol_add,
      usdt_add: req.body.usdt_add,
      gender: req.body.gender,
      security_question: req.body.security_question,
      session: req.body.session,
      balance: req.body.balance,
      available: req.body.available,
      zip_code: req.body.zip_code,
      address: req.body.address,
      bonus: req.body.bonus,
      widthdrawBalance: req.body.widthdrawBalance,
      profit: req.body.profit,
      totalDeposit: req.body.totalDeposit,
      totalWidthdraw: req.body.totalWidthdraw,
      prog: req.body.prog,
      isVerified: req.body.isVerified === 'true',
      kycVerified: req.body.kycVerified === 'true',
      verifiedStatus: req.body.verifiedStatus,
      isSuspended: req.body.isSuspended === 'true',
      role: req.body.role,
      annLink: req.body.annLink,
      annText: req.body.annText,
      // Use submitted accountTypes to repopulate form
      accountTypes: req.body.accountTypes && typeof req.body.accountTypes[0] === 'string'
        ? (() => {
            const types = [];
            for (let i = 0; i < req.body.accountTypes.length; i += 2) {
              const name = req.body.accountTypes[i]?.trim();
              const minDeposit = parseFloat(req.body.accountTypes[i + 1]);
              if (name && !isNaN(minDeposit)) {
                types.push({ name, minDeposit });
              }
            }
            return types;
          })()
        : (req.body.accountTypes || []).map(type => ({
            name: type.name?.trim(),
            minDeposit: parseFloat(type.minDeposit) || 0,
          })),
      fullname: `${req.body.first_name || ''} ${req.body.last_name || ''}`.trim(),
      tel: req.body.phone,
    };

    res.status(400).render('editUser', {
      user,
      error: error.message || 'Error updating user. Please check your inputs.',
    });
  }
};



module.exports.generateOTP = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      
      // Set OTP and expiration (24 hours)
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Changed to 24 hours
      await user.save();

      res.json({ otp: otp, message: "OTP generated successfully" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error generating OTP" });
  }
};

// Render search results page
module.exports.searchUsersPage = async (req, res) => {
  try {
    const { search } = req.query;
    let users = [];
    let page = parseInt(req.query.page) || 1;
    const perPage = 100;
    let sort = req.query.sort || 'createdAt';
    let order = req.query.order || 'desc';

    if (search) {
      // Search by first_name or last_name (case-insensitive)
      users = await User.aggregate([
        {
          $addFields: {
            fullname: { $concat: ['$first_name', ' ', '$last_name'] },
            tel: '$phone',
          },
        },
        {
          $match: {
            $or: [
              { first_name: { $regex: search, $options: 'i' } },
              { last_name: { $regex: search, $options: 'i' } },
              { fullname: { $regex: search, $options: 'i' } },
            ],
          },
        },
        { $sort: { [sort === 'fullname' ? 'first_name' : sort]: order === 'asc' ? 1 : -1 } },
      ])
        .skip(perPage * (page - 1))
        .limit(perPage)
        .exec();

      // Count total matching users for pagination
      const count = await User.countDocuments({
        $or: [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
        ],
      });

      return res.render('searchUsers', {
        user: users,
        page,
        totalPages: Math.ceil(count / perPage),
        sort,
        order,
        status: 'all', // Default status for consistency
        search, // Pass search query to template
      });
    }

    // If no search query, render empty search page
    res.render('searchUsers', {
      user: [],
      page: 1,
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      status: 'all',
      search: '',
    });
  } catch (error) {
    console.error('Error in searchUsersPage:', error);
    req.flash('error', 'An error occurred while searching users');
    res.render('searchUsers', {
      user: [],
      page: 1,
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      status: 'all',
      search: '',
    });
  }
};

// Handle search form submission
module.exports.searchUsers_post = async (req, res) => {
  try {
    const { search } = req.body;
    if (!search || search.trim() === '') {
      req.flash('error', 'Please enter a search term');
      return res.redirect('/searchUsers');
    }
    // Redirect to search results page with query
    res.redirect(`/searchUsers?search=${encodeURIComponent(search.trim())}`);
  } catch (error) {
    console.error('Error in searchUsers_post:', error);
    req.flash('error', 'An error occurred while processing your search');
    res.redirect('/searchUsers');
  }
};


module.exports.deletePage = async(req, res) =>{
  try {
    await User.deleteOne({ _id: req.params.id });
      res.redirect("/adminRoute")
    } catch (error) {
      console.log(error);
    }
}

// *******************ALL DEPOSITS CONTROLLERS *************************//

module.exports.allDeposit = async (req, res) => {
  try {
    const perPage = 100;
    let page = parseInt(req.query.page) || 1;
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const status = req.query.status || 'all';

    // Build query
    const query = status !== 'all' ? { status } : {};
    const sort = { [sortField]: sortOrder };

    // Count total deposits for pagination
    const totalDeposits = await Deposit.countDocuments(query);
    const totalPages = Math.ceil(totalDeposits / perPage);

    // Fetch deposits with pagination, sorting, and owner population
    const deposits = await Deposit.find(query)
      .populate('owner', 'first_name last_name email') // Populate user details
      .sort(sort)
      .skip(perPage * (page - 1))
      .limit(perPage)
      .lean(); // Use lean for performance

    res.render('allFunding', {
      deposits, // Use 'deposits' to match template
      page,
      totalPages,
      sort: sortField,
      order: req.query.order || 'desc',
      status,
    });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).render('error', { message: 'An error occurred while fetching deposits' });
  }
};


module.exports.viewDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findOne({ _id: req.params.id }).populate('owner', 'first_name last_name email');
    if (!deposit) {
      req.flash('error', 'Deposit not found');
      return res.redirect('/allFunding');
    }
    res.render('viewDeposits', { deposit });
  } catch (error) {
    console.error('Error loading deposit:', error);
    req.flash('error', 'Error loading deposit');
    res.redirect('/allFunding');
  }
};

module.exports.editDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findOne({ _id: req.params.id });
    if (!deposit) {
      req.flash('error', 'Deposit not found');
      return res.redirect('/allFunding');
    }
    res.render('editDeposit', {
      deposit,
      error: req.flash('error')[0], // Pass flash error if any
    });
  } catch (error) {
    console.error('Error loading deposit:', error);
    req.flash('error', 'Error loading deposit');
    res.redirect('/allFunding');
  }
};

module.exports.editDeposit_post = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'completed', 'failed'].includes(status)) {
      req.flash('error', 'Invalid status value');
      return res.redirect(`/editDeposit/${req.params.id}`);
    }
    const deposit = await Deposit.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!deposit) {
      req.flash('error', 'Deposit not found');
      return res.redirect('/allFunding');
    }
    req.flash('success', 'Deposit updated successfully');
    res.redirect('/allFunding');
  } catch (error) {
    console.error('Error updating deposit:', error);
    req.flash('error', 'Error updating deposit');
    res.redirect(`/editDeposit/${req.params.id}`);
  }
};


module.exports.deleteDeposit = async(req, res) =>{
    try {
        await Deposit.deleteOne({ _id: req.params.id });
        res.redirect("/adminRoute")
      
    } catch (error) {
        console.log(error)
    }
    
}

// // *******************ALL WIDTHDRAWALS  CONTROLLERS *************************//

module.exports.allWidthdrawal = async (req, res) => {
  try {
    const perPage = 100;
    let page = parseInt(req.query.page) || 1;
    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const status = req.query.status || 'all';

    // Build query
    const query = status !== 'all' ? { status } : {};
    const sort = { [sortField]: sortOrder };

    // Count total withdrawals for pagination
    const totalWithdrawals = await Widthdraw.countDocuments(query);
    const totalPages = Math.ceil(totalWithdrawals / perPage);

    // Fetch withdrawals with pagination, sorting, and owner population
    const widthdraw = await Widthdraw.find(query)
      .populate('owner', 'first_name last_name email')
      .sort(sort)
      .skip(perPage * (page - 1))
      .limit(perPage)
      .lean(); // Use lean for performance

    res.render('allWidthdrawals', {
      widthdraw, // Use 'widthdraw' to match template
      page,
      totalPages,
      sort: sortField,
      order: req.query.order || 'desc',
      status,
      error: req.flash('error')[0],
    });
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    req.flash('error', 'An error occurred while fetching withdrawals');
    res.redirect('/adminRoute');
  }
};


module.exports.viewWidthdrawal = async (req, res) => {
  try {
    const widthdraw = await Widthdraw.findOne({ _id: req.params.id }).populate('owner', 'first_name last_name email');
    if (!widthdraw) {
      req.flash('error', 'Withdrawal not found');
      return res.redirect('/allWidthdrawals');
    }
    res.render('viewWidthdrawals', {
      widthdraw,
      error: req.flash('error')[0],
    });
  } catch (error) {
    console.error('Error loading withdrawal:', error);
    req.flash('error', 'Error loading withdrawal');
    res.redirect('/allWidthdrawals');
  }
};

module.exports.editWidthdrawal = async (req, res) => {
  try {
    const widthdraw = await Widthdraw.findOne({ _id: req.params.id }).populate('owner', 'first_name last_name email');
    if (!widthdraw) {
      console.error(`Withdrawal not found for ID: ${req.params.id}`);
      req.flash('error', 'Withdrawal not found');
      return res.redirect('/allWidthdrawals');
    }
    // Validate status
    const validStatuses = ['pending', 'completed', 'failed'];
    if (!validStatuses.includes(widthdraw.status)) {
      console.warn(`Invalid status for withdrawal ${widthdraw._id}: ${widthdraw.status}. Setting to 'pending'.`);
      widthdraw.status = 'pending';
    }
    console.log('Rendering withdrawal with status:', widthdraw.status);
    res.render('editWidthdrawals', {
      widthdraw,
      error: req.flash('error')[0],
    });
  } catch (error) {
    console.error('Error loading withdrawal:', error);
    req.flash('error', 'Error loading withdrawal');
    res.redirect('/allWidthdrawals');
  }
};


module.exports.editWidthdrawal_post = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'completed', 'failed'].includes(status)) {
      req.flash('error', 'Invalid status value');
      return res.redirect(`/editWidthdrawals/${req.params.id}`);
    }
    const widthdraw = await Widthdraw.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!widthdraw) {
      req.flash('error', 'Withdrawal not found');
      return res.redirect('/allWidthdrawals');
    }
    req.flash('success', 'Withdrawal updated successfully');
    res.redirect('/allWidthdrawals');
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    req.flash('error', 'Error updating withdrawal');
    res.redirect(`/editWidthdrawals/${req.params.id}`);
  }
};


module.exports.deleteWidthdraw = async(req, res) =>{
    try {
        await Widthdraw.deleteOne({ _id: req.params.id });
        res.redirect("/adminRoute")
      
    } catch (error) {
        console.log(error)
    }
}


// // *******************ALL VERIFICATION CONTROLLERS *************************//

module.exports.allVerification = async (req, res) => {
  const perPage = 100;
  let page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  try {
    // Count total documents for pagination
    const totalDocs = await Verify.countDocuments();
    const totalPages = Math.ceil(totalDocs / perPage);

    // Fetch verification records with sorting and pagination
    const verify = await Verify.find()
      .populate('owner', 'first_name last_name')
      .sort({ [sort]: order })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();

    res.render('allVerification', {
      verify,
      page,
      totalPages,
      sort,
      order,
      perPage, // Add perPage here
      messages: req.flash(),
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    req.flash('error', 'Error fetching verifications');
    res.render('allVerification', {
      verify: [],
      page: 1,
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      perPage, // Add perPage here
      messages: req.flash(),
    });
  }
};

module.exports.viewVerify = async (req, res) => {
  try {
    const verify = await Verify.findOne({ _id: req.params.id }).populate('owner', 'first_name last_name email');
    if (!verify) {
      req.flash('error', 'Verification record not found');
      return res.redirect('/allVerify');
    }
    res.render('viewVerification', {
      verify,
      messages: req.flash(),
    });
  } catch (error) {
    console.error('Error loading verification:', error);
    req.flash('error', 'Error loading verification');
    res.redirect('/allVerify');
  }
};
module.exports.editVerify = async(req, res)=>{
  try {
        const verify = await Verify.findOne({ _id: req.params.id })
    
    res.render('editVerification',{verify})
    
          } catch (error) {
            console.log(error);
          }
}

module.exports.editVerify_post = async(req, res)=>{
  try {
    await Verify.findByIdAndUpdate(req.params.id,{
     email: req.body.email,
     username: req.body.username,
     fullname: req.body.fullname,
     city: req.body.city,
     gender: req.body.gender,
     dateofBirth: req.body.dateofBirth,
     marital: req.body.marital,
     age: req.body.age,
     address: req.body.address,
      updatedAt: Date.now()
    });
    await res.redirect(`/editVerification/${req.params.id}`);
    
    console.log('redirected');
  } catch (error) {
    console.log(error);
  }
}

module.exports.deleteVerification = async(req, res)=>{
  try {
    await Verify.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}

// // *******************LIVETRADES CONTROLLERS *************************//

module.exports.alllivetradePage = async (req, res) => {
  const perPage = 100;
  const page = parseInt(req.query.page) || 1;
  const status = req.query.status || 'all';
  const sort = req.query.sort || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  try {
    // Build query
    const query = status === 'all' ? {} : { status };
    
    // Build sort object
    const sortObj = { [sort]: order };

    // Fetch trades with populated owner
    const livetrade = await Livetrading.find(query)
      .populate('owner', 'fullname email')
      .sort(sortObj)
      .skip(perPage * (page - 1))
      .limit(perPage)
      .lean();

    // Get total count for pagination
    const count = await Livetrading.countDocuments(query);
    const totalPages = Math.ceil(count / perPage);

    res.render('allliveTrades', {
      livetrade,
      page,
      totalPages,
      status,
      sort,
      order,
      perPage // Added perPage
    });
  } catch (error) {
    console.error('Error fetching live trades:', error);
    res.status(500).send('Server error');
  }
};

module.exports.viewlivetradePage = async (req, res) => {
  try {
    const livetrade = await Livetrading.findOne({ _id: req.params.id })
      .populate('owner', 'fullname email')
      .lean();

    if (!livetrade) {
      return res.status(404).render('error', { message: 'Trade not found' });
    }

    res.render('viewallliveTrades', { livetrade });
  } catch (error) {
    console.error('Error viewing live trade:', error);
    res.status(500).render('error', { message: 'Server error' });
  }
};


module.exports.editlivetradePage = async (req, res) => {
  try {
    const livetrade = await Livetrading.findOne({ _id: req.params.id })
      .populate('owner', 'fullname email')
      .lean();

    if (!livetrade) {
      return res.status(404).render('error', { message: 'Trade not found' });
    }

    res.render('editallliveTrades', { livetrade, error: null });
  } catch (error) {
    console.error('Error fetching trade for edit:', error);
    res.status(500).render('error', { message: 'Server error' });
  }
};


module.exports.editLivetrade_post = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['open', 'closed'];

    if (!validStatuses.includes(status)) {
      return res.render('editallliveTrades', {
        livetrade: await Livetrading.findOne({ _id: req.params.id })
          .populate('owner', 'fullname email')
          .lean(),
        error: 'Invalid status selected'
      });
    }

    const livetrade = await Livetrading.findOneAndUpdate(
      { _id: req.params.id },
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!livetrade) {
      return res.status(404).render('error', { message: 'Trade not found' });
    }

    res.redirect(`/edit-livetrade/${req.params.id}`);
  } catch (error) {
    console.error('Error updating trade:', error);
    res.render('editallliveTrades', {
      livetrade: await Livetrading.findOne({ _id: req.params.id })
        .populate('owner', 'fullname email')
        .lean(),
      error: 'Failed to update trade'
    });
  }
};

module.exports.deleteLivetrade = async (req, res) => {
  try {
    const livetrade = await Livetrading.findOneAndDelete({ _id: req.params.id });

    if (!livetrade) {
      return res.status(404).render('error', { message: 'Trade not found' });
    }

    res.redirect('/all-livetrade');
  } catch (error) {
    console.error('Error deleting trade:', error);
    res.status(500).render('error', { message: 'Server error' });
  }
};





// // *******************ACCOUNT UPGRADES CONTROLLERS *************************//

module.exports.allupgradesPage = async (req, res) => {
  const perPage = 100;
  let page = parseInt(req.query.page) || 1;
  let sort = req.query.sort || 'createdAt';
  let order = req.query.order === 'asc' ? 1 : -1;
  let status = req.query.status || 'all';

  try {
    // Build query
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    // Valid sort fields
    const validSortFields = ['Plan', 'method', 'status', 'createdAt', 'updatedAt'];
    if (!validSortFields.includes(sort)) {
      sort = 'createdAt';
    }

    // Count total documents for pagination
    const totalDocs = await Upgrade.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / perPage);

    // Fetch upgrades with sorting, pagination, and owner population
    const upgrade = await Upgrade.find(query)
      .populate('owner', 'first_name last_name email')
      .sort({ [sort]: order })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();

    res.render('allAccountsUpgrade', {
      upgrade,
      page,
      perPage, // Added perPage
      totalPages,
      sort,
      order: req.query.order || 'desc',
      status,
    });
  } catch (error) {
    console.error('Error loading upgrades:', error);
    req.flash('error', 'Error loading upgrades');
    res.render('allAccountsUpgrade', {
      upgrade: [],
      page: 1,
      perPage, // Added perPage
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      status: 'all',
      error: req.flash('error')[0],
    });
  }
};

module.exports.viewUprgadesPage = async (req, res) => {
  try {
    const upgrade = await Upgrade.findOne({ _id: req.params.id }).populate('owner', 'first_name last_name email');
    if (!upgrade) {
      req.flash('error', 'Upgrade not found');
      return res.redirect('/allAccountsUpgrade');
    }
    res.render('viewallAccountsUpgrade', {
      upgrade,
      messages: req.flash(),
    });
  } catch (error) {
    console.error('Error loading upgrade:', error);
    req.flash('error', 'Error loading upgrade');
    res.redirect('/allAccountsUpgrade');
  }
};

module.exports.editUpgradesPage = async (req, res) => {
  try {
    const upgrade = await Upgrade.findOne({ _id: req.params.id }).populate('owner', 'first_name last_name email');
    if (!upgrade) {
      req.flash('error', 'Upgrade not found');
      return res.redirect('/allAccountsUpgrade');
    }
    res.render('editallAccountsUpgrade', {
      upgrade,
      error: req.flash('error')[0],
    });
  } catch (error) {
    console.error('Error loading upgrade:', error);
    req.flash('error', 'Error loading upgrade');
    res.redirect('/allAccountsUpgrade');
  }
};


module.exports.editUpgrade_post = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'failed'].includes(status)) {
      req.flash('error', 'Invalid status value');
      return res.redirect(`/editUpgrade/${req.params.id}`);
    }
    const upgrade = await Upgrade.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!upgrade) {
      req.flash('error', 'Upgrade not found');
      return res.redirect('/all-accountUpgrade');
    }
    req.flash('success', 'Upgrade updated successfully');
    res.redirect('/allAccountsUpgrade');
  } catch (error) {
    console.error('Error updating upgrade:', error);
    req.flash('error', 'Error updating upgrade');
    res.redirect(`/editUpgrade/${req.params.id}`);
  }
};

module.exports.deleteUpgrade = async(req, res)=>{
  try {
    await Upgrade.deleteOne({ _id: req.params.id });
    res.redirect("/adminRoute")
  
} catch (error) {
    console.log(error)
}
}

module.exports.allcopytradesPage = async (req, res) => {
  const perPage = 100;
  let page = parseInt(req.query.page) || 1;
  let sort = req.query.sort || 'createdAt';
  let order = req.query.order === 'asc' ? 1 : -1;
  let status = req.query.status || 'all';

  try {
    // Build query
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    // Valid sort fields
    const validSortFields = [
      'traderName',
      'profitShare',
      'winRate',
      'amount',
      'accountType',
      'duration',
      'startDate',
      'endDate',
      'status',
      'currentProfit',
      'createdAt',
      'updatedAt',
    ];
    if (!validSortFields.includes(sort)) {
      sort = 'createdAt';
    }

    // Count total documents for pagination
    const totalDocs = await CopyTrade.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / perPage);

    // Fetch copy trades with sorting, pagination, and owner population
    const copyTrades = await CopyTrade.find(query)
      .populate('owner', 'first_name last_name email')
      .sort({ [sort]: order })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();

    res.render('allCopyTrades', {
      copyTrades,
      page,
      perPage,
      totalPages,
      sort,
      order: req.query.order || 'desc',
      status,
      error: req.flash('error')[0],
    });
  } catch (error) {
    console.error('Error loading copy trades:', error);
    req.flash('error', 'Error loading copy trades');
    res.render('allCopyTrades', {
      copyTrades: [],
      page: 1,
      perPage,
      totalPages: 1,
      sort: 'createdAt',
      order: 'desc',
      status: 'all',
      error: req.flash('error')[0],
    });
  }
};

module.exports.viewAllcopytradesPage = async (req, res) => {
  try {
    const copyTrade = await CopyTrade.findOne({ _id: req.params.id }).populate('owner', 'first_name last_name email');
    if (!copyTrade) {
      req.flash('error', 'Copy trade not found');
      return res.redirect('/all-copytrades');
    }
    res.render('viewCopyTrade', {
      copyTrade,
      messages: req.flash(),
    });
  } catch (error) {
    console.error('Error loading copy trade:', error);
    req.flash('error', 'Error loading copy trade');
    res.redirect('/all-copytrades');
  }
};



module.exports.editAllcopytradesPage = async (req, res) => {
  try {
    const copyTrade = await CopyTrade.findOne({ _id: req.params.id }).populate('owner', 'first_name last_name email');
    if (!copyTrade) {
      req.flash('error', 'Copy trade not found');
      return res.redirect('/all-copytrades');
    }
    res.render('editCopyTrade', {
      copyTrade,
      error: req.flash('error')[0],
    });
  } catch (error) {
    console.error('Error loading copy trade:', error);
    req.flash('error', 'Error loading copy trade');
    res.redirect('/all-copytrades');
  }
};


// controllers/adminController.js
module.exports.editAllcopytradesPage_post = async (req, res) => {
  try {
    const { status, duration, startDate, endDate } = req.body;
    if (!['active', 'completed'].includes(status)) {
      req.flash('error', 'Invalid status value');
      return res.redirect(`/editCopyTrade/${req.params.id}`);
    }
    if (isNaN(parseInt(duration)) || parseInt(duration) < 1) {
      req.flash('error', 'Duration must be at least 1 day');
      return res.redirect(`/editCopyTrade/${req.params.id}`);
    }
    if (!startDate || isNaN(Date.parse(startDate))) {
      req.flash('error', 'Invalid start date');
      return res.redirect(`/editCopyTrade/${req.params.id}`);
    }
    if (!endDate || isNaN(Date.parse(endDate))) {
      req.flash('error', 'Invalid end date');
      return res.redirect(`/editCopyTrade/${req.params.id}`);
    }
    const copyTrade = await CopyTrade.findByIdAndUpdate(
      req.params.id,
      { status, duration: parseInt(duration), startDate: new Date(startDate), endDate: new Date(endDate) },
      { new: true, runValidators: true }
    );
    if (!copyTrade) {
      req.flash('error', 'Copy trade not found');
      return res.redirect('/all-copytrades');
    }
    req.flash('success', 'Copy trade updated successfully');
    res.redirect('/all-copytrades');
  } catch (error) {
    console.error('Error updating copy trade:', error);
    req.flash('error', 'Error updating copy trade');
    res.redirect(`/editCopyTrade/${req.params.id}`);
  }
};

module.exports.delteAllcopytradesPage = async (req, res) => {
  try {
    const copyTrade = await CopyTrade.findByIdAndDelete(req.params.id);
    if (!copyTrade) {
      req.flash('error', 'Copy trade not found');
      return res.redirect('/all-copytrades');
    }
    req.flash('success', 'Copy trade deleted successfully');
    res.redirect('/all-copytrades');
  } catch (error) {
    console.error('Error deleting copy trade:', error);
    req.flash('error', 'Error deleting copy trade');
    res.redirect('/all-copytrades');
  }
};

module.exports.allMiningPage = async (req, res) => {
  try {
    // Query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Records per page
    const sort = req.query.sort || 'createdAt'; // Default sort by creation date
    const order = req.query.order === 'desc' ? -1 : 1; // Ascending or descending
    const status = req.query.status || 'all'; // Status filter

    // Build query
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    // Validate sort field
    const validSortFields = [
      'coin',
      'amount',
      'profit',
      'duration',
      'hashRate',
      'status',
      'owner',
      'dailyProfit',
      'startDate',
      'endDate',
      'createdAt',
    ];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';

    // Fetch minings with pagination, sorting, and owner population
    const minings = await Mining.find(query)
      .populate('owner', 'first_name last_name') // Populate owner details
      .sort({ [sortField]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Count total records for pagination
    const totalMinings = await Mining.countDocuments(query);
    const totalPages = Math.ceil(totalMinings / limit);

    // Render the view
    res.render('allMiningPage', {
      minings,
      page,
      totalPages,
      sort,
      order,
      status,
      limit, // Add limit to the render context
      messages: req.flash(),
    });
  } catch (error) {
    console.error('Error in allMiningPage:', error);
    req.flash('error', 'An error occurred while loading mining records');
    res.redirect('/adminRoute');
  }
};

module.exports.viewAllMiningPage = async (req, res) => {
  try {
    const miningId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(miningId)) {
      req.flash('error', 'Invalid mining ID');
      return res.redirect('/all-minings');
    }

    // Fetch mining record with owner details
    const mining = await Mining.findById(miningId)
      .populate('owner', 'first_name last_name email')
      .lean();

    if (!mining) {
      req.flash('error', 'Mining record not found');
      return res.redirect('/all-minings');
    }

    // Render the view
    res.render('viewMining', {
      mining,
      messages: req.flash(),
    });
  } catch (error) {
    console.error('Error in viewAllMiningPage:', error);
    req.flash('error', 'An error occurred while loading mining details');
    res.redirect('/all-minings');
  }
};

module.exports.editAllMiningPage = async (req, res) => {
  try {
    const miningId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(miningId)) {
      req.flash('error', 'Invalid mining ID');
      return res.redirect('/all-minings');
    }

    // Fetch mining record with owner details
    const mining = await Mining.findById(miningId)
      .populate('owner', 'first_name last_name email')
      .lean();

    if (!mining) {
      req.flash('error', 'Mining record not found');
      return res.redirect('/all-minings');
    }

    // Render the edit form
    res.render('editMining', {
      mining,
      error: req.flash('error'),
    });
  } catch (error) {
    console.error('Error in editAllMiningPage:', error);
    req.flash('error', 'An error occurred while loading the edit form');
    res.redirect('/all-minings');
  }
};


module.exports.editAllMiningPage_post = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.body;
    await Mining.findByIdAndUpdate(req.params.id, {
      status,
      startDate: startDate || null,
      endDate: endDate || null,
      updatedAt: new Date(),
    });
    req.flash('success', 'Mining record updated');
    res.redirect('/all-minings');
  } catch (error) {
    console.error('Error in updateMining:', error);
    req.flash('error', 'Failed to update mining record');
    res.redirect(`/editMining/${req.params.id}`);
  }
};



module.exports.deletemining = async (req, res) => {
  try {
    const miningId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(miningId)) {
      req.flash('error', 'Invalid mining ID');
      return res.redirect('/all-minings');
    }

    // Find and delete the mining record
    const mining = await Mining.findByIdAndDelete(miningId);

    if (!mining) {
      req.flash('error', 'Mining record not found');
      return res.redirect('/all-minings');
    }

    // Success message and redirect
    req.flash('success', 'Mining record deleted successfully');
    res.redirect('/all-minings');
  } catch (error) {
    console.error('Error in deleteMining:', error);
    req.flash('error', 'An error occurred while deleting the mining record');
    res.redirect('/all-minings');
  }
};






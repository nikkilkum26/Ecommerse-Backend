var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var cors =require('cors');

router.use(cors({
  origin:"*"
}))
// const User = mongoose.model("ecomUser")
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const {JWT_SECRET} =require('../db/keys');
// const crypto = require('crypto')
// const nodemailer = require('nodemailer');

// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'sndmail26@gmail.com', // generated ethereal user
//     pass: 'sendmailtoeveryone', // generated ethereal password
//   },
// });

const {signup,signin,signout,requireSignin} = require('../controllers/auth')
const {userSignupValidator} = require('../validator/index')

router.post('/signup',userSignupValidator,signup)
router.post('/signin',signin)
router.get('/signout',signout)



module.exports = router;

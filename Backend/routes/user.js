const express = require('express');
const userController = require('../controller/user');

const router = express.Router();

router.post('/signup', userController.SignUp);

router.post('/verifyOTP',userController.verifyOTP);

router.post('/resendOTPVerificationCode',userController.resendOTPVerificationCode);

router.post('/login', userController.Login);

module.exports = router;
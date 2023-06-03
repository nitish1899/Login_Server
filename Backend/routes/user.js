const express = require('express');
const userController = require('../controller/user');

const router = express.Router();

router.post('/signup', userController.SignUp);

router.post('/verifyOTP',userController.verifyOTP);

module.exports = router;
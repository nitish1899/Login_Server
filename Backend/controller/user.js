const User = require('../models/user');
const bcrypt = require('bcrypt'); 

exports.SignUp = async (req, res) => {
  try {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (name == "" || email == "" || password == "") {
      res.json({
        status: "FAILED",
        message: "Empty input fields!",
      });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
      res.json({
        status: "FAILED",
        message: "invalid name entered",
      });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      res.json({
        status: "FAILED",
        message: "invalid email entered",
      });
    } else if (password.length < 8) {
      res.json({
        status: "FAILED",
        message: "Password is two short!",
      });
    } else {
      //checking if user already exists
      const Result =  await User.find({email})
        
      if (Result.length) {
        // This user already exists
        res.json({
          status: "FAILED",
          message: "User with provided email already exists",
        });
      } else {
        // Try to create a new user

        //password handling
        const saltround = 10;      
        bcrypt.hash(password, saltround, async (err, hash) =>{
          if (err) {
              console.log(err);
          } else {
            const newUser = new User({
              name,
              email,
              password: hash,
              verified: false,
            });

            const result = await newUser.save();
            res.status(201).json({result, message: "Successfully created new user"})
          }
        })
      }
    }
  } catch(err){
    console.log(err);
    res.status(500).json({error:err});
  }
};
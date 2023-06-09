const User = require('../models/user');
const userOTPverification = require('../models/userOTPverification');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const  Sib = require('sib-api-v3-sdk');

const transEmailApi = new Sib.TransactionalEmailsApi();
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

function generateAccessToken (userId,email) {
  return jwt.sign( {userId,email}, process.env.TOKEN_SECRET);
}

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
          Result,
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
            sendOTPVerificationEmail(result,res);
          }
        })
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({error:err});
  }
};

// send otp verification email
const sendOTPVerificationEmail = async ({_id, email}, res) => {
    try{
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
      const mailOptions = {
                sender: { email : process.env.AUTH_EMAIL},
                to: [{email}],
                subject: "Verify Your Email",
                htmlContent: `
                <p> Enter <b> ${otp} </b> in the app to verify your email address and 
                complete your signup process.</p><p> This code <b> expires in 1 hour </b>. </p>
                `,
             };

            // hash the otp
            const saltround = 10;
            const hashedOTP = await bcrypt.hash(otp, saltround);
            const newOTPVerification = await UserOTPverification({
              userId: _id,
              otp: hashedOTP,
              createdAt: Date.now(),
              expiresAt: Date.now()+3600000,
            });
            // save otp record
            await newOTPVerification.save();
            await transEmailApi.sendTransacEmail(mailOptions);
            res.json({
              status: "PENDING",
              message: "Verification OTP email send ",
              data: {
                userId: _id,
                email
              },
            });
    } catch (error) {
      res.json({
        status: "FAILED",
        message: error.message,
      });
    }
};

exports.verifyOTP = async (req,res) => {
   try{
        let { userId, otp } = req.body;

        if (!userId || !otp) {
          throw new Error("Empty otp details are not allowed");
        } else {
            const userOTPverificationRecord = await userOTPverification.find({userId});
            
            if (userOTPverificationRecord.length <= 0) {
              throw new Error(`Account details doesn't exist or has been verified already. 
              Please sign up or log in.`)
            } else {
                // user otp record exists
                const { expiresAt} = userOTPverificationRecord[0];
                const hashedOTP = userOTPverificationRecord[0].otp;

                if (expiresAt < Date.now()) {
                  // user otp record has expired
                  await userOTPverification.deleteMany(userId);
                  throw new Error("OTP has expired . Please request it again.")
                } else {
                  const validOTP = await bcrypt.compare(otp, hashedOTP);

                  if (!validOTP) {
                    // Entered wrong otp
                    throw new Error ("Invalid OTP passed. Check your inbox");
                  } else {
                    // success
                    const user = await User.findOne({_id: userId});
                    //console.log(user);

                    if(!user.verified){
                      await User.updateOne({_id: userId}, {verified: true});
                      await userOTPverification.deleteMany({userId});

                      res.json({message: "Signup Successful",})
                    } else {
                        const token = generateAccessToken(user._id,user.email);

                      res.json({
                        name: user.name,
                        email: user.email,
                        status: "Verified",
                        token:token,
                      });
                    }
                  }
                }
            }
        }
   } catch (error) {
      res.json({
        status: "FAILED",
        message: error.message,
      });
   }
};

exports.resendOTPVerificationCode = async (req,res) => {
  try{
    let {userId,email} = req.body;

    if(!userId || !email) {
      throw new Error("Empty user details are not allowed");
    } else {
      // delete existing record and resend otp
      await userOTPverification.deleteMany({userId});
      sendOTPVerificationEmail({_id:userId,email},res);
    }
  } catch (error) {
      res.json({
        status:"resend OTP failed",
        message: error.message,
      });
  }
};

exports.Login = async (req,res) => {
  try{
      let {email} =  req.body;
      if (email == "") {
        res.json({
          status: "FAILED",
          message: "Empty email is not allowed. Please enter the email.",
        });
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
          res.json({
            status: "FAILED",
            message: "invalid email entered",
        });
      } else {
        //checking if user already exists
        const Result =  await User.find({email})
         
        if(Result.length <= 0){
          res.json({
            status: "FAILED",
            message: "User does not exists.",
          });
        } else {
          const _id = Result[0]._id;
          sendOTPVerificationEmail({_id, email},res);
        }
      }

  } catch (error) {
    res.json({
      status:"LOGIN FAILED",
      message: error.message,
    });
  }
}
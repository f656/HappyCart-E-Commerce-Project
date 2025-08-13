const express = require('express');
const User = require("../Models/User");
const jwt = require('jsonwebtoken');
const {protect} = require("../Middleware/authMiddleware");

const router = express.Router();

// @route POST /api/auth/register
// @desc Register a new user
// @access Public

router.post('/register', async (req, res) => {
     const{name, email, password} = req.body;
     try {
        //Registration logic
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({massage: "User already exists"});
        }
        user = new User({name, email, password});
        await user.save();

        //Create JWT token
        const payload = {user:{id:user._id,role:user.role}};

        //Sign and return token along with user data
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token) =>{
         if(err) throw err;

         //Send the user and token to in the response
         res.status(201).json({ success: true,massage: "User registered successfully",
            user:{
               id:user._id,
               name:user.name,
               email:user.email,
               role:user.role,
            },
            token,
         });
        }
      );
        
     } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
     }
})

// @route POST /api/auth/login
// @desc Login user and get token
// @access Public
router.post("/login", async (req,res) =>{
   const {email,password} = req.body;
   try {
      //Find the user by email
      let user = await User.findOne({email});
       if(!user){
         return res.status(400).json({massage: "Invalid credentials"});
      }
      //Check if the password matches
      const isMatch = await user.matchPassword(password);
      if(!isMatch){
         return res.status(400).json({massage: "Password is incorrect"});
      }
       //Create JWT token
        const payload = {user:{id:user._id,role:user.role}};

        //Sign and return token along with user data
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token) =>{
         if(err) throw err;

         //Send the user and token to in the response
         res.status(201).json({success: true,massage: "User logged in successfully",
            user:{
               id:user._id,
               name:user.name,
               email:user.email,
               role:user.role,
            },
            token,
         });
        }
      );
   } catch (error) {
      console.error(error)
      res.status(500).json({msg: "Server Error"});
   }
})

//@route Get API/users/profile
//@desc Get logged in user's profile
//@access Private
router.get("/profile",protect,async (req,res) =>{
   res.json(req.user);
})

module.exports = router;
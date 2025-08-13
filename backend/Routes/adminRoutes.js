const express = require("express");
const User = require("../Models/User");
const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

//@route GEt/api/admin/users
// @desc get all user(Admin only)
// @access Private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route POST /api/admin/users
//@desc add a new user (admin Only)
//@access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = await User.findOne({email});
    if (user) {
      return res.status(400).json({message:"User already exists"});
    }

    user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });
    await user.save();
    res.status(201).json({message:"User created successfully",user})
  } catch (error) {
    console.error(error);
    res.status(500).json({message:"Server Error"});
  }
});

//@route PUT/api/admin/users/:id
// @desc Update user info (admin only)- name ,email and role
//@access private /Admin
router.put("/:id",protect,admin, async(req,res) =>{
  try {
    const user = await User.findById(req.params.id);
    if(user){
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
    }
    const updatedUser = await user.save();
    return res.status(200).json({message:"User Updated successfully", user:updatedUser});
  } catch (error) {
    console.error(error);
    response.status(500).json({message:"Server Error"}); 
  }
});

//@route DELETE /api/admin/users/:id
//@desc Delete a user
//@access Private/Admin
router.delete("/:id",protect,admin,async(req,res) =>{
  try {
    const user = await User.findById(req.params.id);
    if(user){
      await user.deleteOne();
      res.status(200).json({success:true,message:"User deleted successfully"});
    } else {
      return res.status(404).json({success:false,message:"user not found"});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg:"Server error"});
  }
});
module.exports = router;

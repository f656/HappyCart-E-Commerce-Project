const express = require('express');
const Order = require("../Models/Order")
const {protect} = require("../Middleware/authMiddleware");

const router = express.Router();

//@router GET /api/orders/my-orders
// @desc Get Logged in user's orders
// @access Private
router.get("/my-orders", protect, async (req, res) => {
  try {
    //finds orders for the authenticated user
    const orders = await Order.find({user:req.user._id}).sort({createdAt: -1});// sort by most recent order
    res.json({success:true,msg:"Orders fetched successfully",orders});

  } catch (error) {
     console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

// @route GET/api/orders/:id
// @desc get order details by id
// @access Private
router.get("/:id", protect, async (req, res) => {
   try {
     const order = await Order.findById(req.params.id).populate("user","name email");

     if(!order){
        return res.status(404).json({msg:"Order not found"});
     }
     
     // Return the full order details
     res.json({success:true,msg:"Order details fetched successfully",order});
 
   } catch (error) {
     console.error(error);
     res.status(500).json({ msg: "Server Error" });
   }
});

module.exports = router;
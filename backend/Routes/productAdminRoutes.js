const express = require('express');
const Product = require("../Models/Product");
const {protect,admin} = require("../Middleware/authMiddleware");

const router = express.Router();

//@route Get /api/admin/products
//@desc Get all products (admin only)
//@access Private/Admin
router.get("/",protect,admin,async(req,res) =>{
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg:"Server error"});
  }
});

module.exports = router;
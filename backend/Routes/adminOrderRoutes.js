const express = require("express");
const Order = require("../Models/Order");
const { protect, admin } = require("../Middleware/authMiddleware");

const router = express.Router();

//@route GET/api/admin/orders
//@desc Get all orders(admin only)
//@access Private/Admin
router.get("/", protect, admin, async (request, res) => {
  try {
    const order = await Order.find({}).populate("user", "name email");
    res.json({ msg: "Admin order fetched successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
});

//@route PUT /api/admin/orders/:id
//@desc Update order status
//@access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");

    if (order) {
      let newStatus = req.body.status?.trim() || order.status;

      // normalize spelling for schema enum
      if (newStatus?.toLowerCase() === "canceled") {
        newStatus = "Cancelled";
      }

      order.status = newStatus;
      order.isDelivered = newStatus === "Delivered" ? true : order.isDelivered;
      order.deliveredAt =
        newStatus === "Delivered" ? Date.now() : order.deliveredAt;

      const updatedOrder = await order.save();
      await updatedOrder.populate("user", "name email"); // ✅ keep populated data

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//@route delete/api/admin/orders/:id
//@desc Delete a order
//@access Private /Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ msg: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;

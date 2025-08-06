const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_KhPCVm9NI5tEiu",
  key_secret: "TE62y00k1DeaAxjC8DPx5G63", // ✅ Never share this on frontend
});

// 🔹 Create Razorpay order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // convert ₹ to paise
    currency: "INR",
    receipt: "receipt#" + Math.random().toString().slice(2, 8),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

// 🔹 Verify Razorpay payment
router.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "TE62y00k1DeaAxjC8DPx5G63")
    .update(sign)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully" });
  } else {
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

module.exports = router;

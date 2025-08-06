const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

let otpStore = {};

router.post("/send-otp", async (req, res) => {
  const { email, adminEmail, email_pass } = req.body;

  const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 465,
     secure: true,
     auth: {
       user: adminEmail,
       pass: email_pass, // ✅ Must be Gmail App Password
     },
   });
   
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  const htmlContent = `
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
      <h2 style="color: #333;">Welcome to <span style="color: #6a1b9a;">FashionIsta 👗</span></h2>
    </div>
    <div style="padding: 30px; text-align: center;">
      <p style="font-size: 16px; color: #555;">Use the following OTP to reset your password:</p>
      <h1 style="font-size: 32px; color: #2e7d32; margin: 20px 0;">${otp}</h1>
      <p style="color: #999;">This OTP is valid for 10 minutes.</p>
    </div>
    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
      Need help? Contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>
    </div>
  </div>
  `;

  try {
    await transporter.sendMail({
      from: `"FashionIsta 👗" <${adminEmail}>`,
      to: email,
      subject: "Your FashionIsta OTP",
      html: htmlContent,
    });

    console.log("OTP sent to:", email);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Email send error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: err.message,
    });
  }
});

// ✅ Verify OTP Route
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    res.json({ success: true, message: "OTP verified" });
  } else {
    res.json({ success: false, message: "Invalid OTP" });
  }
});

//////////////////  rigster send mail ///////////

//////////////////////////////////////////////////

module.exports = router;

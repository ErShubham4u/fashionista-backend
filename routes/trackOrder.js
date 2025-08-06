const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send-order-email", async (req, res) => {
  const { user_email, adminEmail, email_pass, track_no, orderId } = req.body;

  if (!user_email || !adminEmail || !email_pass || !orderId || !track_no) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields (email, pass, orderId, track_no)",
    });
  }

  // ✅ Use smtp.gmail.com with SSL
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: adminEmail,
      pass: email_pass, // ✅ Must be Gmail App Password
    },
  });

  let trackContent = "";
  const status = parseInt(track_no); // Ensure it's a number
  console.log("Track No:", status);

  switch (status) {
    case 1:
      trackContent = `
        <h1 style="color: #2e7d32;">🎉 Order Placed Successfully!</h1>
        <p>Thank you for your purchase. Order ID: <strong>${orderId}</strong></p>`;
      break;
    case 2:
      trackContent = `
        <h1 style="color: #0277bd;">📦 Ready to Ship</h1>
        <p>Your order <strong>${orderId}</strong> is ready to ship.</p>`;
      break;
    case 3:
      trackContent = `
        <h1 style="color: #0288d1;">🚚 Shipped</h1>
        <p>Your order <strong>${orderId}</strong> has been shipped.</p>`;
      break;
    case 4:
      trackContent = `
        <h1 style="color: #fbc02d;">📍 Out for Delivery</h1>
        <p>Your order <strong>${orderId}</strong> is out for delivery.</p>`;
      break;
    case 5:
      trackContent = `
        <h1 style="color: #43a047;">✅ Delivered</h1>
        <p>Your order <strong>${orderId}</strong> has been delivered. Enjoy!</p>`;
      break;
    default:
      trackContent = `
        <h1>Order Update</h1>
        <p>Your order <strong>${orderId}</strong> has a new status.</p>`;
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <div style="text-align: center;">
        <h2>Welcome to <span style="color: #6a1b9a;">FashionIsta 👗</span></h2>
      </div>
      <div style="padding: 20px; text-align: center;">${trackContent}</div>
      <div style="font-size: 12px; color: #777; text-align: center;">
        Need help? Contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>
      </div>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"FashionIsta 👗" <${adminEmail}>`,
      to: user_email,
      subject: "🎉 Order Update - FashionIsta 👗",
      text: `Hello! Your order ${orderId} status is now updated. Thank you for shopping with FashionIsta.`,
      html: htmlContent,
    });

    console.log("✅ Email sent to :", user_email);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: err.message,
    });
  }
});

/////////////// order cancel Email /////////////////

router.post("/send-cancel-email", async (req, res) => {
  const { user_email, adminEmail, email_pass, orderId } = req.body;

  if (!user_email || !adminEmail || !email_pass || !orderId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields (email, pass, orderId, track_no)",
    });
  }

  // ✅ Use smtp.gmail.com with SSL
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: adminEmail,
      pass: email_pass, // ✅ Must be Gmail App Password
    },
  });

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
    <div style="text-align: center;">
      <h2>We're sorry from <span style="color: #d32f2f;">FashionIsta 👗</span></h2>
    </div>
    <div style="padding: 20px; text-align: center;">
      <h1 style="color: #d32f2f;">❌ Order Cancelled</h1>
      <p>Your order with ID: <strong>${orderId}</strong> has been successfully cancelled.</p>
      <p>If you didn't request this cancellation, please contact our support immediately.</p>
    </div>
    <div style="font-size: 12px; color: #777; text-align: center;">
      Need help? Contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>
    </div>
  </div>
`;

  try {
    await transporter.sendMail({
      from: `"FashionIsta 👗" <${adminEmail}>`,
      to: user_email,
      subject: "🎉 Order Update - FashionIsta 👗",
      text: `Hello! Your order ${orderId} status is now updated. Thank you for shopping with FashionIsta.`,
      html: htmlContent,
    });

    console.log("❌ Email sent to :", user_email);
    res.json({ success: true, message: "Order Cancel successfully...!" });
  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send Cancel Order",
      error: err.message,
    });
  }
});

module.exports = router;


const dbPath = path.join(__dirname, "../../db.json");

// 📩 Register route - creates user & sends email
router.post("/register", async (req, res) => {
  const { username, email, password, adminEmail } = req.body;
  const verificationToken = crypto.randomBytes(32).toString("hex");

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    const existingUser = db.users.find((u) => u.email === email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const newUser = {
      id: Date.now(),
      username,
      type: "Customer",
      email,
      password,
      verified: false,
      verificationToken,
    };

    db.users.push(newUser);
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    const verifyLink = `http://localhost:5173/verify?token=${verificationToken}&email=${email}`;
    // const verifyLink = `http://localhost:3001/UserLogin`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        //   user: adminEmail,
        // pass: email_pass,
        user: "77ajitshitole@gmail.com",
        pass: "fbiihbpsmzsmbicf", // Use your Gmail App Password here
      },
    });
    const htmlContent = `
  <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
      <h2 style="color: #333;">Welcome to <span style="color: #6a1b9a;">FashionIsta 👗</span></h2>
    </div>
    <div style="padding: 30px; text-align: center;">
      <h2>Hello ${username},</h2>
        <p>Click the button below to verify your email and activate your account:</p>
        <a href="${verifyLink}" style="padding:10px 20px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:5px;">Verify Email</a>
        <p>If you did not request this, just ignore this email.</p>
    </div>
    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
      Need help? Contact us at <a href="mailto:${adminEmail}">${adminEmail}</a>
    </div>
  </div>
  `;

    await transporter.sendMail({
      from: `"FashionIsta 👗" <${adminEmail}>`,
      to: email,
      subject: "Verify your FashionIsta account",
      html: htmlContent,
    });

    res.json({ success: true, message: "Verification email sent!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Email Verification Route with Redirect
router.get("/verify", async (req, res) => {
  const { token, email } = req.query;

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    const user = db.users.find(
      (u) => u.email === email && u.verificationToken === token
    );

    if (!user) {
      return res.status(400).send("Invalid or expired verification link.");
    }

    user.verified = true;
    delete user.verificationToken;

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    // Redirect after success
    res.redirect("http://localhost:5173/UserLogin?verified=true");
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).send("Server error. Please try again.");
  }
});


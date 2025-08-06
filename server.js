const express = require("express");
const cors = require("cors");
const app = express();

// Routes
const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");
const trackOrderRoutes = require("./routes/trackOrder");
// const ragister = require("./routes/ragister");

app.use(cors());
app.use(express.json());

// Use routes
app.use("/", authRoutes);
app.use("/", paymentRoutes);
app.use("/", trackOrderRoutes);
// app.use("/", ragister);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});

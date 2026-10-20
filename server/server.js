import nodemailer from "nodemailer";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// 1. Transporter setup jo email bhejega
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }, 
  tls: {
    rejectUnauthorized: false
  }
});

// Middleware Setup
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Database connection helper function for Serverless
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected successfully.");
    } else {
      console.error("MONGODB_URI is missing in env variables!");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

// Health Route
app.get("/api/health", async (req, res) => {
  await connectDB();
  res.json({
    success: true,
    message: "Rudra Trailor Service backend is running!",
    dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Enquiries Route
app.post("/api/enquiries", async (req, res) => {
  try {
    await connectDB();
    const { name, email, phone, company, service, pickup, destination, message } = req.body;

    if (!name || !email || !phone || !service || !pickup || !destination) {
      return res.status(400).json({
        message: "Please fill in all required fields."
      });
    }

    // Dynamic model handling to avoid OverwriteModelError in Serverless
    const Enquiry = mongoose.models.Enquiry || mongoose.model(
      "Enquiry",
      new mongoose.Schema(
        {
          name: { type: String, required: true, trim: true },
          email: { type: String, required: true, trim: true },
          phone: { type: String, required: true, trim: true },
          company: { type: String, default: "" },
          service: { type: String, required: true },
          pickup: { type: String, required: true },
          destination: { type: String, required: true },
          message: { type: String, default: "" },
          status: {
            type: String,
            enum: ["New", "In Progress", "Completed", "Cancelled"],
            default: "New"
          }
        },
        { timestamps: true }
      )
    );

    // Database me enquiry save ho rahi hai
    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      company,
      service,
      pickup,
      destination,
      message
    });

    // ---- GMAIL NOTIFICATION KA CODE ----
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "chinujangra433@gmail.com", // Note: MaxListeners domain valid nahi tha, isko thik kiya hai
      subject: `New Rudra Trailor Enquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 5px;">Rudra Trailor Service - New Website Enquiry</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px; font-weight: bold; width: 130px;">Name:</td><td style="padding: 5px;">${name}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Email:</td><td style="padding: 5px;">${email}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Phone:</td><td style="padding: 5px;">${phone}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Company:</td><td style="padding: 5px;">${company || 'N/A'}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Service Needed:</td><td style="padding: 5px; color: #d9534f; font-weight: bold;">${service}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Pickup Location:</td><td style="padding: 5px;">${pickup}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold;">Destination:</td><td style="padding: 5px;">${destination}</td></tr>
            <tr><td style="padding: 5px; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 5px;">${message || 'No message provided.'}</td></tr>
          </table>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.error("Email send nahi ho paya ❌:", error.message);
      else console.log("Email successfully bhej diya gaya hai! 📩", info.response);
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully!",
      enquiryId: enquiry._id
    });
  } catch (error) {
    console.error("Enquiry error:", error.message);
    res.status(500).json({ message: "Unable to save enquiry." });
  }
});

// Local development ke liye listen block
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Vercel serverless architecture ke liye application export karna zaroori hai
export default app;
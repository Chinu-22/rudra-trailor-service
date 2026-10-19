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

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Rudra Trailor Service backend is running!"
  });
});

app.post("/api/enquiries", async (req, res) => {
  try {
    const { name, email, phone, company, service, pickup, destination, message } = req.body;

    if (!name || !email || !phone || !service || !pickup || !destination) {
      return res.status(400).json({
        message: "Please fill in all required fields."
      });
    }

    const Enquiry = mongoose.model(
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

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database is not connected. Please try again later."
      });
    }

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

    // ---- YAHAN SE GMAIL NOTIFICATION KA CODE SHURU ----
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "chinujangra433@getMaxListeners.com", 
      subject: `New Rudra Trailor Enquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 5px;">Rudra Trailor Service - New Website Enquiry</h2>
          <p>A new query has been submitted with the following details:</p>
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
          <hr style="border: 0; border-top: 1px solid #ccc; margin-top: 20px;" />
          <p style="font-size: 12px; color: #777;">This is an automated notification from your website backend.</p>
        </div>
      `
    };

    // Email send karne ka process (background me chlega, user ka response block nahi hoga)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send nahi ho paya ❌:", error.message);
      } else {
        console.log("Email successfully bhej diya gaya hai! 📩", info.response);
      }
    });
    // ---- GMAIL NOTIFICATION KA CODE YAHAN KHATAM ----

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

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected successfully.");
    } else {
      console.log("MONGODB_URI is missing in the .env file.");
    }

    app.listen(PORT, () => {
      console.log(`Rudra backend running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();
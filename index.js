const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
app.use(cors());
app.use(express.json());
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log("failed to connect to database", err));

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
  try {
    const { userName, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      password: hashedPassword,
      email,
    });

    const saved = await newUser.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ err });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (correctPassword) {
      const { userName, email } = user;
      res.json({ userName, email });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log("its working on port 5000");
});

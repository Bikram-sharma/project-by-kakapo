const express = require("express");
const knex = require("knex");
const app = express();
const cors = require("cors");
const port = 3000;
const bcrypt = require("bcrypt");
app.use(cors());
app.use(express.json());
const db = knex({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5433,
    user: "pixplore",
    password: "12345",
    database: "pixplore_users",
  },
});

app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await db("users").where("username", username).first();
    if (existingUser) {
      if (existingUser.username === username && existingUser.email === email) {
        return res
          .status(400)
          .json({ error: "Username and email are already taken" });
      } else if (existingUser.username === username) {
        return res.status(400).json({ error: "Username already taken" });
      } else {
        return res.status(400).json({ error: "Email already taken" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db("users").insert({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ err });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const user = await db("users").where("username", username).first();
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (correctPassword) {
      const { username, email } = user;
      res.status(200).json({ username, email });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log("its working on port 3000");
});

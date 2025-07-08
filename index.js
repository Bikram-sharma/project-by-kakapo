const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const bcrypt = require("bcrypt");
app.use(cors());
app.use(express.json());
const users = require("./users");

app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = users.find(
      (user) => user.username === username || user.email == email
    );
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

    const newUser = {
      username,
      password: hashedPassword,
      email,
    };

    users.push(newUser);

    res.status(201).json({ username: newUser.username });
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

    const user = users.find((user) => user.username === username);
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

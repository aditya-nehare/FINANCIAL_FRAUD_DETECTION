require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const user_router = require("./routers/user.js");

const app = express();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const session_option = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session(session_option));

app.use("/", user_router);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Database connection error: ", err.message);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  });
};

startServer();

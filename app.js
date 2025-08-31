const express = require("express");
const app = express();
require("dotenv").config();
require("./config/passport");
require("./db/populatedb");

const path = require("node:path");
const usersRouter = require("./routes/usersRouter");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

// Setup ejs and session
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(express.urlencoded({ extended: true }));

// Start passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use("/", usersRouter);

// Start server
PORT = process.env.PORT || 3000;
app.listen(3000, (err) => {
  if (err) {
    throw Error("Not working");
  }
  console.log(`Application running on port ${PORT}`);
});

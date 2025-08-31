const express = require("express");
const app = express();
require("dotenv").config();
const path = require("node:path");
const usersRouter = require("./routes/usersRouter");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false}
}))
app.use(express.urlencoded({ extended: true }));
// Start passport
app.use(passport.initialize())
app.use(passport.session())

app.use("/", usersRouter);

PORT = process.env.PORT || 3000;
app.listen(3000, (err) => {
  if (err) {
    throw Error("Not working");
  }
  console.log(`Application running on port ${PORT}`);
});

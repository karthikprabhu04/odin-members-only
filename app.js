const express = require("express");
const app = express();
require("dotenv").config();
const path = require("node:path");
const usersRouter = require("./routes/usersRouter");
app.use(express.urlencoded({ extended: true }));
const session = require("express-session");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(session({
  secret: "This-is-a-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false}
}))

app.use("/", usersRouter);

PORT = process.env.PORT || 3000;
app.listen(3000, (err) => {
  if (err) {
    throw Error("Not working");
  }
  console.log(`Application running on port ${PORT}`);
});

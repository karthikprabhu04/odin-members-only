const db = require("../db/queries");

// Index page
exports.index = (req, res) => {
  res.render("index");
}

// Home page after signing up or logging in
exports.home = (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/")
  }
  res.render("home", { error: null, user: req.user, membershipStatus: req.user.membershipstatus });
};
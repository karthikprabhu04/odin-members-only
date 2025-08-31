const db = require("../db/queries");

// Index page
exports.index = (req, res) => {
  res.render("index");
};

// Home page after signing up or logging in
exports.home = async (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect("/");
  }

  const messages = await db.getAllMessages();

  res.render("home", {
    error: null,
    user: req.user,
    membershipStatus: req.user.membershipstatus,
    messages: messages,
  });
};

exports.createMessage = async (req, res) => {
  await db.addNewMessage(req.body.title, req.body.content, req.user.id);
  res.redirect("/home");
};

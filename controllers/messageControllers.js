const db = require("../db/queries");

// Index page
exports.index = (req, res) => {
  res.render("index");
};

// Home page after signing up or logging in
exports.home = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  const messages = await db.getAllMessages(req.user.membershipstatus);
  const adminstatus = await db.getAdminStatus(req.user.id);
  console.log("Admin status", adminstatus)

  res.render("home", {
    error: req.flash("error"),
    user: req.user,
    membershipStatus: req.user.membershipstatus,
    messages: messages,
    adminstatus: adminstatus,
  });
};

exports.createMessage = async (req, res) => {
  await db.addNewMessage(req.body.title, req.body.content, req.user.id);
  res.redirect("/home");
};

exports.deleteMessage = async (req, res) => {
  await db.removeMessage(req.params.id);
  res.redirect("/home");
}
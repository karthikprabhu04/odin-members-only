const db = require("../db/queries");

exports.index = async (req, res) => {
  res.render("index");
};

exports.signup = async (req, res) => {
  console.log("Adding user...");
  const { firstName, lastName, username, password } = req.body;
  await db.addUser(firstName, lastName, username, password);
  console.log("User added!");
  res.redirect("/");
};

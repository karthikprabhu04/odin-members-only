const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage("First Name must only include letters.")
    .isLength({ min: 1, max: 30 })
    .withMessage("First Name must be between 1 and 30 characters"),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage("Last Name must only include letters.")
    .isLength({ min: 1, max: 30 })
    .withMessage("Last Name must be between 1 and 30 characters"),
  body("username")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Username must be between 1 and 30 characters")
    .custom(async (username) => {
      // Check if username is taken
      await db.checkUsernameAvailability(username);
    }),
  body("password")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Password should have at least 3 characters"),
  body("confirmPassword")
    .trim()
    .custom((confirmPassword, { req }) => {
      if (confirmPassword !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

// Sign up page
exports.index = async (req, res) => {
  res.render("index", {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
};

// Inputting sign up details
exports.signup = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    const { firstName, lastName, username, password, confirmPassword } =
      req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        errors: errors.array(),
        firstName,
        lastName,
        username,
        password,
        confirmPassword,
      });
    }

    console.log("Adding user...");
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await db.addUser(firstName, lastName, username, hashedPassword);
    console.log("User added!");

    const user = await db.findUserById(id)
    // req.session.userId = id;
    console.log(user)

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.render("home", { error: null, user: req.user });
    })
  },
];

// Home page after signing up or logging in
exports.home = (req, res) => {
  res.render("home", { error: null, user: req.user });
};

// Check passcode to join as member
exports.join = async (req, res) => {
  const userId = req.user.id

  console.log(userId);

  if (req.body.passcode === process.env.PASSCODE) {
    // Update membership status
    console.log("Matched passcode");
    await db.updateMembershipStatus(userId);
    res.render("home", { error: "You are now a club member!", user: req.user });
  } else {
    // Incorrect passcode
    res.render("home", { error: "Incorrect passcode", user: req.user });
  }
};

// Login
exports.loginPage = (req, res) => {
  res.render("login");
};

exports.loginCheck = passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
  });

// Logout
exports.logout  = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login")
  })
}
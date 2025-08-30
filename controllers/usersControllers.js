const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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
        throw new Error("Passwords do not match")
      }
      return true;
    }),
];

exports.index = async (req, res) => {
  res.render("index", {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
};

exports.signup = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, username, password, confirmPassword } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("index", {
        errors: errors.array(),
        firstName,
        lastName,
        username,
        password,
        confirmPassword
      })
    }

    console.log("Adding user...");
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.addUser(firstName, lastName, username, hashedPassword);
    console.log("User added!");
    res.redirect("/");
  },
];

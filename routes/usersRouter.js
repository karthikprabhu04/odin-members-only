const { Router } = require("express");
const router = Router();
const accountControllers = require("../controllers/accountControllers");
const messageControllers = require("../controllers/messageControllers");

router.get("/", messageControllers.index);
// Sign up
router.get("/signup", accountControllers.getSignupPage);
router.post("/signup", accountControllers.signup);
// Log in
router.get("/login", accountControllers.getLoginPage);
router.post("/login", accountControllers.login);
// Log out
router.get("/logout", accountControllers.logout);

// Home page with messsages
router.get("/home", messageControllers.home);
// Join as member
router.post("/join", accountControllers.join);

// Create message
router.post("/createMessage", messageControllers.createMessage)




module.exports = router;

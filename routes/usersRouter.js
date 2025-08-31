const { Router } = require("express");
const router = Router();
const usersControllers = require("../controllers/usersControllers");

router.get("/", usersControllers.index);
router.post("/signup", usersControllers.signup);
router.get("/home", usersControllers.home);
router.post("/join", usersControllers.join);

router.get("/login", usersControllers.loginPage);
router.post("/login", usersControllers.loginCheck);
router.get("/logout", usersControllers.logout);

module.exports = router;

const { Router } = require("express");
const router = Router();
const usersControllers = require("../controllers/usersControllers")

router.get("/", usersControllers.index)
router.post("/signup", usersControllers.signup)
router.get("/home", usersControllers.home)

module.exports = router
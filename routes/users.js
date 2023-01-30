const express = require("express");
const router = express.Router();

const usersHandler = require("./handler/users");
const verifyToken = require("../middlewares/verifyToken");

router.post("/register", usersHandler.register);
router.post("/login", usersHandler.login);
router.get("/confirm/:confirmationCode", usersHandler.verificationEmail);
router.put("/update-user", verifyToken, usersHandler.update);
router.put("/update-password-user", verifyToken, usersHandler.updatePassword);
router.put("/update-image-user", verifyToken, usersHandler.updateImage);
router.get("/data-users", usersHandler.getUser);
router.get("/data-users-id", verifyToken, usersHandler.getUserId);
router.get("/logout", verifyToken, usersHandler.logout);

module.exports = router;

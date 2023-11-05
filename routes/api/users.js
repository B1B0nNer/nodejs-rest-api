const express = require("express");
const router = express.Router();
const auth = require("../../controllers/auth.js");
const validateBody = require("../../helpers/validateBody.js");
const authenticate = require("../../middlewares/authenticate.js");
const schemas = require("../../schemas/user-schema.js").schemas;
const upload = require("../../middlewares/upload.js");

const userRegisterValidate = validateBody(schemas.registerSchema);
const userLoginValidate = validateBody(schemas.loginSchema);
// const userEmailValidate = validateBody(schemas.emailSchema);

const userAvatarUpload = upload.single("avatar")

router.post("/register", userRegisterValidate, auth.register);

router.get("/verify/:verificationToken", auth.verifyEmail);

router.post("/verify", auth.resendVerifyEmail);

router.post("/login", userLoginValidate, auth.login);

router.get("/current", authenticate, auth.getCurrentUser);

router.post("/logout", authenticate, auth.logout);

router.patch("/avatars", authenticate, userAvatarUpload, auth.updateAvatar);

module.exports = router;

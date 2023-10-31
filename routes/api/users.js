const express = require("express");
const router = express.Router();
const auth = require("../../controllers/auth.js");
const validateBody = require("../../helpers/validateBody.js");
const authenticate = require("../../middlewares/authenticate.js");
const schemas = require("../../schemas/user-schema.js").schemas;

const userRegisterValidate = validateBody(schemas.registerSchema);
const userLoginValidate = validateBody(schemas.loginSchema);

router.post("/register", userRegisterValidate, auth.register);

router.post("/login", userLoginValidate, auth.login);

router.get("/current", authenticate, auth.getCurrentUser);

router.post("/logout", authenticate, auth.logout);

module.exports = router;

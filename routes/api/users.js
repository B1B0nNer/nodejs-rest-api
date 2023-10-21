const express = require("express");
const router = express.Router();
const auth = require("../../controllers/auth.js");
const validateBody = require("../../helpers/validateBody.js");
const authenticate = require("../../helpers/authenticate.js");
const { schemas } = require("../../schemas/user-schema.js");

// const userRegisterValidate = validateBody(schemas.registerSchema);
const userLoginValidate = validateBody(schemas.loginSchema);
const userUpdateSubscriptionValidate = validateBody(schemas.updateSubscriptionSchema);

router.post("/register", auth.register);

router.post("/login", userLoginValidate, auth.login);

router.get("/current", authenticate, auth.getCurrentUser);

router.post("/logout", authenticate, auth.logout);

router.patch("/", authenticate, userUpdateSubscriptionValidate, auth.updateSubscription);

module.exports = router;

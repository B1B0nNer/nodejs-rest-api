const Joi = require("joi");

const validSubscriptionOptions = ["starter", "pro", "business"];

const registerSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "Missing required password field",
  }),
  email: Joi.string().required().messages({
    "any.required": "Missing required email field",
  }),
  subscription: Joi.string()
    .valid(...validSubscriptionOptions)
    .default(validSubscriptionOptions[0])
    .messages({ "any.only": "Invalid subscription" }),
});

const loginSchema = Joi.object({
  email: Joi.string().required().messages({
    "any.required": "Missing required email field",
  }),
  password: Joi.string().required().messages({
    "any.required": "Missing required password field",
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(/^\S+@\S+\.\S+$/).required().messages({
    "string.pattern.base": "Invalid email format",
    "any.required": "Missing required field email",
  }),
});

module.exports = {
  schemas: {
    registerSchema,
    loginSchema,
    emailSchema
  }
};

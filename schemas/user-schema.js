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

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...validSubscriptionOptions)
    .default(validSubscriptionOptions[0])
    .required()
    .messages({
      "any.only": `Subscription must be one of ${validSubscriptionOptions.join(", ")}.`,
    }),
});

module.exports = {
  schemas: {
    registerSchema,
    loginSchema,
    updateSubscriptionSchema
  }
};

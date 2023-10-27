const Joi = require("joi");

const contactsSchemas = Joi.object({
  name: Joi.string().regex(/^[a-zA-Z]+$/).required(),
  email: Joi.string().regex(/^[a-zA-Z0-9@.]+$/).email().required(),
  phone: Joi.string().regex(/^[0-9+\-() ]+$/).required(),
  favorite: Joi.boolean()
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {contactsSchemas, updateFavoriteSchema};
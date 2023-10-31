const express = require("express");
const contacts = require("../../controllers/contacts.js");

const validateBody = require('../../helpers/validateBody.js');
const isValidId = require('../../middlewares/isValidId.js');
const contactsSchema = require('../../schemas/contact-schema.js').contactsSchemas;
const updateFavoriteSchema = require('../../schemas/contact-schema.js').updateFavoriteSchema;

const authenticate = require('../../middlewares/authenticate.js');

const contactAddValidate = validateBody(contactsSchema);
const contactUpdateFavoriteValidate = validateBody(updateFavoriteSchema)

const router = express.Router();

router.get("/", authenticate, contacts.listContacts);

router.get("/:id", authenticate, isValidId, contacts.getContactById);

router.post("/", authenticate, contactAddValidate, contacts.addContact);

router.delete("/:id", authenticate, isValidId, contacts.removeContact);

router.put("/:id", authenticate, isValidId,  contactAddValidate, contacts.updateContact);

router.patch("/:id/favorite", authenticate, isValidId, contactUpdateFavoriteValidate, contacts.updateFavoriteContact);

module.exports = router;

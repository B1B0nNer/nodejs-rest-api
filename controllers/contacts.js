const httpError = require("../helpers/httpError.js");
const Wrapper = require("../helpers/Wrapper.js");
const Contact = require("../service/schemas.js");

const listContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };
  if (favorite !== undefined) {
    query.favorite = favorite;
  }
  const result = await Contact.find(query, null, { skip, limit }).populate("owner", "name email");
  res.json(result);
};

const getContactById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner});
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json({
    message: "contact deleted",
  });
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

const updateFavoriteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.json(result);
};

module.exports = {
  listContacts: Wrapper(listContacts),
  addContact: Wrapper(addContact),
  getContactById: Wrapper(getContactById),
  removeContact: Wrapper(removeContact),
  updateContact: Wrapper(updateContact),
  updateFavoriteContact: Wrapper(updateFavoriteContact),
};

const mongoose = require("mongoose");
const { handleSaveError, runValidatorsAtUpdate } = require("./hooks.js");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    favorite: {
        type: Boolean,
        default: false
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }
});

contactSchema.pre("save", function (next) {
  if (!this.name) {
    next(new Error("Name is required"));
  } else {
    next();
  }
});

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);
contactSchema.post("findOneAndUpdate", handleSaveError)

const Contact = mongoose.model("contacts", contactSchema);

module.exports = Contact;
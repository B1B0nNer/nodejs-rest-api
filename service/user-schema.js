const mongoose = require("mongoose");
const { handleSaveError, runValidatorsAtUpdate } = require("./hooks.js");

const validSubscriptionOptions = ["starter", "pro", "business"];

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      match: [
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).{8,}$/,
        `
The password must meet the following criteria:
- Minimum 8 characters in length.
- Must contain at least one digit (0-9).
- Must contain at least one uppercase letter (A-Z).
- Must contain at least one lowercase letter (a-z).
- Must contain at least one special character (e.g., !, @, #, $, %, ^, &, *, ?) or space.
Please enter a valid password to proceed.
`
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    subscription: {
      type: String,
      enum: validSubscriptionOptions,
      default: validSubscriptionOptions[0],
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);
  
userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError)

const User = mongoose.model("user", userSchema);

module.exports = User;

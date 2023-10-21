const handleMongooseError = require("../helpers/handleMongooseError.js");
const { Schema, model } = require("mongoose");

const validSubscriptionOptions = ["starter", "pro", "business"];

const userSchema = new Schema(
    {
      password: {
        type: String,
        required: [true, "Set password for user"],
        validate: {
          validator: (value) =>
            /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).{8,}$/.test(value),
          message: `
  The password must meet the following criteria:
  - Minimum 8 characters in length.
  - Must contain at least one digit (0-9).
  - Must contain at least one uppercase letter (A-Z).
  - Must contain at least one lowercase letter (a-z).
  - Must contain at least one special character (e.g., !, @, #, $, %, ^, &, *, ?) or space.
  Please enter a valid password to proceed.
          `,
        },
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
          validator: (value) => /^\S+@\S+\.\S+$/.test(value),
          message: "Invalid email format",
        },
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
    },
    { versionKey: false, timestamps: true }
  );
  
  userSchema.post("save", handleMongooseError);

  
module.exports = model("user", userSchema)
const { hash, compare } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const { sign } = require("jsonwebtoken");
const { jwtSecret, jwtExpiration } = require("../../../config/globals");

const userSchema = new Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
  },
  { timestamps: true }
);

userSchema.set("toObject", { versionKey: false });

userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.method({
  token() {
    const payload = { sub: this._id };
    const jwtOptions = { expiresIn: jwtExpiration };
    return sign(payload, jwtSecret, jwtOptions);
  },
  async passwordMatches(candidatePassword) {
    return compare(candidatePassword, this.password);
  },
});

const User = model("User", userSchema);

module.exports = User;

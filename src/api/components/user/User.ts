import { hash, compare } from "bcryptjs";
import { model, Schema, Model, Document } from "mongoose";
import { sign } from "jsonwebtoken";
import { jwtSecret, jwtExpiration } from "@config/globals";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  social: {
    google: {
      id: string;
      token: string;
    };
  };
  token(): string;
  passwordMatches(): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 128,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      minlength: 2,
      maxlength: 128,
      required: true,
    },
    social: {
      google: {
        id: String,
        token: String,
      },
    },
  },
  { timestamps: true },
);

userSchema.set("toObject", { versionKey: false });

userSchema.pre<IUser>("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.token = function token() {
  const payload = { sub: this._id, name: this.name };
  const jwtOptions = { expiresIn: jwtExpiration };
  return sign(payload, jwtSecret, jwtOptions);
};

userSchema.methods.passwordMatches = async function passwordMatches(candidatePassword) {
  return compare(candidatePassword, this.password);
};

const User: Model<IUser> = model("User", userSchema);

export default User;
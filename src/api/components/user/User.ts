import { hash, compare } from "bcryptjs";
import { model, Schema, Model, Document, Types } from "mongoose";
import { sign } from "jsonwebtoken";
import { jwtSecret, jwtExpiration } from "@config/globals";
import mongooseLeanId from "mongoose-lean-id";

export interface IUser {
  email: string;
  password: string;
  name: string;
  social?: {
    google?: {
      id: string;
      token: string;
    };
  };
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  id: string;
  token(): string;
  passwordMatches(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
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

userSchema.plugin(mongooseLeanId);
userSchema.set("toObject", { versionKey: false });

userSchema.pre<IUserDocument>("save", async function save(next) {
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

const User: Model<IUserDocument> = model("User", userSchema);

export default User;

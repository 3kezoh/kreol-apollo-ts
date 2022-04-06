import { jwtPayload, jwrtPayload } from "@@components";
import { jwrt, jwt } from "@config/env";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Document, model, Model, NativeError, Schema, Types } from "mongoose";
import mongooseLeanId from "mongoose-lean-id";
import { v4 } from "uuid";

export interface IUser {
  email: string;
  password: string;
  name: string;
  social?: {
    google?: {
      id: string;
    };
  };
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
  id: string;
  token(): Promise<{ accessToken: string; refreshToken: string }>;
  passwordMatches(password: string): Promise<boolean>;
  refreshTokenMatches(refreshToken: string): Promise<boolean>;
}

export interface IUserPopulated extends IUser {
  id: string;
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
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    blacklist: [
      {
        jti: String,
        exp: Number,
      },
    ],
  },
  { timestamps: true },
);

userSchema.plugin(mongooseLeanId);
userSchema.set("toObject", { versionKey: false });

/**
 * Hashes the password before saving
 */

userSchema.pre<IUserDocument>("save", async function save(next) {
  try {
    if (this.isModified("password")) this.password = await hash(this.password, 10);
    return next();
  } catch (error) {
    if (error instanceof NativeError) {
      return next(error);
    }
    throw error;
  }
});

/**
 * ! Google OAuth 2 for now
 * Generates a JWT
 */

/* istanbul ignore next */
userSchema.methods.token = async function token() {
  const jwtPayload: jwtPayload = { sub: this._id, name: this.name };
  const jwrtPayload: jwrtPayload = { sub: this._id };
  const accessToken = sign(jwtPayload, jwt.secret, { expiresIn: jwt.expiration });
  const refreshToken = sign(jwrtPayload, jwrt.secret, { expiresIn: jwrt.expiration, jwtid: v4() });
  return { accessToken, refreshToken };
};

/**
 * ! Google OAuth 2 for now
 * Compares a password to the user's password
 * @param password the password to compare
 * @returns true if it matches, false otherwise
 */

/* istanbul ignore next */
userSchema.methods.passwordMatches = async function passwordMatches(password) {
  return compare(password, this.password);
};

export const User: Model<IUserDocument> = model("User", userSchema);

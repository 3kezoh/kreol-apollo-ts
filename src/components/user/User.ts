import { jwtPayload, jwrtPayload } from "@@components";
import { jwrt, jwt } from "@config/globals";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Document, model, Model, Schema, Types } from "mongoose";
import mongooseLeanId from "mongoose-lean-id";
import { v4 } from "uuid";

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
  blacklist?: { jti: string; exp: number }[];
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
        token: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    refreshToken: String,
  },
  { timestamps: true },
);

userSchema.plugin(mongooseLeanId);
userSchema.set("toObject", { versionKey: false });

userSchema.pre<IUserDocument>("save", async function save(next) {
  try {
    if (this.isModified("password")) this.password = await hash(this.password, 10);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.token = async function token() {
  const jwtPayload: jwtPayload = { sub: this._id, name: this.name };
  const jwrtPayload: jwrtPayload = { sub: this._id };
  const accessToken = sign(jwtPayload, jwt.secret, { expiresIn: jwt.expiration });
  const refreshToken = sign(jwrtPayload, jwrt.secret, { expiresIn: jwrt.expiration, jwtid: v4() });
  return { accessToken, refreshToken };
};

userSchema.methods.passwordMatches = async function passwordMatches(candidatePassword) {
  return compare(candidatePassword, this.password);
};

export const User: Model<IUserDocument> = model("User", userSchema);

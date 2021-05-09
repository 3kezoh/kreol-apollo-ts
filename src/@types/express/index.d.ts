declare namespace Express {
  interface Request {
    user: import("@User").IUser;
  }
}

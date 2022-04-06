db.createUser({
  user: "kreol",
  pwd: "password",
  roles: [
    {
      role: "readWrite",
      db: "kreol",
    },
  ],
});

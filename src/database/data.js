/* eslint-disable no-loop-func */
const fs = require("fs");
const path = require("path");

const lorem = fs
  .readFileSync(path.join(__dirname, "lorem.md"), { encoding: "ascii" })
  .replace(/\r?\n|\r/g, "")
  .trim()
  .toLowerCase()
  .split(/[ .,]+/g)
  .filter((s) => s.length > 1);

const ran = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const lor = (size = 1) => {
  let str = "";
  while (str.length < size) str += `${lorem[ran(0, lorem.length - 1)]} `;
  return str.trim();
};

const randomUsers = (n) => {
  const users = [];
  while (users.length < n) {
    const user = { email: `${lor()}@gmail.com`, password: "password", name: lor() };
    if (users.length === 0) users.push(user);
    if (users.findIndex(({ email, name }) => email === user.email || name === user.name) === -1)
      users.push(user);
  }
  return users;
};

const randomDefinitions = (n) => {
  const definitions = [];
  while (definitions.length < n)
    definitions.push({
      word: lor(ran(1, 5)),
      meaning: lor(ran(1, 25)),
      example: ran(1, 10) > 3 ? lor(ran(1, 50)) : null,
    });
  return definitions;
};

module.exports = { randomUsers, randomDefinitions };

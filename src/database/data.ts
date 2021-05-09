/* eslint-disable no-loop-func */
import fs from "fs";
import path from "path";
import ran from "./ran";

interface IUser {
  email: string;
  password: string;
  name: string;
}

interface IDefinition {
  word: string;
  meaning: string;
  example: string | null;
}

const lorem = fs
  .readFileSync(path.join(__dirname, "lorem.md"), { encoding: "ascii" })
  .replace(/\r?\n|\r/g, "")
  .trim()
  .toLowerCase()
  .split(/[ .,]+/g)
  .filter((s) => s.length > 1);

const lor = (size = 1) => {
  let str = "";
  while (str.length < size) str += `${lorem[ran(0, lorem.length - 1)]} `;
  return str.trim();
};

const randomUsers = (n: number): IUser[] => {
  const users = [];
  while (users.length < n) {
    const user = { email: `${lor()}@gmail.com`, password: "password", name: lor() };
    if (users.length === 0) users.push(user);
    if (users.findIndex(({ email, name }) => email === user.email || name === user.name) === -1)
      users.push(user);
  }
  return users;
};

const randomDefinitions = (n: number): IDefinition[] => {
  const definitions = [];
  while (definitions.length < n)
    definitions.push({
      word: lor(ran(1, 5)),
      meaning: lor(ran(1, 25)),
      example: ran(1, 10) > 3 ? lor(ran(1, 50)) : null,
    });
  return definitions;
};

export { randomUsers, randomDefinitions };

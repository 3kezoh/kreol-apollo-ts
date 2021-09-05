/* eslint-disable import/first */
import { addAliases } from "module-alias";
import { join } from "path";

addAliases({
  "@components": join(__dirname, "components"),
  "@Auth": join(__dirname, "components", "auth"),
  "@Definition": join(__dirname, "components", "definition"),
  "@Report": join(__dirname, "components", "report"),
  "@User": join(__dirname, "components", "user"),
  "@Vote": join(__dirname, "components", "vote"),
  "@bin": join(__dirname, "bin"),
  "@config": join(__dirname, "config"),
  "@directives": join(__dirname, "directives"),
  "@middlewares": join(__dirname, "middlewares"),
  "@scalars": join(__dirname, "scalars"),
  "@utils": join(__dirname, "utils"),
  "@test": join(__dirname, "utils", "test"),
});

import "@bin/www";

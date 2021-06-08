import { Component } from "@@components";
import * as auth from "./auth";
import * as definition from "./definition";
import * as report from "./report";
import * as user from "./user";
import * as vote from "./vote";

const components: Component[] = [auth, definition, report, user, vote];

export default components;

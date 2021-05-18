import { Component } from "@@api";
import auth from "./auth";
import definition from "./definition";
import report from "./report";
import user from "./user";
import vote from "./vote";

const components: Component[] = [auth, definition, report, user, vote];

export default components;

import { Directive } from "@@api";
import cacheControl from "./cacheControl";
import isAuthenticated from "./isAuthenticated";

const directives: Directive[] = [cacheControl, isAuthenticated];

export default directives;

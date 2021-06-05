import { Directive } from "@@api";
import cacheControl from "./cacheControl";
import isAdmin from "./isAdmin";
import isAuthenticated from "./isAuthenticated";

const directives: Directive[] = [cacheControl, isAdmin, isAuthenticated];

export default directives;

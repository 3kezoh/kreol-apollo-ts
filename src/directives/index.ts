import { Directive } from "@@components";
import cacheControl from "./cacheControl";
import isAuth from "./isAuth";

const directives: Directive[] = [cacheControl, isAuth];

export default directives;

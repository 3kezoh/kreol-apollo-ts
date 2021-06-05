import responseCachePlugin from "apollo-server-plugin-response-cache";
import { log } from "./log";

export const plugins = [log, responseCachePlugin];

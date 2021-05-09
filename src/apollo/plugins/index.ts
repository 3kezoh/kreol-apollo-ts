import responseCachePlugin from "apollo-server-plugin-response-cache";
import log from "./log";

export default [log, responseCachePlugin];

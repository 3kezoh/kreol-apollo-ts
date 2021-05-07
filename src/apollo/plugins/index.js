const responseCachePlugin = require("apollo-server-plugin-response-cache");
const log = require("./log");

module.exports = [log, responseCachePlugin];

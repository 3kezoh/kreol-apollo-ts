const { makeExecutableSchemaFromComponents } = require("../utils/components");
const auth = require("./auth");
const user = require("./user");

module.exports = makeExecutableSchemaFromComponents({
  components: [auth, user],
});

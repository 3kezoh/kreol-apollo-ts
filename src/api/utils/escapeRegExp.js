const escapeRegEx = (string) =>
  new RegExp(`^${string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

module.exports = escapeRegEx;

const escapeRegEx = (string) =>
  new RegExp(`^${string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

export default escapeRegEx;

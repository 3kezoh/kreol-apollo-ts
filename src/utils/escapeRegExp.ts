const escapeRegEx = (s: string): RegExp =>
  new RegExp(`^${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

export default escapeRegEx;

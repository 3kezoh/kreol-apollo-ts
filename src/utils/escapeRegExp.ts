const escapeRegEx = (s: string | undefined): RegExp =>
  new RegExp(`^${s?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");

export default escapeRegEx;

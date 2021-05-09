const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj || {}, prop);

export default has;

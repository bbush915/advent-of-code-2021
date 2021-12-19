/**
 * Clones an object.
 *
 * @param {any} obj The object.
 * @return {any} The clone.
 */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Determines whether the given value is numeric.
 *
 * @param {*} value The value.
 * @return {boolean} A value indicating whether the value is numeric.
 */
function isNumeric(value) {
  value = "" + value;
  return !isNaN(value) && !isNaN(parseFloat(value));
}

module.exports = {
  clone,
  isNumeric,
};

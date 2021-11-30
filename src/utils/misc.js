/**
 * Clones an object.
 *
 * @param {any} obj The object.
 * @return {any} The clone.
 */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {
  clone,
};

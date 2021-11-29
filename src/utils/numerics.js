/**
 * Calulates the (least positive) solution of the system of congruences using
 * the Chinese Remainder Theorem.
 *
 *
 * x ≡ a_1 (mod m_1)
 *
 * ...
 *
 * x ≡ a_k (mod m_k)
 *
 *
 * @param {number[]} a The integers.
 * @param {numbe[]} m The moduli.
 */
function crt(a, m) {
  const M = m.reduce((product, val) => ((product *= val), product), 1);

  let x = 0;

  for (let i = 0; i < m.length; i++) {
    x += lpr(a[i] * (M / m[i]) * inv(M / m[i], m[i]), M);
  }

  return lpr(x, M);
}

/**
 * @typedef ExtendedGCD
 * @type {object}
 * @property {number} gcd The greatest common divisor.
 * @property {string} bezout The Bézout coefficients.
 */

/**
 * Calculates the greatest common divisor of two nonnegative integers, as well
 * as their associated Bézout coefficients.
 *
 * @param {number} a The first nonnegative integer.
 * @param {number} b The second nonnegative integer.
 * @return {ExtendedGCD} The greatest common divisor and associated Bézout coefficients.
 */
function egcd(a, b) {
  let did_swap = false;

  if (a < b) {
    [a, b] = [b, a];
    did_swap = true;
  }

  // NOTE - Extended Euclidean algorithm.

  let [old_r, r] = [a, b];
  let [old_s, s] = [1, 0];
  let [old_t, t] = [0, 1];

  while (r !== 0) {
    const q = Math.floor(old_r / r);

    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }

  return {
    gcd: old_r,
    bezout: did_swap ? [old_t, old_s] : [old_s, old_t],
  };
}

/**
 * Calulates the greatest common divisor of two nonnegative integers.
 *
 * @param {number} a The first nonnegative integer.
 * @param {number} b The second nonnegative integer.
 * @return {number} The greatest common divisor.
 */
function gcd(a, b) {
  if (a < b) {
    [a, b] = [b, a];
  }

  // NOTE - Euclidean algorithm.

  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return a;
}

/**
 * Calculates the (least positive) multiplicative inverse of an integer under a
 * modulus.
 *
 * @param {number} a The integer.
 * @param {number} m The modulus.
 * @return {number | null} The modular multiplicative inverse, if it exists.
 */
function inv(a, m) {
  const { gcd, bezout } = egcd(a, m);

  if (gcd !== 1) {
    return null;
  }

  return lpr(bezout[0], m);
}

/**
 * Calculates the least positive residue of an integer under a modulus.
 *
 * @param {number} a The integer.
 * @param {number} m The modulus.
 * @return {number} The least positive residue.
 */
function lpr(a, m) {
  if (a < 0) {
    return m - (-a % m);
  }

  return a % m;
}

/**
 * Calculates the value of Euler's totient (phi) function for a positive integer.
 *
 * @param {number} n The integer.
 * @return {number} The value of Euler's totient function.
 */
function phi(n) {
  let result = 1;

  for (let i = 2; i < n; i++) {
    if (gcd(i, n) === 1) {
      result++;
    }
  }

  return result;
}

module.exports = {
  crt,
  egcd,
  gcd,
  inv,
  lpr,
  phi,
};

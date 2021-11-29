const { crt, egcd, gcd, inv, lpr, phi } = require("./numerics");

describe("crt", function () {
  it("correctly solves the system of congruences", function () {
    const result = crt([2, 3, 2], [3, 5, 7]);
    expect(result).toBe(23);
  });
});

describe("egcd", function () {
  it("correctly calculates (0,0)", function () {
    const { gcd } = egcd(0, 0);

    expect(gcd).toBe(0);
  });

  it("correctly calculates (3,0) and associated Bézout coefficients", function () {
    const { gcd, bezout } = egcd(3, 0);

    expect(gcd).toBe(3);
    expect(bezout[0]).toBe(1);
    expect(bezout[1]).toBe(0);
  });

  it("correctly calculates (0,3) and associated Bézout coefficients", function () {
    const { gcd, bezout } = egcd(0, 3);

    expect(gcd).toBe(3);
    expect(bezout[0]).toBe(0);
    expect(bezout[1]).toBe(1);
  });

  it("correctly calculates (48,18) and associated Bézout coefficients", function () {
    const { gcd, bezout } = egcd(48, 18);

    expect(gcd).toBe(6);
    expect(bezout[0]).toBe(-1);
    expect(bezout[1]).toBe(3);
  });
});

describe("gcd", function () {
  it("correctly calculates (0,0)", function () {
    const result = gcd(0, 0);
    expect(result).toBe(0);
  });

  it("correctly calculates (3,0)", function () {
    const result = gcd(3, 0);
    expect(result).toBe(3);
  });

  it("correctly calculates (0,3)", function () {
    const result = gcd(0, 3);
    expect(result).toBe(3);
  });

  it("correctly calculates (48,18)", function () {
    const result = gcd(48, 18);
    expect(result).toBe(6);
  });
});

describe("inv", function () {
  it("correctly calculates the inverse of 2 modulo 3", function () {
    const result = inv(2, 3);
    expect(result).toBe(2);
  });

  it("correctly calculates the inverse of 5 modulo 3", function () {
    const result = inv(5, 3);
    expect(result).toBe(2);
  });

  it("correctly handles non-relatively prime integers", function () {
    const result = inv(2, 4);
    expect(result).toBe(null);
  });
});

describe("lpr", function () {
  it("correctly calculates the least positive residue of 1 modulo 3", function () {
    const result = lpr(1, 3);
    expect(result).toBe(1);
  });

  it("correctly calculates the least positive residue of -11 modulo 5", function () {
    const result = lpr(-11, 5);
    expect(result).toBe(4);
  });
});

describe("phi", function () {
  it("correctly calculates phi(9)", function () {
    const result = phi(9);
    expect(result).toBe(6);
  });
});

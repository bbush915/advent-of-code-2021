const { clone } = require("./misc");

describe("misc", function () {
  describe("clone", function () {
    it("should clone an array", function () {
      const arr = [1, 2, 3];

      const result = clone(arr);
      result.push(4);

      expect(result).toEqual([1, 2, 3, 4]);
      expect(arr.length).toBe(3);
    });
  });
});

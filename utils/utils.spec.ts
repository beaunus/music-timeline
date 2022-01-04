import _ from "lodash";

import { shortenArray } from "./utils";

describe("utils", () => {
  describe("shortenArray", () => {
    const startElement = _.random(1, 100);
    const length = _.random(2, 100);
    const array = _.range(startElement, startElement + length + 1);

    it("should return an array no longer than the given maxLength", () => {
      for (let maxLength = 2; maxLength <= length; ++maxLength)
        expect(shortenArray(array, maxLength).length).toBeLessThanOrEqual(
          maxLength
        );
    });

    it("should return elements in the same order as the original array", () => {
      for (let maxLength = 2; maxLength <= length; ++maxLength) {
        const actual = shortenArray(array, maxLength);
        expect(actual).toStrictEqual(_.sortBy(actual));
      }
    });

    it("should contain the same first and last elements as the original array", () => {
      for (let maxLength = 2; maxLength <= length; ++maxLength) {
        const actual = shortenArray(array, maxLength);
        expect(_.first(actual)).toStrictEqual(_.first(array));
        expect(_.last(actual)).toStrictEqual(_.last(array));
      }
    });

    it("each interval between elements should be equal", () => {
      for (let maxLength = 3; maxLength <= length; ++maxLength) {
        const actual = shortenArray(array, maxLength);
        for (let i = 2; i < actual.length; ++i) {
          expect(Number(actual[i]) - Number(actual[i - 1])).toBe(
            Number(actual[i - 1]) - Number(actual[i - 2])
          );
        }
      }
    });
  });
});

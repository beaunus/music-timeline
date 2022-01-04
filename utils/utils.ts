import _ from "lodash";

export function shortenArray<T>(array: T[], maxLength: number) {
  const factors = _.range(1, array.length / 2)
    .filter(
      (number) =>
        (array.length - 1) % number === 0 &&
        (array.length - 1) / number < maxLength
    )
    .concat([array.length - 1]);
  return _.chunk(
    array.slice(0, array.length - 1),
    _.maxBy(factors, (factor) => array.length / factor)
  )
    .map(([element]) => element)
    .concat([array[array.length - 1]]);
}

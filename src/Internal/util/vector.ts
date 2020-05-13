const sum = (listOfLists: Array<Array<number>>): Array<number> => {
  let sum = listOfLists[0];

  for (let i = 1; i < listOfLists.length; i++) {
    sum = add2(sum, listOfLists[i]);
  }

  return sum;
};
const add2 = (listA: Array<number>, listB: Array<number>): Array<number> =>
  listA.map((a: number, i: number) => a + listB[i]);

module.exports = {
  add2,
  sum,
};

// console.log(vector.add2([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]));
// console.log(
//   vector.sum([
//     [1, 2, 3, 4, 5],
//     [6, 7, 8, 9, 10],
//     [11, 12, 13, 14, 15],
//   ])
// );
// [7, 9, 11, 13, 15]
// [(18, 21, 24, 27, 30)];

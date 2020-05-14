function average(listOfLists: Array<Array<number>>): Array<number> {
  const s = sum(listOfLists);

  return divide(s, listOfLists.length);
}
function sum(listOfLists: Array<Array<number>>): Array<number> {
  let sum = listOfLists[0];

  for (let i = 1; i < listOfLists.length; i++) {
    sum = add2(sum, listOfLists[i]);
  }

  return sum;
}
function divide(vector: Array<number>, scalar: number): Array<number> {
  return vector.map((val: number) => val / scalar);
}

function add2(listA: Array<number>, listB: Array<number>): Array<number> {
  return listA.map((a: number, i: number) => a + listB[i]);
}

module.exports = {
  add2,
  average,
  divide,
  sum,
};

// console.log(add2([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]));
// console.log(
//   sum([
//     [1, 2, 3, 4, 5],
//     [6, 7, 8, 9, 10],
//     [11, 12, 13, 14, 15],
//   ])
// );
// console.log(divide([1, 2, 3, 4, 5], 5));
// console.log(
//   average([
//     [1, 2, 3, 4, 5],
//     [6, 7, 8, 9, 10],
//     [11, 12, 13, 14, 15],
//   ])
// );

export function flip(array, i) {
  //flip i 'O'/''
  let tmp = array[i];
  array[i] = tmp === "" ? "O" : "";
}

export function flipCross(array, i) {
  //flip i && up/down/left/right

  //flip 'O'/'' to i
  flip(array, i);
  //lighton: up
  if (!(i < 5)) flip(array, i - 5);
  //lighton: down
  if (!(i >= 20)) flip(array, i + 5);
  //lighton: left
  if (!(i % 5 === 0)) flip(array, i - 1);
  //lighton: right
  if (!(i % 5 === 4)) flip(array, i + 1);
}

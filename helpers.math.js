const sum = (x, y) => x + y
const minus = (x, y) => x - y
const divide = (x, y) => x / y
const avg = (...list) => divide(list.reduce(sum, 0), list.length)
const decimals = (decimal) => (x) => Number(Number(x).toFixed(decimal))

module.exports = {
  sum,
  minus,
  divide,
  avg,
  decimals,
}
const moment = require('moment')
let toDate = function (date) {
  let d = moment(date).format('YYYY-MM-DD')
  return d
}
let toDateTime = function (date) {
  let d = moment(date).format('YYYY-MM-DD HH:mm:ss')
  return d
}
// console.log(toDate("2020-11-01T16:00:00.000Z"))
module.exports = { toDate: toDate, toDateTime: toDateTime }
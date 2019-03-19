var formatTimeToMs = function(strtime) {
  let that = this;
  // var strtime = that.data.createTime;
  var date = new Date(strtime); //传入一个时间格式，如果不传入就是获取现在的时间了，这样做不兼容火狐。
  // 可以这样做
  var date = new Date(strtime.replace(/-/g, '/'));
  console.log(date.getTime() - 8 * 60 * 60 * 1000) // 减去8小时的毫秒数
  return (date.getTime() - 8 * 60 * 60 * 1000);
}
var formatTimeToTime=function(time) {
  var date = new Date(time);
  // var date = that.formatTimeToMs();
  console.log(date);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  console.log(Y + M + D + h + m + s);
  return (Y + M + D + h + m + s);
}
// var timeToUTC = function(time) {
//   var ms = formatTimeToMs(time);
//   return formatTimeToTime(ms);
// }
const timeToUTC = (time) => {
  var ms = formatTimeToMs(time);
  return formatTimeToTime(ms);
}
module.exports = {
  timeToUTC
}
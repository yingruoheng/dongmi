const formatTime = time => {
  var date = new Date(time);
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  if( second == '' || second == null){
    second = 0;
  }
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getWeekStartDay() {
  var now = new Date();
  var dayNum = now.getDay();
  var timestamp = now.getTime() - (dayNum - 1) * 24 * 60 * 60 * 1000;
  return this.timestamp_to_date(timestamp)
}

function getWeekEndDay() {
  var now = new Date();
  var dayNum = now.getDay();
  var timestamp = now.getTime() + (7 - dayNum) * 24 * 60 * 60 * 1000;
  return this.timestamp_to_date(timestamp)
}

//格式化时间
function formateT(timeStr){
  var date = new Date();
  var year = date.getFullYear();
  var time1 = timeStr.split(' ');
  var month = time1[0].split('月')[0];
  var day = time1[0].split('月')[1].split('日')[0];
  var hm = time1[1].split(':')
  var hour = hm[0];
  var minute = hm[1];

  var result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + '00';
  return result;
}

//时间戳转换成日期时间
function timestamp_to_date(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法
  var milliseconds = now_new - dateTime;
  // return [year, month, day].map(formatNumber).join('-');
  return [month, day].map(formatNumber).join('/');
}
//判断是否含有特殊字符和emoji表情
function isEmojiCharacter(substring) {
  if (substring) {
    var reg = new RegExp("[~#^$@%&!?%*]", 'g');
    if (substring.match(reg)) {
      return true;
    }
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2B05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
          || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
          || hs == 0x2b50) {
          return true;
        }
      }
    }
  }
};

const shareEvent = (option, obj) => {
  let shareObj = {
    title: obj.title,
    path: obj.path,
    imgUrl: obj.imgUrl,
    success(res) {
      // 转发成功之后的回调
      if (res.errMsg == 'shareAppMessage:ok') { }
    },
    fail(res) {
      // 转发失败之后的回调
      if (res.errMsg == 'shareAppMessage:fail cancel') {
        // 用户取消转发
      } else if (res.errMsg == 'shareAppMessage:fail') {
        // 转发失败，其中 detail message 为详细失败信息
      　　　　}
    },
    complete() {
      // 转发结束之后的回调（转发成不成功都会执行）
    }
  };
  if (option.from === 'button') {
    // 来自页面内转发按钮
    console.log("来自页面内转发按钮")
    return shareObj;
    
  }
  return shareObj;
}

function deleteItemOnPage(param) {
  console.log(param);
  var ItemList = param.data.ItemList;
  console.log(ItemList)
  var array = [];
  for (let i in ItemList) {
    //push到空数组里
    array.push(ItemList[i]);
    console.log(array);
  }
  console.log(array);
  // console.log(typeof (array))
  // console.log(array);
  array.splice(param.data.id, 1);
  console.log(array);
  ItemList = array;
  console.log(ItemList);
  return ItemList;
}

module.exports = {
  formatTime: formatTime,
  getWeekStartDay: getWeekStartDay,
  getWeekEndDay: getWeekEndDay,
  formateT: formateT,
  timestamp_to_date: timestamp_to_date,
  isEmojiCharacter: isEmojiCharacter,
  shareEvent: shareEvent,
  deleteItemOnPage: deleteItemOnPage,
}
var params = {};
const api = require('./api.js');
const url = api.apiURL
const timeUtil = require('./timeUtil.js');
var map = new Map();
// onshow页面刷新，路径
map.set("pages/release/release", ["ModuleShow", "pages/release/release"]);//添加新的key-value
map.set("pages/weekly/weekly", ["ModuleShow", "pages/test/test"]);
map.set("pages/trainDetail/trainDetail", ["ModuleShow", "pages/trainDetail/trainDetail"]);
map.set("pages/recommend/recommend", ["ModuleShow", "pages/recommend/recommend"]);
map.set("pages/taskDetail/taskDetail", ["ModuleShow", "pages/taskDetail/taskDetail"]);
map.set("pages/trainDetail/trainDetail", ["ModuleShow", "pages/trainDetail/trainDetail"]);
map.set("pages/weeklyDetail/weeklyDetail", ["ModuleShow", "pages/weeklyDetail/weeklyDetail"]);
//关闭按钮
map.set("close", ["Close", " "]);
map.set("ForgetMe", ["ForgetMe", "pages/mine/mine"])
map.set("UserLogin", ["UserLogin", ""])
map.set("UserRegister", ["UserRegister", ""])
//click点击事件，id
map.set("PublishArticle", ["PublishArticle", "pages/release/release"]);

function onShowCollection() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route
  pointCollection(url, pages)
}
function clickCollection(event) {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var id = event.currentTarget.id
  pointCollection(id, pages)
}
function pointCollection(keyPoint, pages) {
  console.log("++++++++++pages", pages)
  if (pages.length === 0) {
    console.log("000000")
    params.CurrentUrl = 'pages/recommend/recommend';
    params.Latitude = 0;
    params.Longitude = 0;
    params.DeviceType = '';
    // params.LoginTime = timeUtil.formatutcTime(new Date().toISOString());
    params.ArticleId = '';
    var LoginTime = '';
    wx.setStorageSync("LoginTime", params.LoginTime)
  } else {
    console.log("789")
    var currentPage = pages[pages.length - 1]
    params.CurrentUrl = currentPage.route // 获取页面路径
    params.Latitude = getApp().globalData.Latitude;
    // params.Origin = getApp().globalData.Origin;
    params.Longitude = getApp().globalData.Longitude;
    params.DeviceType = getApp().globalData.DeviceType;
    // params.LoginTime = getApp().globalData.loginTime||'';
    // console.log("getApp().globalData.loginTime", typeof(getApp().globalData.loginTime))
    var LoginTime = isNaN(parseInt(getApp().globalData.loginTime)) ? "" : timeUtil.formatutcTime(getApp().globalData.loginTime);
    console.log("LoginTime", LoginTime)
    var data = currentPage.options;
    params.ArticleId = data.articleId || '';
  }
  var mapUrl = map.get(keyPoint);//获取有key值的对应的value
  if (mapUrl != undefined) {
    // params.CurrentUrl = url || '';
    params.ActionName = mapUrl[0] || '';
    params.ModuleName = mapUrl[1] || '';
    params.TimeStamp = timeUtil.formatutcTime(new Date().toISOString()) || '';
    params.UserId = parseInt(wx.getStorageSync('userId')) || 0;
    params.LoginTime = LoginTime || '';
    params.Origin = parseInt(wx.getStorageSync("scene")) || 999999;
    // params.Latitude = Latitude || '';
    // params.Longitude = Longitude || '';
    // params.DeviceType = DeviceType || '';
    params.ClientEnd = "WeChat";
    console.log("params++++", params)
    _track.log(params);
    params = {}
  }
}
let timer
var _track = {
  tasks: [], //任务队列，用于收集多个日志
  log(data) {
    _track.tasks.push(data)
    this.send()
  },
  send() {
    if (!timer) {
      timer = setInterval(function () { //定时器，控制日志延迟发送，不影响业务请求顺利发出
        console.log(" _track.tasks", _track.tasks)
        // 在这里发送 log 日志
        wx.request({
          // url:  `${api.apiURL}/point/pointCollection`,
          url: url + `/point/pointCollection`,
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: JSON.stringify(_track.tasks)
        })
        _track.tasks = []
        clearInterval(timer)
        timer = null
      }, 3000)
    }
  }
}
//onshow函数时调用
const hookonshow = function (event, methodName) {
  onShowCollection();
}
//click点击事件时调用
const hookMethod = function (event, methodName) {
  clickCollection(event);
}
const proxy = (obj, methodName, custom) => {
  if (obj[methodName]) {
    let method = obj[methodName]
    obj[methodName] = function (event) {
      custom.call(this, event, methodName)//call借用其他对象方法，methodNamea借用custom的方法
      method.call(this, event)
    }
  } else {
    obj[methodName] = function (event) {
      custom.call(this, event, methodName)
    }
  }
}
let _Page = Page
Page = function (obj) {
  proxy(obj, 'onShow', hookonshow)
  proxy(obj, 'submitTap', hookMethod)
  // proxy(obj, 'deleteme', hookMethod)
  _Page(obj)
}
module.exports = {
  pointCollection: pointCollection,
  onShowCollection: onShowCollection,
}
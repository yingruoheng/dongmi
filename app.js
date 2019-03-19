//app.js
var point = require('./utils/point.js')
App({
  onLaunch: function () {
    var that = this
    
    //获取设备的型号等信息
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.DeviceType = res.model;
      }
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.globalData.Latitude = res.latitude; // 纬度
        that.globalData.Longitude = res.longitude; // 经度
      }
    });

    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res.code);
            wx.removeStorageSync("code");
            wx.setStorageSync('code', res.code);
            // wx.getUserInfo({
            //   success: function (res) {
            //     var objz = {};
            //     objz.avatarUrl = res.userInfo.avatarUrl;
            //     objz.nickName = res.userInfo.nickName;
            //     console.log(objz)
            //     wx.setStorageSync('userInfo', objz);//存储userInfo
            //   }
            // });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  //登陆获取code测试代码段
  // wxLogin: function(){
  //   wx.login({
  //     success: function (res) {
  //       if (res.code) {
  //         wx.getUserInfo({
  //           success: function (res) {
  //             console.log(res)
  //             var objz = {};
  //             objz.avatarUrl = res.userInfo.avatarUrl;
  //             objz.nickName = res.userInfo.nickName;
  //             wx.setStorageSync('userInfo', objz);//存储userInfo
  //           }
  //         });
  //       } else {
  //         console.log('获取用户登录态失败！' + res.errMsg)
  //       }
  //     }
  //   });
  // },

  checkUserInfo: function(cb) {
    let that = this
    console.log(that.globalData.userInfo);
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo, true);
    }
    wx.getSetting({
      success: function (res) {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.globalData.userInfo = JSON.parse(res.rawData);
              typeof cb == "function" && cb(that.globalData.userInfo, true);
            }
          })
        }
        else {
          typeof cb == "function" && cb(that.globalData.userInfo, false);
        }
      }
    })
  },
  globalData: {
    //设备的高度
    deviceHeight:wx.getSystemInfoSync().windowHeight,
    userInfo: null,
    userId:null,
    code:'',
    train_data:[],
    activity_data:[],
    loginTime: '',
    Latitude: 0,
    Longitude: 0,
    DeviceType: ''
  },
  onShow: function (options) {
    console.log("来源于：-————————" + options.scene)
    wx.setStorageSync("scene", options.scene);
    // this.globalData.Origin = parseInt(options.scene);
    var that = this;
    if (wx.getStorageSync('userInfo') != "") {
      var pages = getCurrentPages();
      that.globalData.loginTime = new Date().toISOString();
      point.pointCollection('UserLogin', pages);
      console.log("that.globalData.loginTime", that.globalData.loginTime)
    } else {
    }

  },
  onHide: function (actionType, actionName) {
    console.log(wx.getStorageSync('userInfo'));
    if (wx.getStorageSync('userInfo') != '') {
      var pages = getCurrentPages()
      point.pointCollection('close', pages);
      this.globalData.loginTime = '';
    }
  },
})

// pages/authorization/authorization.js
const app = getApp();
const point = require("../../utils/point.js")
const api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: 1,
    backType: 'index', //index:返回首页 mine:返回用户中心 other 返回此id的文章明细
    createtime:'',
    scenario:'',
    articleId:'',

    htmlUrl:"",
    username:"",
    title:"",
    headimageurl:"",
    circle:"",
    mdUrl:"",
  },

  switchToIndex:function(e){
    wx.switchTab({
      url: '../recommend/recommend',
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.createtime){
      this.setData({
        backType: options.backType,
        createtime: options.createtime,
      })
    }else{
      this.setData({
        backType: options.backType
      })
    }
    if(options.scenario){
      this.setData({
        scenario: options.scenario,
        articleId: options.articleId,
        htmlUrl: options.htmlUrl,
        username: options.username,
        title: options.title,
        headimageurl: options.headimageurl,
        circle: options.circle,
        mdUrl: options.mdUrl,
      })
    }

    // // 查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       console.log('authorize');
    //       wx.getUserInfo({
    //         success: function (res) {
    //           app.globalData.userInfo = res.userInfo
    //           console.log(app.globalData.userInfo);
    //         }
    //       })
    //     }else{

    //     }
    //   }
    // })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  //判断忘记我埋点
  onShow: function () {
    // if (app.globalData.loginTime != "") {
    //   var pages = getCurrentPages()
    //   var currentPage = pages[pages.length - 1]
    //   point.pointCollection('ForgetMe', currentPage);
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindGetUserInfo: function(e) {
    let that = this;
    let backtype = this.data.backType;
    let createtime = this.data.createtime;
    //在控制台打印用户信息
    console.log(e);

    var code = wx.getStorageSync("code");
    var userInfo = e.detail.userInfo;
    app.globalData.loginTime = new Date().toISOString();
    app.globalData.userInfo = e.detail.userInfo;
    wx.setStorageSync("userInfo", e.detail.userInfo);

    var userInfo = e.detail.userInfo;
    //登陆获取code测试代码段
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res.code);
          var code = res.code;
          app.globalData.userInfo = e.detail.userInfo;
          app.globalData.code = code;
          wx.setStorageSync("userInfo", e.detail.userInfo);
          var jsonData = {
            code: code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }
          console.log(jsonData);
          wx.request({
            url: `${api.apiURL}/auth/savewxinfo`,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            method: 'POST',
            data: {
              param: JSON.stringify(jsonData)
            },
            success(res) {
              app.globalData.userId = res.data.retBean.userId;
              wx.setStorageSync("userId", res.data.retBean.userId);
              if (app.globalData.userInfo && app.globalData.userId) {
                var pages = getCurrentPages();
                point.pointCollection('UserRegister', pages);
                if (backtype == 'release') {
                  wx.switchTab({
                    url: '../release/release'
                  })
                } else if (backtype == 'mine') {
                  wx.switchTab({
                    url: '../mine/mine'
                  })
                } else if(that.data.scenario == "写周报"){
                  wx.redirectTo({
                    url: '../weeklyDetail/weeklyDetail?articleId=' + that.data.articleId,
                  })
                } else if (that.data.scenario == "开课啦"){
                  wx.redirectTo({
                    url: '../trainDetail/trainDetail?articleId=' + that.data.articleId,
                  })
                } else if (that.data.scenario == "留作业") {
                  wx.redirectTo({
                    url: '../taskDetail/taskDetail?articleId=' + that.data.articleId,
                  })
                } else if (that.data.scenario == "召集") {
                  wx.redirectTo({
                    url: '../activityDetail/activityDetail?articleId=' + that.data.articleId,
                  })
                } else if (that.data.scenario == "光影") {
                  wx.redirectTo({
                    url: '../picDetail/picDetail?articleId=' + that.data.articleId ,
                  })
                } else if (that.data.scenario == "品牌推广"){
                  wx.redirectTo({
                    url: '../webArtDetail/webArtDetail?htmlUrl=' + that.data.htmlUrl + '&username=' + that.data.username + '&createtime=' + that.data.createtime + '&title=' + that.data.title + '&headimageurl=' + that.data.headimageurl + '&articleId=' + that.data.articleId + '&circle=' + that.data.circle + '&scenario=' + that.data.scenario + '&mdUrl=' + that.data.mdUrl,
                  })
                } else{
                  wx.redirectTo({
                    url: '../recommend/recommend',
                  })
                }
              } else {
                // this.showZanTopTips('很遗憾，您拒绝了微信授权，宝宝很伤心');
                wx.switchTab({
                  url: '../index/index'
                })
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });




    // api.saveUserInfo({
    //   header: { "Content-Type": "application/x-www-form-urlencoded" },
    //   method: 'POST',
    //   data: {
    //     param: JSON.stringify(jsonData)
    //   },
    //   success(res) {
    //     console.log(res);
    //     app.globalData.userId = res.data.retBean.userId;
    //     wx.setStorageSync("userId", res.data.retBean.userId);
    //     if (app.globalData.userInfo && app.globalData.userId) {
    //       // app.globalData.userInfo = e.detail.userInfo;
    //       if (backtype == 'release') {
    //         wx.switchTab({
    //           url: '../release/release'
    //         })
    //       } else if (backtype == 'mine') {
    //         wx.switchTab({
    //           url: '../mine/mine'
    //         })
    //       } else {
    //         wx.redirectTo({
    //           url: '../interest/interest',
    //         })
    //       }
    //     } else {
    //       // this.showZanTopTips('很遗憾，您拒绝了微信授权，宝宝很伤心');
    //       wx.switchTab({
    //         url: '../index/index'
    //       })
    //     }
    //   }
    // })
    // wx.request({
    //   url: 'http://62.234.179.133:8080/yunji/auth/savewxinfo',
    //   // url: 'http://localhost:8080/auth/savewxinfo',
    //   header: { "Content-Type": "application/x-www-form-urlencoded" },
    //   method:'POST',
    //   data:{
    //     param: JSON.stringify(jsonData)
    //   },
    //   success(res){
    //     console.log(res);
    //     app.globalData.userId=res.data.retBean.userId;
    //     wx.setStorageSync("userId", res.data.retBean.userId);
    //     if (app.globalData.userInfo && app.globalData.userId) {
    //       // app.globalData.userInfo = e.detail.userInfo;
    //       if (backtype == 'release') {
    //         wx.switchTab({
    //           url: '../release/release'
    //         })
    //       } else if (backtype == 'mine') {
    //         wx.switchTab({
    //           url: '../mine/mine'
    //         })
    //       } else {
    //         wx.redirectTo({
    //           url: '../interest/interest',
    //         })
    //       }
    //     } else {
    //       // this.showZanTopTips('很遗憾，您拒绝了微信授权，宝宝很伤心');
    //       wx.switchTab({
    //         url: '../index/index'
    //       })
    //     }

    //   }
    // })


    // var usrtemp = JSON.parse(e.detail.rawData);
    // wx.login({
    //   success: function (res) {
    //     if (res.code) {
    //       console.log(res.code);
    //       var code = res.code;
    //       console.log(res);
    //       console.log("usrtemp" + usrtemp);
    //       usrtemp.code = code;
    //       console.log("usertemp:"+usertemp);
    //        that.saveUserInfo(usrtemp);
          // var usr = wx.getStorageSync('usr');
          // that.setData({
          //   usr:usr
          // })
    //     } else {
    //       console.log('获取用户登录态失败！' + res.errMsg)
    //     }
    //   }
    // });



  },


  // saveUserInfo: function (param) {
  //   console.log('aaa');
  //   let that = this;
  //   console.log(param);
  //   wx.request({
  //     url: "http://62.234.179.133:8080/auth/savewxinfo",
  //     method: "POST",
  //     data: {
  //       param: JSON.stringify(param)
  //     },
  //     header: {
  //       "Content-Type": "application/json"
  //     },
  //     success(res) {
  //       console.log(res);
  //       var usr = {};
  //       var usr = res.data.retBean;
  //       console.log(usr);
  //       wx.setStorageSync('usr', usr);
  //     },
  //   })

  // },


  //返回首页
  // navigateBack: function(e) {
  //   wx.switchTab({
  //     url: '../index/index'
  //   })
  // }
});

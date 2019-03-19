// pages/test/test.js
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    comment:'',
    value:'',
    status:'很好',
    name:"可可",
  },

  switch:function(e){
    var value = {
      status: this.data.status,
      name:this.data.name,
    }
    app.globalData.train_data = app.globalData.train_data.concat(value)
    wx.redirectTo({
      url: '../test1/test1?number=' + '1',
    })
  },

  bindInput:function(e){
    
    
  },



  // bindinput: function(e) {
  //   console.log(e.detail.value)
  //   this.setData({
  //     comment: e.detail.value,
  //   })
  // },

  bindconfirm:function(e){
    console.log("confirm:" + e.detail.value)
    this.setData({
      value:'',
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    console.log(app.globalData.train_data);
    var temp = app.globalData.train_data
    console.log("info:" + temp[0].name)
    app.globalData.train_data = []
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    console.log("onready")
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log("onshow")
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {
    // var pagelist = getCurrentPages();
    // console.log(pagelist);
    // var len = pagelist.length;
    // var init = 0;
    // var index = 0;
    // for (var i = 0; i < len; i++) {
    //   if (pagelist[i].route.indexOf("../recommend/recommend") >= 0) {//看路由里面是否有首页
    //     init = 1;
    //     index = i;
    //   }
    // }
    // if (init == 1) {
    //   wx.navigateBack({
    //     delta: len - i - 1
    //   });
    // } else {
    //   wx.reLaunch({
    //     url: "../recommend/recommend"//这个是默认的单页
    //   });
    // }
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {
    console.log('share')
    wx.updateShareMenu({
      withShareTicket: true,
    })
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
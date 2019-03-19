// pages/test1/test1.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  switch: function (e) {
    wx.redirectTo({
      url: '../test/test',
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if(options.number == 1){
      console.log("equal")
    }else{
      console.log("unequal")
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

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

  }
})
// pages/detail/detail.js
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    post: {},
    author: "",
    iconContact: "",
    iconClock: "",
    createtime:'',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    let userAndArticleId = options.userAndArticleId;
    let createtime = options.createtime;
    let username = options.username;
    that.setData({
      createtime: createtime,
      author: username,
    }),
    
    app.checkUserInfo(function (userInfo, isLogin) {
      if(isLogin){
        console.log(userInfo)
        that.getData(userAndArticleId);
      }
      if (!isLogin) {
        wx.redirectTo({
          url: '../authorization/authorization?backType=' + userAndArticleId + '&createtime=' + createtime,
        })
      }
    })

    // that.getData(userAndArticleId);

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
    wx.stopPullDownRefresh();
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
    
  },

  getData: function (userAndArticleId) {
    let that = this;
    api.getBlogById({
      query: {
        userAndArticleId: userAndArticleId
      },
      success: (res) => {
        const post = res.data;
        this.setData({
          post: post
        });
        WxParse.wxParse('article', 'html', post, that, 5);  
      },
    });
  }
})
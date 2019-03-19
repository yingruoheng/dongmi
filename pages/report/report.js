// pages/detail/detail.js
const WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const app = getApp();
var recentUrl = '';

Page({

  /**
   * Page initial data
   */
  data: {
    post: {},
    author: "可可",
    iconContact: "",
    iconClock: "",
    collected: false,
    createtime: '',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    let htmlurl = options.htmlurl;
    let createtime = options.createtime;
    let username = options.username;

    that.setData({
      createtime: createtime,
      author: username,
    });

    that.getData(htmlurl);

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

  },

  getData: function (htmlurl) {
    let that = this;
    wx.request({
      url: htmlurl,
      method:"GET",
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      success:function(res){
        const post = res.data;
        that.setData({
          post: post,
        });
        WxParse.wxParse('article', 'html', post, that, 5); 
      }
    });
    
  }
})
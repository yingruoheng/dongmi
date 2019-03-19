// pages/test/test.js
var util = require('../../utils/util.js');
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    time:'',
    date:'',
    isShowWork:true,
    isShowTrain:false,
    isShowActivity:false,
    isShowPic:false,
  },

  onClickLeft:function(e){
    console.log(e)
    wx.showToast({ title: '返回首页', icon: 'none' });
    wx.redirectTo({
      url: '../index/index',
    })
  },

  showWork:function(res){
    this.setData({
      isShowWork:true,
      isShowTrain: false,
      isShowActivity: false,
      isShowPic: false,
    })
  },

  showTrain: function (res) {
    this.setData({
      isShowWork: false,
      isShowTrain: true,
      isShowActivity: false,
      isShowPic: false,
    })
  },

  showActivity: function (res) {
    this.setData({
      isShowWork: false,
      isShowTrain: false,
      isShowActivity: true,
      isShowPic: false,
    })
  },
  showPic: function (res) {
    this.setData({
      isShowWork: false,
      isShowTrain: false,
      isShowActivity: false,
      isShowPic: true,
    })
  },

  switchToWeekly:function(res){
    wx.navigateTo({
      url: '../weekly/weekly',
    })
  },

  switchToTrain:function(res){
    wx.navigateTo({
      url: '../train/train',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  switchToTask: function (res) {
    wx.navigateTo({
      url: '../task/task',
    })
  },

  switchToActivity: function (res) {
    wx.navigateTo({
      url: '../activity/activity',
    })
  },

  switchToPic:function(res){
    wx.navigateTo({
      url: '../pic/pic',
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    
  },

  bindSelect: function (e) {
    console.log(e)//选择结果值
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
    let that = this;
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })
    var userId = wx.getStorageSync("userId");
    if (userId == undefined || userId == null || userId == "") {
      wx.redirectTo({
        url: '../authorization/authorization?backType=release',
      })
    }
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

  }
  
})


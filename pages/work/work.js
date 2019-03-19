const api = require("../../utils/api.js"); 
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:[],
    userId:"",
    time:1,
    pagenum: 1,
    pagesize: 6,
    tagList:[],
    deviceHeight: app.globalData.deviceHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var temp = getCurrentPages();
    console.log(temp)
  },

  // thisweek:function(){
  //   let that = this
  //   that.setData({
  //     time: 1,
  //   });
  //   that.getUserId();

  //   console.log(that.data.time)
  // },

  // lastweek: function () {
  //   let that = this
  //   that.setData({
  //     time: that.data.time + 1,
  //   });
  //   that.getUserId();

  //   console.log(that.data.time)
  // },

  bindItemTap: function (e) {
    let htmlurl = e.currentTarget.dataset.htmlurl;
    let createtime = e.currentTarget.dataset.createtime;
    let username = e.currentTarget.dataset.username;
    wx.navigateTo({
      url: '../report/report?htmlurl=' + htmlurl + '&createtime=' + createtime + '&username=' + username,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
    let that = this;
    console.log('------下拉刷新-------');
    wx.showNavigationBarLoading();
    that.setData({
      pagenum: 1,
      posts: []
    });
    that.getUserId();
    setTimeout(function () {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("----触底----")
    let that = this
    that.setData({
      pagenum: that.data.pagenum + 1,
    });
    that.getUserId();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  getData: function (userId) {
    let that = this

    api.getTagById({
      query: {
        userId:userId,
      },
      success: (res) => {
        const tag = res.data.retBean
        console.log(res)

        if (tag != null) {
          wx.request({
            url: 'http://62.234.181.50:8089/yunji/article/report',
            method: 'POST',
            data: {
              "userId": userId,
              // "time": String(that.data.time),
              "pagenum":String(that.data.pagenum),
              "pagesize":String(that.data.pagesize),
              "tagList": tag,
            },
            success: function (res) {
              const posts = res.data.retBean;
              console.log(posts)
              that.setData({
                posts: that.data.posts.concat(posts),
              });
            }
          })
        }
      },
    });
  },

  getUserId:function(){
    let that = this
    wx.request({
      url: 'http://62.234.181.50:8089/yunji/auth/wxLogin?code=12345',
      method: "GET",
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      success(res) {
        console.log(res.data.retBean.userId)
        let userId = res.data.retBean.userId
        that.getData(userId)
      }
    })
  }
})
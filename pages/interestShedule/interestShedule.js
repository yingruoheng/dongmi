const util = require("../../utils/util.js");
const api = require("../../utils/api.js");
const t = require("../../utils/timeUtil.js");
const app = getApp();

const pageUrl = "../interest/interest";

//add a test commit
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [
    ],
    now: "",
    userId:wx.getStorageSync("userId"),
    // userId:10000001,
    articleId: 0,
    pagesize: 5,
    deviceHeight: app.globalData.deviceHeight,
    // page: 'myarticles',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload')

    let that = this;
    that.setData({
      articleId: 0,
      posts: []
    });
    that.getFirstData();
    //登陆授权
    app.checkUserInfo(function (userInfo, isLogin) {
      console.log(userInfo)
      if (!isLogin) {
        wx.redirectTo({
          url: '../authorization/authorization?backType=release'
        })
      }
      else {
        that.setData({
          userInfo: userInfo,
        });
      }
    });

    // that.getFirstData();
  },

  bindItemTap: function (e) {
    let that = this;
    console.log(e.currentTarget)
    var htmlUrl = e.currentTarget.dataset.htmlurl;
    var username = e.currentTarget.dataset.username;
    var createtime = e.currentTarget.dataset.createtime;
    var title = e.currentTarget.dataset.title;
    var headimageurl = e.currentTarget.dataset.headimageurl;
    var articleId = e.currentTarget.dataset.articleid;
    var circle = e.currentTarget.dataset.circle;
    var scenario = e.currentTarget.dataset.scenario;
    var mdUrl = e.currentTarget.dataset.mdurl;

    //登陆授权
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })
    var userId = wx.getStorageSync("userId");
    if (userId == undefined || userId == null || userId == "") {
      // navigateTo redirectTo
      wx.navigateTo({
        url: '../authorization/authorization?htmlUrl=' + htmlUrl + '&username=' + username + '&createtime=' + createtime + '&title=' + title + '&headimageurl=' + headimageurl + '&articleId=' + articleId + '&circle=' + circle + '&scenario=' + scenario + '&mdUrl=' + mdUrl,
      })
    } else {
      switch (scenario) {
        case '召集':
          wx.navigateTo({
            url: '../activityDetail/activityDetail?articleId=' + articleId + '&pageUrl=' + pageUrl,
          });
          break;
        case '光影':
          wx.navigateTo({
            url: '../picDetail/picDetail?articleId=' + articleId + '&pageUrl=' + pageUrl,
          });
          break;
        case '留作业':
          wx.navigateTo({
            url: '../taskDetail/taskDetail?articleId=' + articleId + '&pageUrl=' + pageUrl,
          });
          break;
        case '开课啦':
          wx.navigateTo({
            url: '../trainDetail/trainDetail?articleId=' + articleId + '&pageUrl=' + pageUrl,
          });
          break;
        case '写周报':
          wx.navigateTo({
            url: '../weeklyDetail/weeklyDetail?articleId=' + articleId + '&pageUrl=' + pageUrl,
          });
          break;
        case '品牌推广':
          wx.navigateTo({
            url: '../webArtDetail/webArtDetail?htmlUrl=' + htmlUrl + '&username=' + username + '&createtime=' + createtime + '&title=' + title + '&headimageurl=' + headimageurl + '&articleId=' + articleId + '&circle=' + circle + '&scenario=' + scenario + '&mdUrl=' + mdUrl,
          });
          break;
        default: Toast('跳转失败');
      }
    }
  },
  /**
   * 下拉函数--监听页面下拉操作
   */
  lower: function (e) {
    let that = this
    that.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
    // let that = this;
    // that.setData({
    //   articleId: 0,
    //   posts: []
    // })
    // that.getFirstData();

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
    console.log('------下拉刷新-------');
    let that = this;
    wx.showNavigationBarLoading();
    that.setData({
      articleId: 0,
      posts: []
    });
    that.setData({
      articleId: 0,
      posts: []
    });
    that.getFirstData();
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
    that.getData()
    that.setData({
      articleId: that.data.articleId,
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  computed: function () {

  },

  /**
   * 第一次获取文章列表
   */
  getFirstData: function () {
    let that = this;
    api.getFirstScheduleArticleList({
      query: {
        userId: wx.getStorageSync("userId"),
        pagesize: that.data.pagesize,
      },
      success: (res) => {
        if (res.data.retBean.length == 0)
          return;
        const posts = res.data.retBean;
        console.log(posts);
        this.setData({
          posts: this.data.posts.concat(posts),
          articleId: res.data.retBean[res.data.retBean.length - 1].articleId,
          now: new Date().getTime()
        });
      },
    });
  },

  getData: function () {
    let that = this;
    api.getScheduleArticleList({
      query: {
        userId: wx.getStorageSync("userId"),
        articleId: that.data.articleId,
        pagesize: that.data.pagesize,
      },
      success: (res) => {
        if (res.data.retBean.length == 0)
          return;
        const posts = res.data.retBean;
        console.log(posts)
        this.setData({
          posts: this.data.posts.concat(posts),
          articleId: res.data.retBean[res.data.retBean.length - 1].articleId,
          now: new Date().getTime()
        });
      },
    });
  },
})

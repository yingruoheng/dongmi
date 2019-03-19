// pages/myarticles/myarticles.js

const app = getApp();
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");
const size = 8 ;
import Toast from '../../dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //如果想在页面内获取到js里面的值，必须把元素的值写到data里面。
    articleList:[],
    //注意：可能是bug,hidden元素的值只有null才显示元素，true或者false都不能显示
    hidden:null,
    userId:'',
    message:'',
    userInfo: {},
    page:'myarticles',
    isShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      isShow:true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    that.getMyArticleList();
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
  // onPullDownRefresh: function () {

  // },
  onPullDownRefresh: function () {
    console.log('------下拉刷新-------');
    let that = this;
    wx.showNavigationBarLoading();
    that.onLoad();
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
    console.log("ccc");
    let that = this;
    that.viewmore();

  },

  getMyArticleList: function () {
    let that = this;
    api.getMyArticleList({
      data: {
        userId: wx.getStorageSync("userId"),
        size: size
      },
      success(res) {
        console.log(res);
        var articleList = res.data.retBean.articleList;
        console.log(articleList);
        that.setData({
          articleList: articleList
        });
        if(articleList = []){
          that.setData({
            message:"您还没发表过文章，快去发表文章吧"
          })
        }
      },
      fail() {
        Console.log('获取用户信息失败')
        Toast('删除失败~');
      }
    })
  },

  deleteArticle:function(event){
    let that = this;
    console.log(event.currentTarget.dataset.id)
    var userId = event.currentTarget.dataset.userid;
    var articleId = event.currentTarget.dataset.articleid; 
    var id = event.currentTarget.dataset.id;
    console.log(id);
    // that.delete(articleId,userId);
    api.deleteArticleById({
      data: {
        articleId: articleId,
        userId: userId
      },
      success(res) {
        console.log("删除文章成功");
        var ItemList = that.data.articleList;
        console.log(ItemList);
        ItemList= util.deleteItemOnPage({
          data:{
            ItemList:ItemList,
            id:id
          },
        })
        console.log(ItemList);
        that.setData({
          articleList: ItemList
        })
      }

    })  
    // that.setData({
    //   articleList:[]
    // });
    // that.onLoad();
    // var articles = that.data.articleList;
   
    // var array = [];
    // for (let i in articles) {
    //   //push到空数组里
    //   array.push(articles[i]);
    // }
    // //传输数据到页面
    // // this.setData({
    // //   itemData: items
    // // })
    // console.log(typeof(array))
    // console.log(array);
    // array.splice(event.currentTarget.dataset.id,1);
    // that.setData({
    //   articleList: array
    // });
    
  },

  delete:function(articleId,userId){
    api.deleteArticleById({
      data: {
        articleId:articleId,
        userId:userId
      },
      success(res){
        console.log("删除文章成功")
      }
    })  
  },

  deleteItemOnPage:function(){
    
  },

  viewmore:function(){
    let that = this;
    var articles = that.data.articleList;
    api.getMyArticleList({
      data: {
        userId: wx.getStorageSync("userId"),
        size: size,
        articleId: articles[articles.length - 1].articleId
      },
      success(res) {
        console.log(res);
        var articleList = res.data.retBean.articleList;
        if (articleList.length < size) {
          var hidden = true;
          that.setData({
            hidden: hidden
          });
        }
        console.log(articleList);
        that.setData({
          articleList: that.data.articleList.concat(articleList)
        });
      },
      fail() {
        Console.log('获取文章信息失败');
        var hidden = null;
      }
    })
  },

  detail:function(option){
    let that = this;
    console.log(option)
    var htmlUrl = option.currentTarget.dataset.htmlurl;
    var username = option.currentTarget.dataset.username;
    var createtime = option.currentTarget.dataset.createtime;
    var articleId = option.currentTarget.dataset.articleid
    console.log(htmlUrl);
    if (!(htmlUrl == null || htmlUrl == "")) {
      wx.navigateTo({
        url: '../webArtDetail/webArtDetail?htmlUrl=' + htmlUrl + '&username=' + username + '&createtime=' + createtime,
      });
    } else {
      switch (option.currentTarget.dataset.scenario) {
        case '召集':
          wx.navigateTo({
            url: '../activityDetail/activityDetail?articleId=' + option.currentTarget.dataset.articleid+'&page='+that.data.page,
          });
          break;
        case '光影':
          wx.navigateTo({
            url: '../picDetail/picDetail?articleId=' + option.currentTarget.dataset.articleid+'&page='+that.data.page,
            
          });
          break;
        case '留作业':
          wx.navigateTo({
            url: '../taskDetail/taskDetail?articleId=' + option.currentTarget.dataset.articleid + '&page=' + that.data.page,
          });
          break;
        case '开课啦':
          wx.navigateTo({
            url: '../trainDetail/trainDetail?articleId=' + option.currentTarget.dataset.articleid + '&page=' + that.data.page,
          });
          break;
        case '写周报':
          wx.navigateTo({
            url: '../weeklyDetail/weeklyDetail?articleId=' + option.currentTarget.dataset.articleid + '&page=' + that.data.page,
          });
          break;
        default: Toast('跳转失败');
      }
    }   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  
  
})
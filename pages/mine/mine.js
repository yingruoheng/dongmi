const api = require("../../utils/api.js");
const util = require("../../utils/util.js");

import Dialog from '../../dist/dialog/dialog';
import Toast from '../../dist/toast/toast';
import point from '../../utils/point.js'
const app = getApp();
Page({
  data: {
    userInfo: {},
    userId: null,
    articleNum: '',
    focusNum: '',
    focusmeNum: '',
    hidden:null,
    errormsg:''
  },
  //获取userId
  //获取用户文章数
  getUserArticleNum: function(){
    let that = this;
    // console.log(app.globalData.userId)
    api.getUserArticleNum({
      data: {
        userId: wx.getStorageSync("userId")
      },
      success(res) {
        if (res.data.retMsg == null) {
          that.setData({
            articleNum: res.data.retBean.amount
          })
        } else {
          that.setData({
            hidden: true,
            errormsg: res.data.retMsg
          })
        }
      },
      fail() {
        
      }
    })
    // wx.request({
    //   url: url+arturl,
    //   method:'GET',
    //   data:{
    //     // userId: app.globalData.userId
    //     userId:wx.getStorageSync("userId")
    //     // userId:10000001
    //   },
    //   success(res){
    //     // console.log(res.data);
    //     if(res.data.retMsg == null){
    //       that.setData({
    //         articleNum:res.data.retBean.amount
    //       })
    //     }else{
    //       that.setData({
    //         hidden:true,
    //         errormsg:res.data.retMsg
    //       })
    //     }
    //   },
    //   fail() {
    //     // Console.log('获取文章信息失败')
    //   }
    // })
  },

  // 跳转到某个页面
  navigatorToMine: function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `../${url}/${url}`,
    })
  },
  contactOurs: function(e){
    console.log(e)
    this.clickButton()
  },
  clickButton: function(e){
    console.log('aa',e)
  },

  getUserFocusNum: function () {
    let that = this;
    api.getUserFocusNum({
      data: {
        userId: wx.getStorageSync("userId")

      },
      success(res) {
        if (res.data.retMsg == null) {
          that.setData({
            focusNum: res.data.retBean.amount
          })
        } else {
          that.setData({
            hidden: true,
            errormsg: res.data.retMsg
          })
        }
      },
      fail() {
        
      }
    })
  },
  getMineData: function () {
    let that = this;
    api.getMineData({
      data: {
        userId: wx.getStorageSync("userId")
      },
      success(res) {
        if (res.data.retMsg == null) {
          that.setData({
            articleNum: res.data.retBean.articles,
            focusNum: res.data.retBean.myFocus,
            focusmeNum: res.data.retBean.focusMe
          })
        } else {
          that.setData({
            hidden: true,
            errormsg: res.data.retMsg
          })
        }
      },
      fail() {

      }
    })

  },


  getfocususerNum: function () {
    let that = this;
    api.getfocususerNum({
      data: {
        userId: wx.getStorageSync("userId")
      },
      success(res) {
        if (res.data.retMsg == null) {
          that.setData({
            focusmeNum: res.data.retBean.amount

          })
        } else {
          that.setData({
            hidden: true,
            errormsg: res.data.retMsg
          })
        }
      },
      fail() {
        
      }
    })
  },



  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  showRecent: function () {
    wx.navigateTo({
      url: ''
    })
  },
  showCollected: function () {
    wx.navigateTo({
      url: ''
    })
  },
  showAboutMe: function () {
    
    wx.navigateTo({
      url: '../about/about_me'
    })
  },
  contactMe: function () {
    wx.navigateTo({
      url: '../about/contact_me'
    })
  },

  onLoad: function () {
    let that = this;
   
    
    // 登陆测试
    //  app.wxLogin();
  },
  deleteme:function(){
    // wx.navigateBack({
    //   delta: 1
    // })
    let that = this;
     console.log('aaa');
    Dialog.confirm({
      message: '您的所有痕迹将被删除，包括您曾经发表过的作品，您关注的圈子，关注您的作者也将不能再查看您的消息'
    }).then(() => {
       console.log('bbb');
      var pages = getCurrentPages()
      point.pointCollection('ForgetMe', pages);
      app.globalData.loginTime = ''
      api.deleteme({
        data: {
          userId: wx.getStorageSync("userId")
        },
        success(res) {
          console.log(res.data);
          wx.clearStorageSync();
          app.globalData.userInfo = null;
          console.log(app.globalData.userInfo)
          if (res.data.retMsg == null) {
            wx.switchTab({
              url: '../recommend/recommend',
            })

          } else {
            Toast('删除失败~');
          }
        },
        fail() {
          // Console.log('删除用户失败')
        }
      })
      // wx.request({
      //   url:url+delurl,
      //   method: 'GET',
      //   data: {
      //     userId: wx.getStorageSync("userId")
      //   },
      //   success(res) {
      //     console.log(res.data);
      //     if (res.data.retMsg == null) {
      //       wx.navigateTo({
      //         url: '../authorization/authorization',
      //       })

           
      //     } else {
      //       Toast('删除失败~');
      //     }
      //   },
      //   fail() {
      //     // Console.log('删除用户失败')
      //   }
      // })
    }).catch(() => {
      
    });

  },

  exit:function(){


  },
  
  // delete:function(){
  //   console.log(ccc);
  //   let that = this;
  //   wx.request({
  //     url:"localhost:8080/yunji/account/deleteUser",
  //     method:'GET',
  //     data:{
  //       userId: '10000002'
  //     },
  //     success(res) {
  //       console.log(res.data);
  //       if (res.data.retMsg == null) {
  //         wx.navigateBack({
  //           delta: 0
  //         })
  //       }else{
  //         Toast('删除失败~');
  //       }
  //     },
  //     fail() {
  //       Console.log('删除用户失败')
  //     }
  //   })
    


  // },

  // cic:function(){
  //   var pages = getCurrentPages();
  //   console.log(pages);
  //   console.log("jinliale");
  //   // wx.navigateTo({
  //   //   url: '../focus/focus',
  //   // });
  //   wx.navigateTo({
  //     url: '../myarticles/myarticles'
  //   })
  //   wx.navigateBack({
  //     delta:-1

  //   })
   

  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })
    let that = this;
    var userId = wx.getStorageSync("userId");
    if(userId == undefined || userId == null || userId == ""){
      wx.redirectTo({
        url: '../authorization/authorization?backType=mine',
      })
    }
    that.getMineData();
    // that.getUserArticleNum();
    // that.getUserFocusNum();
    // that.getfocususerNum();
  },

  onUnload: function () {

  },

  onHide: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('------下拉刷新-------');
    let that = this;
    wx.showNavigationBarLoading();
    that.onShow();
    // that.getUserArticleNum();
    // that.getUserFocusNum();
    // that.getfocususerNum();
    setTimeout(function () {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    }, 1500)
    
  },
})

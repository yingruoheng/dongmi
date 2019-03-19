// 谁关注我
// pages/focus/focus.js
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");
const currentTimeToUTC = require("../../utils/currentTimeToUTC.js");
// const timeToUTC = currentTimeToUTC.timeToUTC;
const app = getApp();
// const testurl = "http://localhost:8080/yunji";
// const url = "http://62.234.179.133:8080/yunji";
const intUrl = "/account/focusMeList";
const delUrl = "/account/deleteInterest";
const size = 8;
import Toast from '../../dist/toast/toast';

var p = Page({
  /**
   * 页面的初始数据
   */
  data: {
    //如果想在页面内获取到js里面的值，必须把元素的值写到data里面。
    focusMeList: [],
    createTime: '',
    message:'',
    userInfo:{}

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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    that.getFocusMeList();

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
  //   let that = this;
  //   that.viewmore();

  // },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
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
    let that = this;
    that.viewmore();
  },
  getFocusMeList: function () {
    let that = this;
    console.log(api.apiURL)
    wx.request({
      url: api.apiURL + intUrl,
      method: 'GET',
      data: {
        userId: wx.getStorageSync("userId"),
        size: size
      },
      success(res) {
        console.log(res);
        var focusMeList = res.data.retBean.focusMeList;
        console.log(focusMeList[focusMeList.length - 1].createTime)        
        that.setData({
          focusMeList: focusMeList,
          createTime: focusMeList.length && currentTimeToUTC.timeToUTC(focusMeList[focusMeList.length - 1].createTime)
        });
        // if (focusMeList = []){
        //   that.setData({
        //     message:"还没有人关注您呢，发文章就会有更多关注噢"
        //   })

        // }
      },
      fail() {
        Console.log('获取关注列表失败')
      }
    })
  },

  deleteInterest: function (event) {
    console.log(event)
    var that = this;
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    var eid = event.currentTarget.dataset.eid;
    wx.request({
      url: api.apiURL + delUrl,
      method: 'GET',
      data: {
        id: eid
      },
      success(res) {
        console.log(res.data);
        var ItemList = that.data.focusMeList;
        console.log(ItemList);
        ItemList = util.deleteItemOnPage({
          data: {
            ItemList: ItemList,
            id: id
          },
        })
        console.log(ItemList);
        that.setData({
          focusMeList: ItemList
        }) 
      },
      fail() {
        console.log('删除用户信息失败');
        Toast('删除失败~');
      }
    })
  },
  // delete: function (id) {
  //   wx.request({
  //     url: api.apiURL + delUrl,
  //     method: 'GET',
  //     data: {
  //       id: id
  //     },
  //     success(res) {
  //       console.log(res.data);
  //     },
  //     fail() {
  //       console.log('删除用户信息失败')
  //     }
  //   })

  // },

  viewmore: function () {
    console.log("ddd")
    let that = this;
    // var focusMeLists = that.data.focusMeList;
    wx.request({
      url: api.apiURL + intUrl,
      method: 'GET',
      data: {
        userId: wx.getStorageSync("userId"),
        size: size,
        createTime: that.data.createTime
      },
      success(res) {
        console.log(res);
        var focusMeList = res.data.retBean.focusMeList;
        that.setData({
          focusMeList: that.data.focusMeList.concat(focusMeList),
          createTime: focusMeList.length && currentTimeToUTC.timeToUTC(focusMeList[focusMeList.length - 1].createTime)
        });
      },
      fail() {
        Console.log('获取关注信息失败')
      }
    })



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})
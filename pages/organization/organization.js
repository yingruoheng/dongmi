import Toast from '../../dist/toast/toast';
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");
const circleTran = require("../../utils/circleTran.js");
const currentTimeToUTC = require("../../utils/currentTimeToUTC.js");
const app = getApp();
// const testurl = "http://localhost:8080/yunji";
// const url = "http://62.234.179.133:8080/yunji";
const intUrl = "/account/organizationList";
const delUrl = "/account/deleteOrganization";
const circleUrl = "/article/circle";
const savaOrgUrl = "/account/saveOrganization"
const size = 10;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //如果想在页面内获取到js里面的值，必须把元素的值写到data里面。
    organizationList: [],
    createtime: '',
    message:'',
    userInfo:{},
    addOrganization: true,
    array: [],
    arrayObject: [],
    index: -1,
    organization: '',
    circle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    that.getOrganizationList();
  },
  
  getCircle: function(){
    var that = this
    wx.request({
      url: api.apiURL + circleUrl,
      method: 'GET',
      success(res) {
        console.log(res);
        var arrayObject = res.data.retBean;
        var array = []
        for(var i in arrayObject){
          array.push(arrayObject[i].circle)
        }
        console.log(array)
        that.setData({
          arrayObject: arrayObject,
          array: array
        })
      },
      fail() {

      }
    })
  },
  bindModalInput: function (e) {
    this.setData({
      organization: e.detail.value,
    })
  },
  saveOrganization: function(){
    var that = this
    var dataPost = {
      organization: that.data.organization,
      circle: that.data.circle,
      userId: wx.getStorageSync("userId"),
    }
    var circleEng = circleTran.chaToEnAboutCircle(that.data.circle)
    var dataPostEng = {
      organization: that.data.organization,
      circle: circleEng,
      userId: wx.getStorageSync("userId"),
    }
    api.saveOrganization({
      method: 'POST',
      data: dataPostEng,
      success(res) {
        var array = res.data.retBean;
        that.data.organizationList.unshift(dataPost)
        that.setData({
          array: array,
          // 清空数据
          addOrganization: true,
          organization: '',
          index: -1,
          organizationList: that.data.organizationList
        })
      },
      fail() {

      }
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
    })
    var index = this.data.index
    var circle = this.data.array[index]
    this.setData({
      circle: circle
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
   * 下拉函数--监听页面下拉操作
   */
  lower: function (e) {
    let that = this
    that.getData()
  },
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
    console.log('上拉')
    let that = this;
    that.viewmore();
  },
  getOrganizationList: function () {
    let that = this;
    wx.request({
      url: api.apiURL + intUrl,
      method: 'GET',
      data: {
        userId: wx.getStorageSync("userId"),
        size: size
      },
      success(res) {
        console.log(res);
        var organizationList = res.data.retBean;
        that.setData({
          organizationList: organizationList,
          // createtime: organizationList.length && currentTimeToUTC.timeToUTC(organizationList[organizationList.length - 1].createtime)
        });
      },
      fail() {
        Console.log('获取关注列表失败')
      }
    })
  },
  addOrganization: function (e){
    this.getCircle();
    this.setData({
      addOrganization: false
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      addOrganization: true
    });
  },
  //确认
  confirm: function () {
    this.saveOrganization()
    this.setData({
      addOrganization: true,
    })
  },

  deleteOrganization: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    // var eid = event.currentTarget.dataset.eid;
    var deleteId = that.data.organizationList[id]
    deleteId.circle = circleTran.chaToEnAboutCircle(deleteId.circle)
    that.data.organizationList.splice(id, 1)
    api.deleteOrganization({
      url: api.apiURL + delUrl,
      method: 'POST',
      data: deleteId,
      success(res) {
        if(res.data.retBean.result == "删除成功"){
          that.setData({
            organizationList: that.data.organizationList
          })
        }
      },
      fail() {
        Toast('删除失败~');
      }
    })
  },
  viewmore: function () {
    console.log('------上拉------')
    let that = this;
    wx.request({
      url: api.apiURL + intUrl,
      method: 'GET',
      data: {
        userId: wx.getStorageSync("userId"),
        size: size,
        createtime: that.data.createtime
      },
      success(res) {
        console.log(res);
        var organizationList = res.data.retBean;
        that.setData({
          organizationList: that.data.organizationList.concat(organizationList),
          createtime: organizationList.length && currentTimeToUTC.timeToUTC(organizationList[organizationList.length - 1].createtime)
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
// pages/weekly/weekly.js
import Toast from '../../dist/toast/toast';

var util = require('../../utils/util.js');
const api = require("../../utils/api.js");
const app = getApp();

Page({
  /**
   * Page initial data
   */
  data: {
    createtime:'',
    userId:wx.getStorageSync("userId"),
    username: '',
    articleId:'',
    contents: [],
    length: 0,
    thisWeekComplete: '',
    thisWeekEffect: '',
    nextWeekPlan: '',
    title:'',
    weekStartDay:'',
    weekEndDay:'',
    circle:"work",
    scenario:'weekly',
    organizationArray: [ "自定义"],
    organization:"",
    isShowOrganization:false,
    visibility: 0,
    hiddenModalInput: true,
    shareVisibility:0,
    page:'return to me',
    organizationSelectedColor: '#000000',
    locationStyle: 'location'
  },

  SwitchAChange: function (e) {
    this.setData({ visibility: Number(e.detail) });
  },

  SwitchBChange: function (e) {
    this.setData({ shareVisibility: Number(e.detail) });
  },

  bindPickerChange: function (e) {
    if ('自定义' == this.data.organizationArray[e.detail.value]){
      this.setData({
        hiddenModalInput: false,
      })
    }else{
      this.setData({
        index: e.detail.value,
        organization: this.data.organizationArray[e.detail.value],
      })
    }
  },

  bindModalInput:function(e){
    console.log(e);
    this.setData({
      organization: e.detail.value,
    })
  },

  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenModalInput: true
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenModalInput: true,
      isShowOrganization:true,
    })
  },

  onChangeOrganization:function(res){ 
    if (util.isEmojiCharacter(res.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        organization: '',
      })
    }else{
      this.setData({
        organization: res.detail
      })
    }
  },

  onChangeTitle:function(res){
    if (util.isEmojiCharacter(res.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        title: '',
      })
    } else {
      this.setData({
        title: res.detail
      })
    }
  },

  onChangeThisWeekComplete: function (res) {
    console.log(res.detail.value)
    if (util.isEmojiCharacter(res.detail.value)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        thisWeekComplete: '',
      })
    } else {
      this.setData({
        thisWeekComplete: res.detail.value
      })
    }
  },

  onChangeThisWeekEffect: function (res) {
    console.log(res.detail.value)
    if (util.isEmojiCharacter(res.detail.value)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        thisWeekEffect: '',
      })
    } else {
      this.setData({
        thisWeekEffect: res.detail.value
      })
    }
  },

  onChangeNextWeekPlan: function (res) {
    console.log(res.detail.value)
    if (util.isEmojiCharacter(res.detail.value)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        nextWeekPlan: '',
      })
    } else {
      this.setData({
        nextWeekPlan: res.detail.value
      })
    }
  },

  insert: function (res) {
    let that = this;
    if (util.isEmojiCharacter(that.data.thisWeekComplete) || util.isEmojiCharacter(that.data.thisWeekEffect) || util.isEmojiCharacter(that.data.nextWeekPlan)){
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情")
    }else{
      let value = {
        id: that.data.length,
        thisWeekComplete: that.data.thisWeekComplete,
        thisWeekEffect: that.data.thisWeekEffect,
        nextWeekPlan: that.data.nextWeekPlan,
      }
      this.setData({
        contents: that.data.contents.concat(value),
        length: that.data.length + 1,
        thisWeekComplete: '',
        thisWeekEffect: '',
        nextWeekPlan: '',
      })
      console.log(this.data.contents);
      console.log(that.data.thisWeekComplete)
    }
    
  },

  delete: function (res) {
    let that = this;
    let id = res.currentTarget.dataset.id;
    console.log(res)
    if (id == this.data.length) {
      this.data.contents.pop(id)
    } else {
      this.data.contents.splice(id, 1)
    }
    this.setData({
      contents: that.data.contents,
      length: that.data.length - 1
    })
    console.log(this.data.contents)
  },

  submitTap:function(res){
    console.log(res);
    let that = this;

    //添加最后一次写的周报事项
    if (util.isEmojiCharacter(that.data.thisWeekComplete) || util.isEmojiCharacter(that.data.thisWeekEffect) || util.isEmojiCharacter(that.data.nextWeekPlan)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情")
    } else if (that.data.thisWeekComplete != "" || that.data.thisWeekEffect != "" || that.data.nextWeekPlan != ""){
      var value = {
        id: that.data.length,
        thisWeekComplete: that.data.thisWeekComplete,
        thisWeekEffect: that.data.thisWeekEffect,
        nextWeekPlan: that.data.nextWeekPlan,
      }
      this.setData({
        contents: that.data.contents.concat(value),
      })
    }
    
    console.log(this.data.contents);
    var time = util.formatTime(new Date());
    if(this.data.title == ""){
      this.setData({
        title:"周报[" + that.data.weekStartDay + "-" + that.data.weekEndDay + "]",
      })
    }
    if (util.isEmojiCharacter(this.data.title)){
      Toast("标题不得包含特殊字符和emoji表情")
    }else{
      if (this.data.contents.length == 0) {
        Toast('请填写周报~');
      } else {
        api.postContents({
          method: 'POST',
          data: {
            userId: wx.getStorageSync("userId"),
            createtime: time,
            title: this.data.title,
            weekStartDay: this.data.weekStartDay,
            weekEndDay: this.data.weekEndDay,
            contents: this.data.contents,
            organization: this.data.organization,
            circle: this.data.circle,
            scenario: this.data.scenario,
            visibility: this.data.visibility,
            username: this.data.username,
            shareVisibility: this.data.shareVisibility,
          },
          success(res) {
            console.log(res);
            let articleId = res.data.retBean;
            that.setData({
              articleId: articleId,
            });
            console.log(that.data.articleId);
            wx.redirectTo({
              url: '../weeklyDetail/weeklyDetail?articleId=' + articleId + '&page=' + that.data.page,
            })
          },
        });
      } 
    }
    
    if(that.data.organization != ""){
      api.postOrganization({
        method:"POST",
        data:{
          circle: that.data.circle,
          userId: wx.getStorageSync("userId"),
          organization:this.data.organization,
        },
        success(res){
          console.log(res)
        }
      })
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    var time = util.formatTime(new Date());
    this.setData({
      createtime: time,
      weekStartDay: util.getWeekStartDay(),
      weekEndDay: util.getWeekEndDay(),
      username: wx.getStorageSync("userInfo").nickName,
    })

    api.getOrganizationByUserId({
      data:{
        circle: that.data.circle,
        userId:wx.getStorageSync("userId"),
      },
      success(res){
        var organizationArr = [];
        for (var i in res.data.retBean){
          organizationArr.push(res.data.retBean[i].organization)
        }
        that.setData({
          organization: organizationArr[0],
          organizationArray: organizationArr.concat(that.data.organizationArray)
        })
        if (that.data.organizationArray.length == 1) {
          that.setData({
            isShowOrganization: true,
          })
        }
      }
    })
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
   * 页面相关事件处理函数--监听用户下拉动作
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
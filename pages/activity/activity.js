var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();

import Toast from '../../dist/toast/toast';

var util = require('../../utils/util.js');
const api = require("../../utils/api.js");
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    createtime:'',//文章创建时间
    startDate: "请选择日期",//格式化前的活动开始时间
    starttime:'',//格式化后的活动开始时间
    overDate:"",
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],

    introduction:'',
    location:'',
    activityName:'',
    info: '',
    circle: "play",
    scenario: 'activity',
    selectAddress: '请选择活动地点',

    userId: wx.getStorageSync('userId'),
    latitude: '',
    longitude: '',
    durationArray: ['45分钟', '1个小时', '90分钟', '2个小时', '4个小时', '全天'],
    duration: '请选择时长：',
    username:'',
    organizationArray: ['自定义'],
    organization: "",
    isShowOrganization: false,
    visibility: 1,
    hiddenModalInput: true,
    shareVisibility:0,
    contents: [],
    content:'',
    length: 0,
    placeholderStyleTitle: 'color:	#989898; font-size: 45rpx;',
    page:'return to me',
    durationSelectedColor: '',
    dateSelectedColor: '',
    focus: false,
    organizationSelectedColor: '#000000',
    locationStyle: 'location'
  },

  //跳转到map页面，保存已填写数据
  bindLocationTap: function (res) {
    let that = this;
    //添加最后一次写的活动事项
    if (util.isEmojiCharacter(this.data.info)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情")
    } else if (this.data.info != "") {
      console.log(this.data.info)
      var value = {
        id: this.data.length,
        content: this.data.info,
      };
      this.setData({
        contents: that.data.contents.concat(value),
      })
    }
    this.setData({
      locationStyle: 'localtionSelected',
    })
    console.log(that.data.contents)
    var value = {
      activityName: this.data.activityName,
      location: this.data.location,
      startDate: this.data.startDate,
      starttime: this.data.starttime,
      overDate: this.data.overDate,
      organization: this.data.organization,
      introduction: this.data.introduction,
      visibility: this.data.visibility,
      duration:this.data.duration,
      contents:this.data.contents,
      shareVisibility:this.data.shareVisibility,
      dateSelectedColor: this.data.dateSelectedColor,
      durationSelectedColor: this.data.durationSelectedColor,
      locationStyle: this.data.locationStyle,
    }
    app.globalData.activity_data = app.globalData.activity_data.concat(value);
    
    wx.redirectTo({
      url: '../map/map?scenario=' + this.data.scenario,
    })
  },

  bindChooseDuration: function (e) {
    console.log(this.data.durationArray[e.detail.value])
    var duration = this.data.durationArray[e.detail.value]
    var textSelected = true
    this.setData({
      duration:  duration,
      durationSelectedColor: '#000000'
    })
  },

  SwitchAChange: function (e) {
    if (this.data.visibility == 0) {
      this.setData({ visibility: Number(e.detail) });
    } else {
      this.setData({ visibility: Number(e.detail) });
    }
  },

  SwitchBChange: function (e) {
    this.setData({ shareVisibility: Number(e.detail) });
  },

  bindPickerChange: function (e) {
    if ('自定义' == this.data.organizationArray[e.detail.value]) {
      this.setData({
        hiddenModalInput: false,
        focus: true
      })
    } else {
      this.setData({
        index: e.detail.value,
        organization: this.data.organizationArray[e.detail.value],
      })
    }
  },

  bindModalInput: function (e) {
    console.log(e);
    this.setData({
      organization: e.detail.value,
    })
  },

  //取消按钮
  cancel: function () {
    this.setData({
      focus: false,
      hiddenModalInput: true
    });
  },
  //确认
  confirm: function () {
    this.setData({
      focus: false,
      hiddenModalInput: true,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var activity_data = app.globalData.activity_data;
    console.log(activity_data);

    if (activity_data.length > 0) {
      var data = activity_data[0];
      this.setData({
        activityName: data.activityName,
        location: data.location,
        startDate: data.startDate,
        starttime: data.starttime,
        overDate:data.overDate,
        organization: data.organization,
        introduction: data.introduction,
        visibility: data.visibility,
        duration:data.duration,
        contents:data.contents,
        shareVisibility:data.shareVisibility,
        length: data.contents.length,
        dateSelectedColor: data.dateSelectedColor,
        durationSelectedColor: data.durationSelectedColor,
        locationStyle: data.locationStyle
      })
      if (data.organization != ""){
        this.setData({
          isShowOrganization:true,
        })
      }
    }
    //然后将globalData清空
    app.globalData.activity_data = [];

    if (options.selectAddress != undefined) {
      this.setData({
        selectAddress: options.selectAddress,
        latitude: options.latitude,
        longitude: options.longitude,
      })
    }

    if (util.isEmojiCharacter(that.data.activityName) || util.isEmojiCharacter(that.data.introduction) || util.isEmojiCharacter(that.data.location)){
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情")
    }else{
      this.setData({
        username: wx.getStorageSync("userInfo").nickName,
      })
      api.getOrganizationByUserId({
        data: {
          circle: that.data.circle,
          userId: wx.getStorageSync("userId"),
        },
        success(res) {
          var organizationArr = [];
          for (var i in res.data.retBean) {
            organizationArr.push(res.data.retBean[i].organization)
          }
          that.setData({
            organization: organizationArr[0],
            organizationArray: organizationArr.concat(that.data.organizationArray)
          })
          // that.setData({
          //   organization: res.data.retBean[0],
          //   organizationArray: res.data.retBean.concat(that.data.organizationArray),
          // })
          console.log(that.data.organizationArray)
          if (that.data.organizationArray.length == 1) {
            that.setData({
              isShowOrganization: true,
            })
          }
        }
      })
    }
  },


  submitTap: function (res) {
    let that = this;
    if (this.data.activityName == '') {
      this.setData({
        activityName: '召集',
      })
    }
    //添加最后一次写的培训事项
    if (util.isEmojiCharacter(that.data.info)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情")
    } else if (that.data.info != "") {
      let value = {
        id: that.data.length,
        content: that.data.info,
      }
      this.setData({
        contents: that.data.contents.concat(value),
      })
    }
    var time = util.formatTime(new Date());

    if (util.isEmojiCharacter(that.data.activityName) || util.isEmojiCharacter(that.data.introduction)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情")
    } else{

    }

    if (that.data.selectAddress == '请选择活动地点') {
      that.setData({
        selectAddress: '',
      })
    }

    if (this.data.startDate == "" || (this.data.selectAddress + this.data.location) == "") {
      Toast('请填写完整~');
    } else {
      api.postContents({
        method: 'POST',
        data: {
          contents: this.data.contents,
          userId: wx.getStorageSync("userId"),
          username:this.data.username,
          createtime: time,
          starttime: this.data.starttime,
          startDate: this.data.startDate,
          overDate: this.data.overDate,
          introduction: this.data.introduction,
          location: this.data.selectAddress + this.data.location,
          title: this.data.activityName,
          visibility:this.data.visibility,
          organization:this.data.organization,
          circle:this.data.circle,
          scenario:this.data.scenario,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          shareVisibility: that.data.shareVisibility,
          contents:that.data.contents,
          duration:that.data.duration,
        },
        success(res) {
          console.log(res);
          let articleId = res.data.retBean;
          if (typeof (articleId) != undefined) {
            that.setData({
              articleId: articleId,
            });
            console.log(that.data.articleId);
            wx.redirectTo({
              url: '../activityDetail/activityDetail?articleId=' + articleId + '&page=' + that.data.page,
            })
          }
        },
      });
    }

    if (that.data.organization != "") {
      api.postOrganization({
        method: "POST",
        data: {
          circle: that.data.circle,
          userId: wx.getStorageSync("userId"),
          organization: this.data.organization,
        },
        success(res) {
          console.log(res)
        }
      })
    }
  },
  onChange: function (res) {
    if (util.isEmojiCharacter(res.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        info: '',
      })
    } else {
      this.setData({
        info: res.detail
      })
    }
  },
  insert: function (res) {
    console.log(res)
    let that = this;
    if (util.isEmojiCharacter(that.data.info) || that.data.info == "") {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情，且不能为空")
    } else {
      let value = {
        id: that.data.length,
        content: that.data.info
      }
      this.setData({
        contents: that.data.contents.concat(value),
        length: that.data.length + 1,
        info: ''
      })
      console.log(this.data.contents)
    }

  },
  delete: function (res) {
    let that = this;
    let id = res.currentTarget.dataset.id;
    console.log(id)
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
  onChangeVisible: function (e) {
    if (this.data.visibility == 0) {
      this.setData({ visibility: Number(e.detail) });
    } else {
      this.setData({ visibility: Number(e.detail) });
    }
  },

  onChangeLocation: function (res) {
    if (util.isEmojiCharacter(res.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        location: '',
      })
    } else {
      this.setData({
        location: res.detail
      })
    }
  },

  onChangeName: function (res) {
    if (util.isEmojiCharacter(res.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        activityName: '',
      })
    } else {
      this.setData({
        activityName: res.detail
      })
    }
  },

  onChangeIntroduction: function (res) {
    console.log(res.detail.value)
    if (util.isEmojiCharacter(res.detail.value)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        introduction: '',
      })
    } else {
      this.setData({
        introduction: res.detail.value
      })
    }

  },

  onChangeOverDate: function (res) {

    if (util.isEmojiCharacter(res.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        overDate: '',
      })
    } else {
      this.setData({
        overDate: res.detail
      })
    }
  },
  bindStartDateFocus: function(){
    console.log('bindStartDateFocus')
  },
  onChangeStartDate: function (res) {

    if (util.isEmojiCharacter(res.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        startDate: '',
      })
    } else {
      this.setData({
        startDate: res.detail
      })
    }
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  pickerTap: function () {
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },

  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange: function (e) {
    console.log('bindStartMultiPickerChange')
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
    }

    if( minute == '0'){
      minute = '00';
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    that.setData({
      startDate: startDate,
      dateSelectedColor: '#000000'
    })

    console.log(startDate)
    that.setData({
      starttime: util.formateT(startDate),
    })
  },
  bindOverMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
    }

    var overDate = monthDay + " " + hours + ":" + minute;
    that.setData({
      overDate: overDate
    })
  },


})

import Toast from '../../dist/toast/toast';

var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
const api = require("../../utils/api.js");
var util = require('../../utils/util.js');
const app = getApp();
const apiUrl = api.apiURL;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: wx.getStorageSync('userId'),
    username:'',
    startDate: "截止时间",
    starttime:'',
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],

    contents: [],
    length: 0,
    info: '',
    taskTitle:"",
    organizationArray: ['自定义'],
    organization: "",
    isShowOrganization: false,
    visibility: 1,
    hiddenModalInput: true,
    circle:'training',
    scenario:'task',
    shareVisibility:0,
    placeholderStyleTitle: 'color:	#989898; font-size: 45rpx;',
    page:'return to me',
    dateSelectedColor: '',
    focus: false,
    organizationSelectedColor: '#000000',
    isShow: true,
    pics:[],
    Keys: [],
  },

  // 图片上传
  chooseImage: function () {
    var _this = this;
    var that = this;
    var pics = this.data.pics;
    console.log(pics.length);
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有

      success: function (res) {
        // success
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        // 控制触发添加图片的最多时隐藏
        if (pics.length >= 9) {
          _this.setData({
            isShow: (!_this.data.isShow)
          })
        } else {
          _this.setData({
            isShow: (_this.data.isShow)
          })
        }
        _this.setData({
          pics: pics
        })
        console.log("pics:" + pics.length);
      }
    })
  },

  previewImage:function(e){
    console.log(e)
    var current = e.target.dataset.src;
    var that = this;
    wx.previewImage({
      current:current,
      urls: that.data.pics,
      complete:function(){
        console.log("点击图片了")
      }
    })
  },

  SwitchAChange: function (res) {
    this.setData({ visibility: Number(res.detail) });
  },
  SwitchBChange: function (res) {
    this.setData({ shareVisibility: Number(res.detail) });
  },
  onChangeVisible: function (e) {
    if (this.data.visibility == 0) {
      this.setData({ visibility: Number(e.detail) });
    }else{
      this.setData({ visibility: Number(e.detail) });
    }
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
      // isShowOrganization: true,
    })
  },
  
  onChangeTitle:function(e){
    if (util.isEmojiCharacter(e.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        taskTitle: '',
      })
    } else {
      this.setData({
        taskTitle: e.detail
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //设置默认截止日期
    var date1 = new Date(date);
    date1.setDate(date.getDate() + 1);
    var monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
    var startDate = monthDay + " 08:00";
  
    this.setData({
      username: wx.getStorageSync("userInfo").nickName,
      startDate: startDate,
      starttime: util.formateT(startDate)
    })
    console.log(that.data.startDate)

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
    }else{
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

  submitTap: function (res) {
    let that = this;
    //添加最后一项作业内容
    if (util.isEmojiCharacter(that.data.info)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情")
    } else if(that.data.info != ""){
      let value = {
        id: that.data.length,
        content: that.data.info
      }
      this.setData({
        contents: that.data.contents.concat(value),
      })
    }

    if (this.data.taskTitle == ''){
      this.setData({
        taskTitle:'留作业',
      })
    }
    
    var time = util.formatTime(new Date());
    console.log(this.data.contents);
    if (util.isEmojiCharacter(this.data.title)){
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情")
    }else{
      if (this.data.startDate == "" || this.data.contents.length == 0) {
        Toast('请填写完整~');
      } else {
        var pics = that.data.pics;
        for (var i = 0; i <= pics.length - 1; i++) {
          var filePath = pics[i]
          console.log('filePath' + (i) + ':' + filePath);
          var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
          this.data.Keys.push(Key);
          console.log(this.data.Keys);
          //上传图片
          wx.uploadFile({
            url: `${apiUrl}/pic/upload`,
            filePath: filePath,
            name: 'file',
            header: { "content-type": "application/x-www-form-urlencoded" },
            success: function (res) {
              console.log(res)
              wx.showToast({
                icon: 'success',
                duration: 2000
              })
            },
            fail: function (res) {
              console.log(res)
            }
          })
        };


        api.postContents({
          data: {
            userId: wx.getStorageSync("userId"),
            username: this.data.username,
            startDate: this.data.startDate,
            createtime: time,
            starttime: this.data.starttime,
            contents: this.data.contents,
            organization: this.data.organization,
            visibility: this.data.visibility,
            forward: this.data.forward,
            title: this.data.taskTitle,
            circle: this.data.circle,
            scenario: this.data.scenario,
            shareVisibility:this.data.shareVisibility,
            pics:this.data.pics,
          },
          method: 'POST',
          success(res) {
            console.log(res);
            let articleId = res.data.retBean;
            if (typeof (articleId) != undefined) {
              that.setData({
                articleId: articleId,
              });
              console.log(that.data.articleId);
              wx.redirectTo({
                url: '../taskDetail/taskDetail?articleId=' + articleId + '&page=' + that.data.page,
              })
            }
          },
        })
    }
    
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

    if (minute == '0') {
      minute = '00';
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    that.setData({
      startDate: startDate,
      dateSelectedColor: '#000000'
    })

    that.setData({
      starttime: util.formateT(startDate),
    })
  },

})
import Toast from '../../dist/toast/toast';

var COS = require('../../libs/cos-wx-sdk-v5')
var util = require('../../utils/util.js');

const api = require('../../utils/api.js');
const app = getApp()

//定义全局变量cos
var cos = new COS({
  getAuthorization: function(params, callback) {
    var authorization = COS.getAuthorization({
      SecretId: 'AKIDnMLhBi07vnWWcmoqeXUlBeEtYHzoF3Hl',
      SecretKey: 'wzMA58GUexU8tz7JVXWXTIA7LjMwY0WA',
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});

//定义全局变量requestCallback
var requestCallback = function(err, data) {
  console.log(err || data);
  if (err && err.error) {
    wx.showModal({
      title: '返回错误',
      content: '请求失败：' + err + '；状态码：' + err.error,
      showCancel: false
    });
  } else if (err) {
    wx.showModal({
      title: '请求出错',
      content: '请求出错：' + err + '；状态码：' + err.statusCode,
      showCancel: false
    });
  } else {
    wx.showToast({
      title: '请求成功',
      icon: 'success',
      duration: 3000
    });
  }
};

Page({
  data: {
    focus:true,
    pics: [],
    isShow: true,
    Keys: [],
    visibility: 0,
    shareVisibility:0,
    articleId: '',
    obj: {},
    imgs: [],
    userInfo: {},
    title: '',
    organizationArray: ['自定义'],
    organization: '',
    userName: '',
    userId: wx.getStorageSync("userId"),
    circle: 'share',
    scenario: 'photo',
    isShowOrganization: false,
    hiddenModalInput:true,
    nikeName:'',
    contents:'',
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    console.log(this.data.organizationArray[e.detail.value])

    if ('自定义' == this.data.organizationArray[e.detail.value]) {
      this.setData({
        hiddenModalInput: false,
      })
    } else {
      this.setData({
        index: e.detail.value,
        organization: this.data.organizationArray[e.detail.value],
      })
    }
  },

  bindModalInput: function(e) {
    console.log(e);
    this.setData({
      organization: e.detail.value,
    })
  },

  //取消按钮  
  cancel: function() {
    this.setData({
      hiddenModalInput: true
    });
  },
  //确认  
  confirm: function() {
    this.setData({
      hiddenModalInput: true,
      isShowOrganization: true,
    })
  },

  onLoad: function(options) {
    // 生命周期函数--监听页面加载
    var that = this;
    app.checkUserInfo(function (userInfo, isLogin) {
      if (!isLogin) {
        wx.redirectTo({
          url: '../authorization/authorization?backType=mine'
        })
      } else {
        that.setData({
          userInfo: userInfo,
          nikeName: userInfo.nickName
        });
        console.log(userInfo.nickName);
      }
    });

    var time = util.formatTime(new Date());
    this.setData({
      createtime: time
    })
    if (options.pics != null) {
      console.log(options);
      this.setData({
        obj: options.obj,
        pics: JSON.parse(options.pics),
        imgs: JSON.parse(options.imgs),
        organization: options.organization,
        title: options.title,
        isShow: (options.isShow == "true" ? true : false),
        hiddenModalInput: true,
        isShowOrganization: false,
        contents: JSON.parse(options.contents),
        visibility:(options.visibility=="0"?0:1),
        shareVisibility:(options.shareVisibility=="0"?0:1),
      })
      
    }
    api.getOrganizationByUserId({
      data: {
        circle: that.data.circle,
        userId: wx.getStorageSync("userId"),
      },
      success(res) {
        console.log(res.data.retBean)
        var organizationArr = [];
        for (var i in res.data.retBean) {
          organizationArr.push(res.data.retBean[i].organization)
        }
        that.setData({
          organization: organizationArr[0],
          organizationArray: organizationArr.concat(that.data.organizationArray)
        })
        // that.setData({
        //   organizationArray: that.data.organizationArray.concat(res.data.retBean),
        // })
        // console.log(that.data.organizationArray)
        if (that.data.organizationArray.length == 1) {
          that.setData({
            isShowOrganization: true,
          })
        }
      }
    })
  },


  // 图片上传
  chooseImage: function() {
    var _this = this;
    var that = this,
      pics = this.data.pics;
    console.log(pics.length);
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有

      success: function(res) {
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
      }
    })
  },
  btnTap: function(e) {
    let that = this;
    var pics = this.data.pics;
    var articleId = this.data.articleId;
    var title = this.data.title;
    var userInfo = this.data.userInfo;
    var nikeName = this.data.nikeName;
    var username = this.data.nikeName;
    console.log(username);
    if (title == "") {
      that.setData({
        title: nikeName + '的照片分享'
      })
    }
    for (var i = 0; i <= pics.length - 1; i++) {
      var filePath = pics[i]
      console.log('filePath' + (i) + ':' + filePath);
      var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
      this.data.Keys.push(Key);
      console.log(this.data.Keys);
      cos.postObject({
        Bucket: 'yunji-1255930917',
        Region: 'ap-beijing',
        Key: Key,
        FilePath: filePath,
        onProgress: function(info) {
          console.log(JSON.stringify(info));
        }
      }, requestCallback);
    };

//添加自定义组织
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
    if (this.data.pics.length == 0) {
      Toast('请选择图片~');
  }else{
    api.postContents({
      data: {
        Keys: this.data.Keys,
        pics:this.data.pics,
        visibility: this.data.visibility,
        shareVisibility:this.data.shareVisibility,
        obj: this.data.obj,
        title: this.data.title,
        organization: this.data.organization,
        username: username,
        userId: wx.getStorageSync("userId"),
        scenario: this.data.scenario,
        circle: this.data.circle,
        createtime: this.data.createtime
      },
      method: 'POST',
      success: function(res) {
        console.log(res);
        let articleId = res.data.retBean;
        that.setData({
          articleId: articleId
        })
        wx.redirectTo({
          url: '../picDetail/picDetail?articleId=' + that.data.articleId,
        })
      },
      fail: function(res) {
        console.log("--------fail--------");
      }
    })
    }
//     for(var n = 0; n<pics.length;n++){
//       console.log('进来了')
//       wx.uploadFile({
//         url: 'http://127.0.0.1:8080/file/picUpload',
//         filePath: pics[0],
//         name: 'aaa',
//         header: {
//           "Content-Type": "multipart/form-data",
//           'accept': 'application/json',
//         },
//         formData: { 
//           'name': 111 
//           },
//         success: function (res) {
//           let datas = JSON.parse(res.data)
//           let status = datas.status;
//           let msg = datas.msg;
//           if (status == "2") {
//             setTimeout(function () {
//               that.saveRecordingFile(audioFile)
//             }, 500)
//           } else {
//             wx.showToast({
//               title: '上传失败，请重试！',
//             })
//             return;
//           }
//         },
//         fail: function (res) {
//           wx.showModal({
//             title: '提示',
//             content: '上传失败，请重试！',
//           })
//           return;
//         },
// //原文：https://blog.csdn.net/Charles_Tian/article/details/80669530 
//       })
//     }
  
  },
  // 图片预览
  previewImage: function(e) {
    var current = e.target.dataset.src,
      index = e.currentTarget.dataset.index,
      pics = this.data.pics,
      title = this.data.title,
      organization = this.data.organization,
      isShow = this.data.isShow,
      userInfo = this.data.userInfo,
      obj = this.data.obj,
      visibility = this.data.visibility,
      shareVisibility = this.data.shareVisibility,
      contents = this.data.contents;
      if(title=''){
        title: userInfo.nikeName + '的照片分享'
      }
      console.log(organization);
    if (index == 0) {
      //JSON.stringify 
      wx.navigateTo({
        url: '../preview/preview?current=' + current + '&pics=' + JSON.stringify(this.data.pics) + '&index=' + index + '&title=' + title + '&organization=' + organization + '&isShow=' + isShow + '&visibility=' + visibility + '&contents=' + JSON.stringify(contents)+'&shareVisibility='+shareVisibility
      })
    }else{
      wx.showModal({
        title: '请点击首张图片进行预览编辑~',
      })
    }
  },
  onChangetitle: function (res) {
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
  onChangeOrganization: function(res) {
    console.log(res)
    if (util.isEmojiCharacter(res.detail)) {
      //提示不得包含特殊字符或emoji表情
      Toast("不得包含特殊字符或emoji表情");
      this.setData({
        organization: '',
      })
    } else {
      this.setData({
        organization: res.detail
      })
    }
  },
  SwitchAChange: function(res) {
    this.setData({ visibility: Number(res.detail) });
  },
  
  SwitchBChange: function (res) {
    this.setData({ shareVisibility: Number(res.detail) });
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },
})
import Toast from '../../dist/toast/toast';
const uploadImage = require('../../utils/uploadFile.js');
var util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const app = getApp()
const apiUrl = api.apiURL;
console.log(apiUrl)
Page({
  data: {
    focus:true,
    organizationFocus: false,
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
    organizationSelectedColor: '#000000',
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    console.log(this.data.organizationArray[e.detail.value])

    if ('自定义' == this.data.organizationArray[e.detail.value]) {
      this.setData({
        hiddenModalInput: false,
        organizationFocus: true
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

  onChangeTitle: function(res) {
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

    // api.getOrganizationByUserId({
    //   data: {
    //     circle: that.data.circle,
    //     userId: wx.getStorageSync("userId"),
    //   },
    //   success(res) {
    //     console.log(res.data.retBean)

    //     that.setData({
    //       organizationArray: that.data.organizationArray.concat(res.data.retBean),
    //     })
    //     console.log(that.data.organizationArray)
    //     if (that.data.organizationArray.length == 1) {
    //       that.setData({
    //         isShowOrganization: true,
    //       })
    //     }
    //   }
    // })
  },


  // 图片上传
  chooseImage: function() {
    var _this = this;
    var that = this;
    var pics = this.data.pics;
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
        console.log("pics:" + pics.length);
      }
    })
    that.setData({
      focus: 0
    })
    console.log(that.data.focus)
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
      if (util.isEmojiCharacter(that.data.title)) {
          //提示不得包含特殊字符或emoji表情
          Toast("不得包含特殊字符或emoji表情")
      } else {
        for (var i = 0; i <= pics.length - 1; i++) {
          var filePath = pics[i]
          console.log('filePath' + (i) + ':' + filePath);
          var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
          //图片名字 可以自行定义，     这里是采用当前的时间戳 + 150内的随机数来给图片命名的
          // const Key = new Date().getTime() + Math.floor(Math.random() * 15000) + '.png';
          this.data.Keys.push(Key);
          //上传图片
          //你的域名下的/cbb文件下的/当前年月日文件下的/图片.png
          //图片路径可自行修改
          uploadImage(pics[i], '', Key,
            function (result) {
              console.log("======上传成功图片地址为：", result);
              wx.hideLoading();
            }, function (result) {
              console.log("======上传失败======", result);
              wx.hideLoading()
            }
          )
        };
          // for (var i = 0; i <= pics.length - 1; i++) {
          //     var filePath = pics[i]
          //     console.log('filePath' + (i) + ':' + filePath);
          //     var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
          //     this.data.Keys.push(Key);
          //     console.log(this.data.Keys);
          //     //上传图片
          //     wx.uploadFile({
          //         url: `${apiUrl}/pic/upload`,
          //         filePath: filePath,
          //         name: 'file',
          //         header: {"content-type": "application/x-www-form-urlencoded"},
          //         success: function (res) {
          //             console.log(res)
          //             wx.showToast({
          //                 icon: 'success',
          //                 duration: 2000
          //             })
          //         },
          //         fail: function (res) {
          //             console.log(res)
          //         }
          //     })
          // }
          //添加自定义组织
          if (that.data.organization != "") {
              api.postOrganization({
                  method: "POST",
                  data: {
                      circle: this.data.circle,
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
          } else {
              api.postContents({
                  data: {
                      Keys: this.data.Keys,
                      pics: this.data.pics,
                      visibility: this.data.visibility,
                      shareVisibility: this.data.shareVisibility,
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
                  success: function (res) {
                      console.log(res);
                      let articleId = res.data.retBean;
                      that.setData({
                          articleId: articleId
                      })
                      wx.redirectTo({
                          url: '../picDetail/picDetail?articleId=' + articleId,
                      })
                  },
                  fail: function (res) {
                      console.log("--------fail--------");
                  }
              })
          }
      }
  },

  // 图片预览
  previewImage: function(e) {
    this.setData({
      focus: 0
    })
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

  deleteImage: function (e) {
    var that = this;
    var pics = that.data.pics;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          pics.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          pics
        });
      }
    })
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
  }
})

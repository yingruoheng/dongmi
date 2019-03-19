var util = require('../../utils/util.js');
const api = require("../../utils/api.js");
import Toast from '../../dist/toast/toast';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    userId: "",
    toUserId: "",
    articleId: '',
    startDate: '',
    overDate:'',
    checked: false,
    length: 0,
    readNum: 0,
    likeNum: 0,
    commentNum: 0,
    comments: [],
    currentComments: [],
    comment: '',
    commentCreatetime:'',
    commentComplete: false,
    info: '',
    actionType: '',
    introduction: '',
    location: '',
    activityName: '',

    // scenario:'activity',
    iconLike:'join',
    iconInterest:"interest",
    organization: "",
    isShowOrganization:false,
    circle: 'play',
    scenario: 'activity',
    isLike: 0,
    isRead: 0,
    isInterest: 0,
    // shareVisibility: 0,
    isAllowShare:true,
    visibility:0,
    author: '',
    authorImageUrl: '',
    color: '#8590a6',
    contents: [],
    // returnPage: '',
    shareVisibility:1,
    duration:'',
    //展示点赞按钮
    isShowLike:false,
    returnPage:'',
  },

  bindLocationTap: function (res) {
    var that = this;
    console.log(res);
    // wx.redirectTo({
    //   url: '../mapDes/mapDes?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude + '&address=' + this.data.location,
    // })
    wx.openLocation({
      latitude: parseFloat(this.data.latitude),
      longitude: parseFloat(this.data.longitude),
      name: this.data.location,
    })
  },

  bindconfirm: function (e) {
    let that = this;
    console.log(e.detail.value)
    var time = util.formatTime(new Date());
    var comment = e.detail.value;
    if (comment == '') {
      Toast('请填写评论~');
    } else {
      api.postComments({
        method: 'POST',
        data: {
          userId: wx.getStorageSync("userId"),
          articleId: that.data.articleId,
          createtime: time,
          comment: comment,
        },
        success(res) {
          console.log(res);
          console.log(that.data.userInfo)
          var commentItem = {
            headImageUrl: that.data.userInfo.avatarUrl,
            nickName: that.data.userInfo.nickName,
            content: comment,
            createtime: time,
          };
          //修改
          var commentArray = [commentItem];
          that.setData({
            commentComplete: true,
            info: '',
            comment: '',
            commentNum: that.data.commentNum + 1,
            comments: commentArray.concat(that.data.comments),
          })
        },
      })
    }
  },

  navigateToIndex: function (e) {
    wx.switchTab({
      url: '../release/release',
    })
  },

  showReaders: function (e) {
    console.log(e)
    if (this.data.isShowReaders) {
      this.setData({
        isShowReaders: false,
      })
    } else {
      this.setData({
        isShowReaders: true,
      })
    }
  },

  joinTap: function (res) {
    let that = this;
    this.setData({
      color: '#1296db',
    })
    console.log(this.data.isLike)
    var time = util.formatTime(new Date());
    api.postAction({
      method: "POST",
      data: {
        userId: wx.getStorageSync("userId"),
        articleId: that.data.articleId,
        createtime: time,
        actionType: "like",
        scenario:'activity',
      },
      success(res) {
        console.log(res);
        var result = res.data.retBean.result;
        if (result == 1) {
          that.setData({
            likeNum: that.data.likeNum + 1,
            iconLike: 'joined',
          })
        }
      },
    });
    //向后台发送关注数据：关注者、被关注者、圈子、场景、关注时间
    //点赞即关注
    api.postInterest({
      method: "POST",
      data: {
        userId: wx.getStorageSync("userId"),
        toUserId: that.data.toUserId,
        circle: 'play',
        scenario: 'activity',
        createtime: time,
      },
      success(res) {
        console.log(res);
        var result = res.data.retBean.result;
        if (result == "添加成功" || result == "已关注") {
          that.setData({
            iconInterest: 'interested',
          })
        }
      },
    })
    // if(this.data.isLike == 0){

    // }
  },

  interestTap: function (e) {
    let that = this;
    var time = util.formatTime(new Date());
    // 向后台发送关注数据：关注者、被关注者、圈子、场景、关注时间
    api.postInterest({
      method: "POST",
      data: {
        userId: wx.getStorageSync("userId"),
        toUserId: that.data.toUserId,
        circle: 'play',
        scenario: 'activity',
        createtime: time,
      },
      success(res) {
        console.log(res);
        var result = res.data.retBean.result;
        if (result == "添加成功" || result == "已关注") {
          that.setData({
            iconInterest: 'interested',
          })
        }
      },
    })
  },

  onChangeComment: function (res) {
    console.log(res.detail)
    this.setData({
      comment: res.detail,
    })
  },

  onChangeSwitch: function (e) {
    let that = this;
    console.log(e)
    var time = util.formatTime(new Date());
    this.setData({
      checked: e.detail,
    })
    if (e.detail) {
      api.postAction({
        method: "POST",
        data: {
          userId: wx.getStorageSync("userId"),
          articleId: that.data.articleId,
          createtime: time,
          actionType: "like",
          scenario: 'activity',
        },
        success(res) {
          console.log(res);
          var result = res.data.retBean.result;
          if (result == 1) {
            that.setData({
              likeNum: that.data.likeNum + 1,
            })
          }
        },
      });
    }
  },

  //评论发送触发按钮
  sendTap: function (res) {
    let that = this;
    //生成评论时间
    var time = util.formatTime(new Date());
    this.setData({
      commentCreatetime: time,
    })
    var comment = that.data.comment;
    if (comment == '') {
      Toast('请填写评论~');
    } else {
      api.postComments({
        method: 'POST',
        data: {
          userId: wx.getStorageSync("userId"),
          articleId: that.data.articleId,
          createtime: time,
          comment: that.data.comment,
        },
        success(res) {
          console.log(res);
          var commentItem = {
            comment: that.data.comment,
            commentCreatetime: time,
          };
          that.setData({
            commentComplete: true,
            info: '',
            comment: '',
            commentNum: that.data.commentNum + 1,
            currentComments: that.data.currentComments.concat(commentItem),
          })
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      userId: wx.getStorageSync('userId'),
      nickName: wx.getStorageSync('userInfo').nickName,
    })
    let articleId = options.articleId;
    var userId = wx.getStorageSync("userId");
    if (userId == undefined || userId == null || userId == "") {
      wx.redirectTo({
        url: '../authorization/authorization?scenario=' + '召集' + '&articleId=' + articleId,
      })
    }
    

    this.setData({
      articleId: articleId,
    })

    if (options.page) {
      this.setData({
        returnPage: options.page
      })
    }

    var time = util.formatTime(new Date());
    console.log("添加阅读" + that.data.isRead)
    api.postAction({
      method: 'POST',
      data: {
        userId: that.data.userId,
        articleId: that.data.articleId,
        createtime: time,
        actionType: "read",
        scenario: 'activity',
      },
      success(res) {
        console.log(res);
        var result = res.data.retBean.result;
        if (result == 1) {
          that.setData({
            readNum: that.data.readNum + 1,
          })
        }
      },
    })

    api.getDetail({
      data: {
        userId: that.data.userId,
        articleId: articleId,
        scenario: that.data.scenario,
      },
      success(res) {
        console.log(res.data.retBean);
        var likeNum = res.data.retBean.likeNum;
        var readNum = res.data.retBean.readNum;
        var commentNum = res.data.retBean.commentNum;
        var startDate = res.data.retBean.startDate;
        var overDate = res.data.retBean.overDate;
        var comments = res.data.retBean.comments;
        var activityName = res.data.retBean.activityName;
        var location = res.data.retBean.location;
        var introduction = res.data.retBean.introduction;
        var organization = res.data.retBean.organization;
        var toUserId = res.data.retBean.userId;
        var isLike = res.data.retBean.isLike;
        var isRead = res.data.retBean.isRead;
        var author = res.data.retBean.author;
        var authorImageUrl = res.data.retBean.authorImageUrl;
        var createtime = res.data.retBean.createtime;
        var shareVisibility = res.data.retBean.shareVisibility;
        var visibility = res.data.retBean.visibility;
        var contents = res.data.retBean.contents;
        var duration = res.data.retBean.duration;
        var latitude = res.data.retBean.latitude;
        var longitude = res.data.retBean.longitude;
        var location = res.data.retBean.location;


        that.setData({
          likeNum: likeNum,
          readNum: readNum,
          comments: comments,
          commentNum: commentNum,
          startDate: startDate,
          overDate: overDate,
          location: location,
          activityName: activityName,
          introduction: introduction,
          organization: organization,
          toUserId: toUserId,
          isLike: isLike,
          isRead: isRead,
          author: author,
          authorImageUrl: authorImageUrl,
          createtime: createtime,
          shareVisibility: shareVisibility,
          visibility: visibility,
          contents: contents,
          duration: duration,
          latitude: latitude,
          longitude: longitude,
          location: location,
        })

        //设置点赞按钮颜色
        if (that.data.isLike == 1) {
          that.setData({
            color: '#1296db',
            iconLike: 'liked',
            isShowLike: true,
          })
        }

        //设置转发权限
        console.log('userId:' + that.data.userId)
        console.log(that.data.toUserId)
        console.log('shareVisibility:')
        console.log(that.data.shareVisibility)
        if (that.data.userId == that.data.toUserId) {
          console.log("同一个人")
          that.setData({
            isAllowShare: true,
          })
        } else {
          console.log('权限设置')
          if (that.data.shareVisibility == 0) {
            that.setData({
              isAllowShare: true,
            })
          } else {
            that.setData({
              isAllowShare: false,
            })
            //隐藏右上角转发按钮
            wx.hideShareMenu();
          }

        }

        console.log('367行')
        console.log(that.data.isAllowShare)

        //点了别人发的朋友消息自动加入组织
        if (wx.getStorageSync("scene") == 1044 || wx.getStorageSync("scene") == 1007) {
          console.log("进入转发后的 onload页面，携带参数如下：")
          console.log(options.articleId)
          that.interestTap();


          //加入组织
          api.postOrganization({
            method: "POST",
            data: {
              circle: that.data.circle,
              userId: wx.getStorageSync("userId"),
              organization: that.data.organization,
            },
            success(res) {
              console.log(res)
            }
          })
        }

        api.getInterest({
          data: {
            userId: wx.getStorageSync("userId"),
            toUserId: that.data.toUserId,
            scenario: "weekly",
          },
          success(res) {
            console.log(res.data.retBean)
            var isInterest = res.data.retBean;
            if (isInterest != 0) {
              that.setData({
                iconInterest: "interested",
              })
            }
          }
        });
        if (that.data.isLike != 0) {
          that.setData({
            iconLike: "joined"
          })
        }

        if (organization != ""){
          that.setData({
            isShowOrganization:true,
          })
        }
      },
    });

  },

  showReaders: function (e) {
    let that = this;
    console.log(e)
    if (this.data.isShowReaders) {
      this.setData({
        isShowReaders: false,
      })
    } else {
      this.setData({
        isShowReaders: true,
      });

      //获取浏览者的详细信息
      api.getReadersInfo({
        data: {
          articleId: that.data.articleId,
          actionType: "read",
        },
        success(res) {
          console.log(res.data.retBean);
          that.setData({
            readers: res.data.retBean,
          })
        },
      });

      //获取点赞者的详细信息
      api.getReadersInfo({
        data: {
          articleId: that.data.articleId,
          actionType: "like",
        },
        success(res) {
          console.log(res.data.retBean);
          that.setData({
            likers: res.data.retBean,
          })
        },
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      userId: wx.getStorageSync('userId'),
      nickName: wx.getStorageSync('userInfo').nickName,
    })
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
    console.log("onunload页面")
    console.log("articleId:")
    console.log(this.data.articleId)
    let that = this;

    var url = '../' + that.data.returnPage + '/' + that.data.returnPage;

    if (that.data.returnPage == "return to me") {
      // wx.switchTab({
      //   url: "../recommend/recommend"//这个是默认的单页
      // });

    } else if (that.data.returnPage){
      // wx.redirectTo({
      //   url: url,
      // })
    }
    else if (that.data.articleId) {
      // wx.navigateTo({
      //   url: '../activityDetail/activityDetail?articleId=' + that.data.articleId,
      // })
    }else {
      // wx.reLaunch({
      //   url: "../recommend/recommend"//这个是默认的单页
      // });
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // 点赞
  likeTap: function (res) {
    let that = this;
    if (that.data.isLike == 1 || that.data.iconLike == "liked") {
      res.preventDefault();
    }
    // this.setData({
    //   color: '#1296db',
    // })

    var time = util.formatTime(new Date());

    api.postAction({
      method: "POST",
      data: {
        userId: wx.getStorageSync("userId"),
        articleId: that.data.articleId,
        createtime: time,
        actionType: "like",
        scenario: 'activity',
      },
      success(res) {
        console.log(res);
        var result = res.data.retBean.result;
        if (result == 1) {
          that.setData({
            likeNum: that.data.likeNum + 1,
            iconLike: 'liked',
            isLike:1,
            isShowLike:true,
            color: '#1296db',
          })

          //临时添加点赞显示在评论框中
          var commentItem = {
            headImageUrl: that.data.userInfo.avatarUrl,
            nickName: that.data.userInfo.nickName,
            content: '参加',
            createtime: time,
          };

          var commentArray = [commentItem];
          that.setData({
            commentComplete: true,
            info: '',
            comment: '',
            commentNum: that.data.commentNum + 1,
            comments: commentArray.concat(that.data.comments),
          })
        }
      },
    });
    //设置点赞按钮颜色
    that.setData({
      color: '#1296db',
      iconLike: 'liked',
      isShowLike: true,
    })
    //向后台发送关注数据：关注者、被关注者、圈子、场景、关注时间
    //点赞即关注
    api.postInterest({
      method: "POST",
      data: {
        userId: wx.getStorageSync("userId"),
        toUserId: that.data.toUserId,
        circle: 'training',
        scenario: 'task',
        createtime: time,
      },
      success(res) {
        console.log(res);
        var result = res.data.retBean.result;
        if (result == "添加成功" || result == "已关注") {
          that.setData({
            iconInterest: 'interested',
          })
        }
      },
    })


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    console.log("626行")
    console.log(options)
    let that = this;
    console.log('share按钮分享')
    wx.updateShareMenu({
      withShareTicket: true,
    })

    var articleId = this.data.articleId;
    if (this.data.userId == this.data.toUserId || this.data.shareVisibility == 0) {
      console.log("有权限转发～")
      let obj = {
        title: that.data.title,
        path: '/pages/activityDetail/activityDetail?articleId=' + articleId,
        imgUrl: '',
      }
      return util.shareEvent(options, obj)
    } else {
      console.log("没有权限看哦～")
      wx.hideShareMenu();
      this.setData({
        shareVisibility: 1,
      })
    }
  }
})

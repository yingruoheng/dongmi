// pages/picDetail/picDetail.js
const app = getApp()
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    userInfo: "",
    userId: "",
    contents:[],
    articleId:'',
    current:'',
    pic:'',
    readNum:0,
    likeNum:0,
    createtime:'',
    commentNum:0,
    comments: [],
    currentComments: [],
    comment: '',
    commentComplete: false,
    isLike: 0,
    isRead:0,
    nickName:'',
    headImg:'',
    iconLike:'like',
    iconInterest:'interest',
    organization:'',
    isShowOrganization: false,
    toUserId:'',
    title: '', 
    color: '#8590a6',
    shareVisibility: 1,
    isAllowShare:false,
  },

  onChangeComment: function (res) {
    console.log(res.detail)
    this.setData({
      comment: res.detail,
    })
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
          userId: that.data.userId,
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
    var that = this;
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      userId: wx.getStorageSync('userId'),
      nickName: wx.getStorageSync('userInfo').nickName,
    })
    let articleId = options.articleId;
    var userId = wx.getStorageSync("userId");
    if (userId == undefined || userId == null || userId == "") {
      wx.redirectTo({
        url: '../authorization/authorization?scenario=' + '光影' + '&articleId=' + articleId,
      })
    }
    
    that.setData({
      articleId:articleId,
    })

    var time = util.formatTime(new Date());
    console.log("添加阅读" + that.data.isRead)
    api.postAction({
      method: 'POST',
      data: {
        userId: wx.getStorageSync("userId"),
        articleId: that.data.articleId,
        createtime: time,
        actionType: "read",
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
        scenario: 'photo'
      },
      success(res) {
        console.log(res.data.retBean);
        console.log(res.data.retBean.wxInfo.nickname);
        var pics = [];
        var contents = [];
        var likeNum = res.data.retBean.likeNum;
        var readNum = res.data.retBean.readNum;
        var commentNum = res.data.retBean.commentNum;
        var createtime = res.data.retBean.createtime;
        var comments = res.data.retBean.comments;
        var isLike = res.data.retBean.isLike;
        var isRead = res.data.retBean.isRead;
        var title = res.data.retBean.title;
        var nickName = res.data.retBean.wxInfo.nickname;
        var headImg = res.data.retBean.wxInfo.headimageurl;
        var organization = res.data.retBean.organization;
        
        var toUserId = res.data.retBean.userId;
        for (var i = 0; i < res.data.retBean.pics.length; i++) {
          var pic = res.data.retBean.pics[i].url;
          pics = pics.concat(pic);
          var con = res.data.retBean.pics[i].content;
          if(con=='null'){
            con=' '
          }
          contents = contents.concat(con);
          var createtime = res.data.retBean.createtime;
        }
        that.setData({
          pics: pics,
          contents: contents,
          createtime: createtime,
          likeNum: likeNum,
          readNum: readNum,
          commentNum: commentNum,
          comments: comments,
          commentNum: commentNum,
          createtime: createtime,
          isLike: isLike,
          isRead: isRead,
          nickName:nickName,
          headImg:headImg,
          organization: organization,
          toUserId: toUserId,
          title:title,
          shareVisibility:res.data.retBean.shareVisibility == '0' ? 0 : 1
        })
        console.log(pics)

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
            wx.hideShareMenu(that.data.shareVisibility);
          }
          console.log()
        }

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
            scenario: "photo",
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
            iconLike: "liked"
          })
        }

        if (organization != "") {
          that.setData({
            isShowOrganization: true,
          })
        }
      },
    });
    if (wx.getStorageSync("scene") == 1036) {
      this.interestTap()
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
  onShareAppMessage: function (options) {
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
        path: '/pages/picDetail/picDetail?articleId=' + articleId,
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
  previewImage: function (e) {
    var current = e.target.dataset.src,
    index = e.currentTarget.dataset.index,
    pics = this.data.pics,
    obj = this.data.obj;
    //JSON.stringify 
    wx.navigateTo({
      url: '../picShow/picShow?current=' + current + '&pics=' + JSON.stringify(this.data.pics) + '&index=' + index + '&contents=' + JSON.stringify(this.data.contents)
    })
  },
  
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
        color: '#1296db',
        scenario: 'photo',
      },
      success(res) {
        console.log(res);
        var result = res.data.retBean.result;
        if (result == 1) {
          that.setData({
            likeNum: that.data.likeNum + 1,
            iconLike: 'liked',
            isLike: 1,
            isShowLike: true,
            color: '#1296db',
          })
        }

        //临时添加已阅显示在评论框中
        var commentItem = {
          headImageUrl: that.data.userInfo.avatarUrl,
          nickName: that.data.userInfo.nickName,
          content: '点赞',
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
          circle: 'share',
          scenario: 'photo',
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
  navigateToIndex: function (e) {
    wx.switchTab({
      url: '../recommend/recommend',
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
})
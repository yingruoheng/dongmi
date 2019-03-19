// pages/weeklyDetail/weeklyDetail.js
var util = require('../../utils/util.js');
const api = require("../../utils/api.js");
import Toast from '../../dist/toast/toast';
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: "",
    // iconLike:'like',
    userId: "",
    toUserId:'',
    articleId:'',
    createtime:'2018-10-19',
    commentCreatetime:'',
    contents: [{'thisWeekComplete':'', 'thisWeekEffect':'', 'nextWeekPlan':''}],
    readNum:0,
    likeNum:0,
    commentNum:0,
    comments:[],
    // currentComments:[],
    comment:'',
    commentComplete:false,
    info:'',
    actionType:'',

    scenario: 'weekly',
    weekStartDay: '',
    weekEndDay: '',
    title:'周报',
    iconLike:'like',
    iconInterest: 'interest',
    isShowReaders:false,
    isShowLovers:false,
    organization:"",
    readers:[],
    likers:[],
    isLike: 0,
    isRead: 0,
    isInterest: 0,
    //0表示不能公开可见，1表示公开可见
    visibility:0,
    //1表示不可转发，0表示可转发
    shareVisibility:1,
    isAllowShare: true,
    author: '',
    authorImageUrl: '',
    color:'#8590a6',
    returnPage: '',
    isShowLike:false,
  },



  navigateToIndex:function(e){
    wx.switchTab({
      url: '../release/release',
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      userId: wx.getStorageSync('userId'),
      nickName: wx.getStorageSync('userInfo').nickName,
    })
    var userId = wx.getStorageSync("userId");
    var articleId = options.articleId;
    if (userId == undefined || userId == null || userId == "") {
      wx.redirectTo({
        url: '../authorization/authorization?scenario=' + '写周报' + '&articleId=' + articleId,
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
    //添加阅读
    var time = util.formatTime(new Date());
    api.postAction({
      method: 'POST',
      data: {
        userId: wx.getStorageSync("userId"),
        articleId: that.data.articleId,
        createtime: time,
        actionType: "read",
        scenario: 'weekly',
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

    console.log("articleId:" + articleId)
    api.getDetail({
      data: {
        userId:that.data.userId,
        articleId: articleId,
        scenario: that.data.scenario,
      },
      success(res) {
        console.log(res);
        console.log(res.data.retBean);
        var likeNum = res.data.retBean.likeNum;
        var readNum = res.data.retBean.readNum;
        var commentNum = res.data.retBean.commentNum;
        var createtime = res.data.retBean.createtime;
        var contents = res.data.retBean.contents;
        var comments = res.data.retBean.comments;
        var weekStartDay = res.data.retBean.weekStartDay;
        var weekEndDay = res.data.retBean.weekEndDay;
        var organization = res.data.retBean.organization;
        var title = res.data.retBean.title;
        var toUserId = res.data.retBean.userId;
        var isLike = res.data.retBean.isLike;
        var isRead = res.data.retBean.isRead;
        var visibility = res.data.retBean.visibility;
        var author = res.data.retBean.author;
        var authorImageUrl = res.data.retBean.authorImageUrl;
        var shareVisibility = res.data.retBean.shareVisibility;

        that.setData({
          likeNum: likeNum,
          readNum: readNum,
          commentNum: commentNum,
          contents: contents,
          comments: comments,
          commentNum: commentNum,
          createtime: createtime,
          weekStartDay: weekStartDay,
          weekEndDay: weekEndDay,
          organization: organization,
          title:title,
          toUserId: toUserId,
          isLike: isLike,
          isRead: isRead,
          visibility: visibility,
          author: author,
          authorImageUrl: authorImageUrl,
          shareVisibility: shareVisibility,
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

        //点了别人发的朋友消息自动加入组织
        if (wx.getStorageSync("scene") == 1044 || wx.getStorageSync("scene") == 1007) {
          console.log("进入转发后的onload页面，携带参数如下：")
          console.log(options.articleId)
          that.interestTap();
          //设置转发权限
          // console.log('userId:' + that.data.userId)
          // console.log(that.data.toUserId)
          // if (that.data.userId == that.data.toUserId) {
          //   console.log("同一个人")
          //   that.setData({
          //     isAllowShare: true,
          //   })
          // } else {
          //   console.log('权限设置')

          // }

          // that.interestTap();
          // if (that.data.shareVisibility == 0) {
          //   that.setData({
          //     isAllowShare: true,
          //   })
          // } else {
          //   that.setData({
          //     isAllowShare: false,
          //   })
          // }

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
            iconLike: "liked"
          })
        }
      },
    });

  },

  showReaders:function(e){
    let that = this;
    console.log(e)
    if (this.data.isShowReaders){
      this.setData({
        isShowReaders: false,
      })
    }else{
      this.setData({
        isShowReaders: true,
      });

      //获取浏览者的详细信息
      api.getReadersInfo({
        data: {
          articleId: that.data.articleId,
          actionType:"read",
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

  onChangeComment:function(res){
    console.log(res.detail.value)
    this.setData({
      comment: res.detail.value,
    })
  },

  bindconfirm:function(e){
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

  interestTap: function (e) {
    let that = this;
    var time = util.formatTime(new Date());
    // 向后台发送关注数据：关注者、被关注者、圈子、场景、关注时间
    api.postInterest({
      method: "POST",
      data: {
        userId: wx.getStorageSync("userId"),
        toUserId: that.data.toUserId,
        circle: 'work',
        scenario: 'weekly',
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

  likeTap:function(res){
    let that = this;
    var time = util.formatTime(new Date());
    if (that.data.isLike == 1 || that.data.iconLike == "liked") {
      res.preventDefault();
    }

      api.postAction({
        method: "POST",
        data: {
          userId: wx.getStorageSync("userId"),
          articleId: that.data.articleId,
          createtime: time,
          actionType: "like",
          scenario: 'weekly',
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
          circle: 'work',
          scenario: 'weekly',
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

      //临时添加 "点赞"显示在评论框中
    console.log("临时添加 点赞 显示在评论框中")
    console.log(that.data.userInfo)
      var commentItem = {
        headImageUrl: that.data.userInfo.avatarUrl,
        nickName: that.data.userInfo.nickName,
        content: '批准',
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

  sendTap:function(res){
    let that = this;
    //生成评论时间
    var time = util.formatTime(new Date());
    console.log(that.data.comment);


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
            comment:'',
            commentNum: that.data.commentNum + 1,
            currentComments: that.data.currentComments.concat(commentItem),
          })
        },
      })
    }

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      userId: wx.getStorageSync('userId'),
      nickName: wx.getStorageSync('userInfo').nickName,
    })
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
    let that = this;
    console.log("返回");
    var url = '../' + that.data.returnPage + '/' + that.data.returnPage;
    if (that.data.returnPage == "return to me") {
      // wx.switchTab({
      //   url: "../recommend/recommend"//这个是默认的单页
      // });

    } else if (that.data.returnPage) {
      // wx.redirectTo({
      //   url: url,
      // })
    }
    else if (that.data.articleId) {
      // wx.navigateTo({
      //   url: '../activityDetail/activityDetail?articleId=' + that.data.articleId,
      // })
    } else {
      // wx.reLaunch({
      //   url: "../recommend/recommend"//这个是默认的单页
      // });
    }

    // var pagelist = getCurrentPages();
    // console.log(pagelist);
    // var len = pagelist.length;
    // var init = 0;
    // var index = 0;
    // for (var i = 0; i < len; i++) {
    //   if (pagelist[i].route.indexOf("../recommend/recommend") >= 0) {//看路由里面是否有首页
    //     init = 1;
    //     index = i;
    //   }
    // }
    // if (init == 1) {
    //   wx.navigateBack({
    //     delta: len - i - 1
    //   });
    // } else {
    //   wx.reLaunch({
    //     url: "../recommend/recommend"//这个是默认的单页
    //   });
    // }
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
  onShareAppMessage: function (options) {
    let that = this;
    console.log('share按钮分享')
    wx.updateShareMenu({
      withShareTicket:true,
    })

    var articleId = this.data.articleId;
    if(this.data.userId == this.data.toUserId || this.data.shareVisibility == 0){
      console.log("有权限转发～")
      let obj = {
        title: that.data.title,
        path: '/pages/weeklyDetail/weeklyDetail?articleId=' + articleId,
        imgUrl:'',
      }
      return util.shareEvent(options, obj)
    }else{
      console.log("没有权限看哦～")
      wx.hideShareMenu();
      this.setData({
        shareVisibility:1,
      })
    }
  }
})

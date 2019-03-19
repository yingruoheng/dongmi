// pages/webArtDetail/webArtDetail.js
const WxParse = require('../../wxParse/wxParse.js');

// const md = require('./demo.md');
const util = require('../../utils/util.js');
const api = require('../../utils/api.js');
const app = getApp();
var recentUrl = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    md: "",
    userInfo: "",
    toUserId: '',
    userId: "",
    comments: [],
    likeNum: 0,
    iconInterest: 'interest',
    htmlUrl:"",
    title:"",
    headImageurl:"",
    username: "",
    createtime: '',
    articleId:0,
    scenario:"",
    circle:"",
    mdUrl:"",
    readNum: 0,
    likeNum: 0,
    commentNum: 0,
    comment:"",
    nickName:"",
    commentComplete:false,
    info:"",
    actionType:"",
    iconLike: 'like',
    organization: "",
    shareVisibility:1,
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
    console.log(options.mdUrl);
    var userId = wx.getStorageSync("userId");
    var articleId = options.articleId;
    if (userId == undefined || userId == null || userId == "") {
      wx.redirectTo({
        url: '../authorization/authorization?htmlUrl=' + options.htmlUrl + '&username=' + options.username + '&createtime=' + options.createtime + '&title=' + options.title + '&headimageurl=' + options.headimageurl + '&articleId=' + options.articleId + '&circle=' + options.circle + '&scenario=' + options.scenario + '&mdUrl=' + options.mdUrl,
      })
      // options.preventDefault();
    }
    that.setData({
      articleId: articleId,
    })

    if (options.page) {
      that.setData({
        returnPage: options.page
      })
    }

    that.setData({
      htmlUrl: options.htmlUrl,
      title: options.title,
      headimageurl: options.headimageurl,
      username: options.username,
      createtime: options.createtime,
      articleId: options.articleId,
      scenario: options.scenario,
      circle: options.circle,
      mdUrl: options.mdUrl,
    });
    console.log(that.data.mdUrl)
    that.getData(options.mdUrl);
    that.getComment(that.data.articleId);

    console.log(that.data.comments);

    var time = util.formatTime(new Date());
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
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      userId: wx.getStorageSync('userId'),
      nickName: wx.getStorageSync('userInfo').nickName,
    })
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

  likeTap: function (res) {
    let that = this;
    var time = util.formatTime(new Date());
    that.setData({
      likeNum: that.data.likeNum + 1,
      iconLike: 'liked',
    })
    if (this.data.isLike == 0) {
      api.postAction({
        method: "POST",
        data: {
          userId: wx.getStorageSync("userId"),
          articleId: that.data.articleId,
          createtime: time,
          actionType: "like",
        },
        success(res) {
          console.log(res);
          var result = res.data.retBean.result;
          if (result == 1) {
            that.setData({
              likeNum: that.data.likeNum + 1,
              iconLike: 'liked',
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
    }
  },

  /**
  * Called when user click on the top right corner to share
  */
  onShareAppMessage: function () {
    console.log('share')
    wx.updateShareMenu({
      withShareTicket: true,
    })
    if (this.data.userId == this.data.toUserId || this.data.shareVisibility == 1) {
      return {
        title: this.data.title,
        path: '../weeklyDetail/weeklyDetail?scenario=weekly&articleId=' + this.data.articleId + "&organization=" + this.data.organization + "&visibility=" + this.data.visibility,
        success: function (res) {

          var shareTickets = res.shareTickets;
          if (shareTickets.length == 0) {
            return false;
          }
          wx.getShareInfo({
            shareTicket: shareTickets[0],
            success: function (res) {
              var encryptedData = res.encryptedData;
              var iv = res.iv;
            }
          })
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } else {
      wx.hideShareMenu();
      this.setData({
        shareVisibility: 0,
      })
    }


  },

  getData: function (htmlUrl) {
    let that = this;
    console.log(htmlUrl)
    api.getMdArticle({
      data: {
        mdUrl: htmlUrl,
      },
      success: (res) => {
        if (res.data.retBean.length == 0)
          return;
        const posts = res.data.retBean;
        // console.log(posts);
        this.setData({
          md: posts,
        });
      },
    });
    // wx.request({
    //   url: htmlUrl,
    //   method: "GET",
    //   header: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   success: function (res) {
    //     const post = res.data;
    //     that.setData({
    //       post: post,
    //       md:post,
    //     })
    //     console.log(post);
    //     WxParse.wxParse('article', 'html', post, that, 5);
    //   }
    // });

  },

  getComment: function (articleId) {
    let that = this;
    console.log(articleId);
    api.getCommentsByArtId({
      data: {
        articleId: articleId,
      },
      success: (res) => {
        console.log(res)
        if (res.data.retBean.length == 0)
          return;
        const comments = res.data.retBean.comments;
        const readNum = res.data.retBean.readNum;
        const likeNum = res.data.retBean.likeNum;
        const commentNum = res.data.retBean.commentNum;
        this.setData({
          comments: comments,
          readNum: readNum,
          likeNum: likeNum,
          commentNum: commentNum,
        });
      },
    });
  },

})

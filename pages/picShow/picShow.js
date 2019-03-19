// page/test/test.js
Page({
  data: {
    //图片
    pics: [],
    contents:['','','','','','','','',''],
    //是否采用衔接滑动
    circular: true,
    //是否显示画板指示点
    indicatorDots: false,
    //选中点的颜色
    indicatorcolor: "#000",
    //是否竖直
    vertical: false,
    //是否自动切换
    autoplay: false,
    //滑动动画时长毫秒
    duration: 100,
    //所有图片的高度
    imgheights: [],
    //图片宽度
    height:0,
    //默认
    current: 0,
    num:0,
    content:'0',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var arr = JSON.parse(options.pics),
      map =this.data.map,
      pics = this.data.pics,
      num = options.index,
      contents = JSON.parse(options.contents),
      content = contents[num];
    pics = pics.concat(arr);
    console.log(content);

    if (content=='null') {
      console.log(content);
      console.log("内容为空")
      this.setData({
        content: ''
      })
    }
    this.setData({
      pics: pics,
      num: num,
      contents:contents,
      content:content,
    }) 
    
    var i = pics[0];
    console.log(typeof(content))
    console.log('content：' + content);
    console.log('我是pics：' + pics);
    console.log('我是索引：' + num);
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
  // imageLoad: function (e) {
  //   //获取图片真实宽度
  //   var imgwidth = e.detail.width,
  //     imgheight = e.detail.height,
  //     //宽高比
  //     ratio = imgwidth / imgheight;
  //   var num = this.data.num;
  //   var height= this.data.height;
  //   console.log(imgwidth, imgheight)
  //   //计算的高度值
  //   var viewHeight = 750 / ratio;
  //   var imgheight = viewHeight
  //   var imgheights = this.data.imgheights
  //   //把每一张图片的高度记录到数组里
  //   imgheights.push(imgheight);
  //   console.log(imgheights);
  //   console.log(typeof(num));
  //   var i = parseInt(num);
  //   console.log(typeof(i));
  //   this.setData({
  //     imgheights: imgheights,
  //     height: imgheights[i]
  //   })
  //   console.log(height)
  // },
  imageLoad: function (e) {
    console.log('进来了');
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
      var num = this.data.num;
    console.log(imgwidth, imgheight)
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights.push(imgheight)
    console.log(imgheights)
    this.setData({
      imgheights: imgheights,
      height: 1333
    })
  },
  bindchange: function (e) {
    var contents =this.data.contents,
    content = this.data.content,
    imgheights = this.data.imgheights,
    height = this.data.height,
    i = e.detail.current;
    var str;
    this.setData({ 
      current: e.detail.current,
      num: e.detail.current,
      content: contents[i],
      // height: imgheights[i]
       })
       console.log(height);
  },
  detail:function(){
    wx:wx.navigateTo({
      url: '../picDetail/picDetail',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  btntap:function(e){
    console.log(e.detail.current)
  }
})
// page/test/test.js
Page({
  data: {
    //图片
    pics: [],
    content: '',
    //是否采用衔接滑动
    circular: true,
    //是否显示画板指示点
    indicatorDots: false,
    indicatorcolor: "#000",
    //是否竖直
    vertical: false,
    //是否自动切换
    autoplay: false,
    //滑动动画时长毫秒
    duration: 100,
    //所有图片的高度
    imgheights: [],
    //图片高度
    height:0,
    current: 0,
    num: '',
    keys:[],
    imgs:[],
    obj:{},
    title:'',
    organization:'',
    isShow:'',
    contents:['','','','','','','','',''],
    visibility:0,
    shareVisibility:0,
    cons:[],
    pre:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var arr = JSON.parse(options.pics),
      pics = this.data.pics,
      num = this.data.num,
      imgs = this.data.imgs,
      organization = options.organization,
      isShow = options.isShow,
      title = options.title,
      contents = JSON.parse(options.contents),
      cons = JSON.parse(options.contents),
      visibility = options.visibility,
      shareVisibility = options.shareVisibility,
      pics = pics.concat(arr);

    console.log(contents);
    for (var i = 0; i <= arr.length - 1; i++) {
      var filePath = arr[i]
      var picUrl = "https://yunji-1255930917.cos-website.ap-beijing.myqcloud.com/" + filePath.substr(filePath.lastIndexOf('/') + 1);
    imgs = imgs.concat(picUrl);
    }
    this.setData({
      pics: pics,
      num: options.index,
      imgs:imgs,
      title: title,
      organization: organization,
      isShow:isShow,
      visibility: visibility,
      shareVisibility:shareVisibility,
      cons:cons,
    })
    if(cons.length>0){
      this.setData({
        content:cons[0]
      })
    }
    console.log(cons);
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
    var obj = this.data.obj;
    var pics = this.data.pics;
    var imgs = this.data.imgs;
    var title = this.data.title;
    var organization = this.data.organization;
    var isShow = this.data.isShow;
    var visibility = this.data.visibility;
    var shareVisibility = this.data.shareVisibility;
    var content = this.data.content;
    var contents = this.data.contents;
    if(pics.length==1){
      obj[imgs[0]]=content;
      contents[0]=content;
    }
    console.log(isShow);
    // wx.navigateTo({
    //   url: '../pic/pic?obj=' + JSON.stringify(obj) + '&imgs=' + JSON.stringify(imgs) + '&pics=' + JSON.stringify(pics) + '&title=' + title + '&organization=' + organization + '&isShow=' + isShow + '&visibility=' + visibility + '&contents=' + JSON.stringify(contents)+'&shareVisibility='+shareVisibility
    // })
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
  imageLoad: function (e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight
    var imgheights = this.data.imgheights
    //把每一张图片的高度记录到数组里
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
      height: imgheights[0]
    })
  },
  bindchange: function (e) {
    var obj = this.data.obj;
    var pics = this.data.pics;
    var keys = this.data.keys;
    var content = this.data.content;
    var contents =this.data.contents;
    var cons = this.data.cons;
    var imgs = this.data.imgs;
    var pre = this.data.pre;
    var key;
    var imgheights = this.data.imgheights;
    var height = this.data.height;
    contents[pre] = content;
    content= contents[e.detail.current];
    console.log(contents)
    obj[imgs[pre]] = contents[pre];
    console.log(obj);
    this.setData({
      pre: e.detail.current,
      content:content,
      contents:contents,
      height: imgheights[e.detail.current]
    })
    
    // if (e.detail.current - 1>-1){
    //   key = e.detail.current - 1;
    // }else{
    //   key = pics.length-1;
    // }
    // console.log(key);
    // console.log(e.detail.current)
    // console.log(e.detail.source)
    // console.log(contents[e.detail.current] != content);
    // if (keys.indexOf(e.detail.current) == -1){
    //   keys.push(e.detail.current);
    //   contents.push(content);
    // } else if(contents[e.detail.current] != content){
    //   contents.splice(e.detail.current-1, 1, content);
    // }
    // this.setData({
    //   current: e.detail.current,
    //   obj:obj,
    //   content:''
    // });
    if (contents[e.detail.current]!=null){
      this.setData({
        content: contents[e.detail.current]
      })
    }
    if (cons[e.detail.current] != null) {
      console.log(cons[e.detail.current])
      this.setData({
        content: cons[e.detail.current]
      })
    }
    console.log(imgheights[e.detail.current])
  },
  
  slid:function(res){
    console.log(res.detail)
    this.setData({
      content: res.detail
    })
  }
})
// pages/mapDes/mapDes.js
Page({

  /**
   * Page initial data
   */
  data: {
    markers: [],
    polyline: [],
    controls: [],
    latitude: '',
    longitude: '',
    address:'',
  },

  //请求地理位置
  requestLocation: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.openLocation({
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          name: that.data.address,
          scale: 28
        })
      },
    })
  },

  launchAppError(e) {
    console.log(e.detail.errMsg)
  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    var latitude = parseFloat(options.latitude);
    var longitude = parseFloat(options.longitude);
    var address = options.address;

    this.setData({
      latitude: latitude,
      longitude: longitude,
      address: address,
    });

    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      name: address,
    })
    // this.requestLocation();
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     wx.openLocation({
    //       latitude: latitude,
    //       longitude: longitude,
    //       name: address,
    //       scale: 28
    //     })
    //   },
    // })

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {
    console.log("onshow")
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
  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
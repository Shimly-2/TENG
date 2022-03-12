// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    textLog: "",
    isopen: false, //蓝牙适配器是否已打开
    devices: [],
    connected: false,
    chs: [],
    PageCur: 'basics'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: 'ColorUI-高颜值的小程序UI组件库',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  }
})
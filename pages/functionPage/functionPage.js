// pages/funtionPage/funtionPage.js
var app = getApp();
var utils = require("../../utils/util.js");
var indicate=false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textLog:"",
    deviceId: "",
    name: "",
    allRes:"",
    serviceId:"",
    readCharacteristicId:"",
    writeCharacteristicId: "",
    notifyCharacteristicId: "",
    connected: true,
    canWrite: false,
    maxvalue_ADC:0.000,
    Amplitude_ADC:0.000,
    Freq_ADC:0.000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var devid = decodeURIComponent(options.deviceId);
    var devname = decodeURIComponent(options.name);
    var devserviceid = decodeURIComponent(options.serviceId);
    var log = that.data.textLog + "设备名=" + devname +"\n设备UUID="+devid+"\n服务UUID="+devserviceid+ "\n";
    this.setData({
      textLog: log,
      deviceId: devid,
      name: devname,
      serviceId: devserviceid 
    });
    //获取特征值
    that.getBLEDeviceCharacteristics();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.setKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: true,
        success: function (res) {
          //console.log('保持屏幕常亮')
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  //清空log日志
  startClear: function () {
    var that = this;
    that.setData({
      textLog: ""
    });
  },

  //点击设置最大MTU
  setMTUClick:function(){
    var that = this;
    that.setMaxMTU();
  },

  startIndicate:function(){
    var that = this;
    indicate=!indicate;
    that.notifyBLECharacteristicValueChange(indicate);
  },

  //返回蓝牙是否正处于链接状态
  onBLEConnectionStateChange:function (onFailCallback) {
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
      return res.connected;
    });
  },
  //断开与低功耗蓝牙设备的连接
  closeBLEConnection: function () {
    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.deviceId
    })
    that.setData({
      connected: false,

    });
    wx.showToast({
      title: '连接已断开',
      icon: 'success'
    });
    setTimeout(function () {
      wx.navigateBack();
    }, 2000)
  },
  //获取蓝牙设备某个服务中的所有 characteristic（特征值）
  getBLEDeviceCharacteristics: function (order){
    var that = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      success: function (res) {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {//该特征值是否支持 read 操作
            var log = that.data.textLog + "该特征值支持 read 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              readCharacteristicId: item.uuid
            });
          }
          if (item.properties.write) {//该特征值是否支持 write 操作
            var log = that.data.textLog + "该特征值支持 write 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              writeCharacteristicId: item.uuid,
              canWrite:true
            });
            
          }
          if (item.properties.notify || item.properties.indicate) {//该特征值是否支持 notify或indicate 操作
            var log = that.data.textLog + "该特征值支持 notify 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              notifyCharacteristicId: item.uuid,
            });
            that.notifyBLECharacteristicValueChange();
          }

        }

      }
    })
    // that.onBLECharacteristicValueChange();   //监听特征值变化
  },
  //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
  //注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性
  notifyBLECharacteristicValueChange: function (hhh){
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: hhh, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.notifyCharacteristicId,
      success: function (res) {
        var log = that.data.textLog + "notify启动成功" + res.errMsg+"\n";
        that.setData({ 
          textLog: log,
        });
        that.onBLECharacteristicValueChange();   //监听特征值变化
      },
      fail: function (res) {
        wx.showToast({
          title: 'notify启动失败',
          mask: true
        });
        setTimeout(function () {
          wx.hideToast();
        }, 2000)
      }

    })

  },
  //监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
  onBLECharacteristicValueChange:function(){
    var that = this;
    wx.onBLECharacteristicValueChange(function (res) {
      // var resValue = utils.ab2hext(res.value); //16进制字符串
      // console.log('characteristic value comed(buf):', res.value[0],res.value[1]);
      // console.log('characteristic value comed(hex):', utils.buf2hex(res.value))
      f32 = new Float32Array(res.value);
      console.log('f32:', f32[0],f32[1],f32[2]);
      var maxvalue_ADC1=f32[0].toFixed(2);
      var Amplitude_ADC1=f32[1].toFixed(2);
      var Freq_ADC1=f32[2].toFixed(2);
      console.log('var:', maxvalue_ADC1,Amplitude_ADC1,Freq_ADC1);
      var resValue = utils.uint2float(f32); //16进制字符串
      console.log('thisd', resValue);
      var resValueStr = utils.hexToString(resValue);
  
      var log0 = that.data.textLog + "成功获取：" + resValueStr + "\n";
      that.setData({
        textLog: log0,
        maxvalue_ADC: maxvalue_ADC1,
        Amplitude_ADC: Amplitude_ADC1,
        Freq_ADC: Freq_ADC1
      });

    });
  },
  //orderInput
  orderInput:function(e){
    this.setData({
      orderInputStr: e.detail.value
    })
  },

  //发送指令
  sentOrder:function(){
    var that = this; 
    var orderStr = that.data.orderInputStr;//指令
    let order = utils.stringToBytes(orderStr);
    that.writeBLECharacteristicValue(order);
  },

  //向低功耗蓝牙设备特征值中写入二进制数据。
  //注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性
  writeBLECharacteristicValue: function (order){
    var that = this;
    let byteLength = order.byteLength;
    console.log("order:",order);
    // u8 = new Uint8Array(order);
    // console.log("order2:",u8[0]);
    // if (typeof order === 'string') {
    //   order = utils.str2ab(order);
    //   console.log("order2:",order);
    // } else {
    //   order = utils.ab2hext(order);
    //   console.log("order2:",order);
    // }
    var log = that.data.textLog + "当前执行指令的字节长度:" + byteLength + "\n";
    that.setData({
      textLog: log,
    });

    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.writeCharacteristicId,
      // 这里的value是ArrayBuffer类型
      // value: order.slice(0, 20),
      value:order,
      success: function (res) {
        // if (byteLength > 20) {
        //   setTimeout(function(){
        //     // that.writeBLECharacteristicValue(order.slice(20, byteLength));
        //   },150);
        // }
        var log = that.data.textLog + "写入成功：" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
      },

      fail: function (res) {
        var log = that.data.textLog + "写入失败" + res.errMsg+"\n";
        that.setData({
          textLog: log,
        });
      }
      
    })
  },

  //设置最大MTU
  //设置蓝牙最大传输单元。需在 wx.createBLEConnection调用成功后调用，mtu 设置范围 (22,512)。安卓5.1以上有效。
  setMaxMTU:function(){
    var that = this;
    wx.setBLEMTU({
      deviceId: that.data.deviceId,
      mtu: 512,
      success:(res)=>{
        console.log("setBLEMTU success>>", res)
        var log = that.data.textLog + "设置最大MTU成功：res=" +JSON.stringify(res)+"\n";
        that.setData({
          textLog: log,
        });

      },
      fail:(res)=>{
        console.log("setBLEMTU fail>>", res)
        var log = that.data.textLog + "设置最大MTU失败：res=" +JSON.stringify(res)+"\n";
        that.setData({
          textLog: log,
        });
      }
    })
  }

  

})
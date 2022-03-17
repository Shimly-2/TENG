const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    elements: [{
        title: '智能',
        name: 'Intelligence',
        color: 'red',
        icon: 'newsfill'
      },
      {
        title: '低碳',
        name: 'Low-carbon',
        color: 'orange',
        icon: 'colorlens'
      },
      {
        title: '环保',
        name: 'Environmental',
        color: 'yellow',
        icon: 'font'
      },
      {
        title: '高效 ',
        name: 'High-efficiency',
        color: 'mauve',
        icon: 'icon'
      },
      // {
      //   title: '按钮',
      //   name: 'button',
      //   color: 'pink',
      //   icon: 'btn'
      // },
      // {
      //   title: '标签',
      //   name: 'tag',
      //   color: 'brown',
      //   icon: 'tagfill'
      // },
      // {
      //   title: '头像',
      //   name: 'avatar',
      //   color: 'red',
      //   icon: 'myfill'
      // },
      // {
      //   title: '进度条',
      //   name: 'progress',
      //   color: 'orange',
      //   icon: 'icloading'
      // },
      // {
      //   title: '边框阴影',
      //   name: 'shadow',
      //   color: 'olive',
      //   icon: 'copy'
      // },
      // {
      //   title: '加载',
      //   name: 'loading',
      //   color: 'green',
      //   icon: 'loading2'
      // },
    ],
  },
  isLoading (e) {
    this.setData({
      isLoad: e.detail.value
    })
  },
  loadModal () {
    this.setData({
      loadModal: true
    })
    setTimeout(()=> {
      this.setData({
        loadModal: false
      })
    }, 2000)
  },
  loadProgress(){
    this.setData({
      loadProgress: this.data.loadProgress+3
    })
    if (this.data.loadProgress<100){
      setTimeout(() => {
        this.loadProgress();
      }, 100)
    }else{
      this.setData({
        loadProgress: 0
      })
    }
  }
})
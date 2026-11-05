Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    /**
     * 展现模式:
     * - 'card': 卡片容器，通用圆角与双层折射阴影
     * - 'nav': 导航栏/浮动 Dock 栏，扁平高通透
     * - 'modal': 弹窗/浮层，高模糊深度与沉浸感阴影
     * - 'button': 胶囊/按钮，紧凑与高弹性反馈
     */
    mode: {
      type: String,
      value: 'card'
    },
    // 是否开启顶部流光边缘折射色散高光 (模拟 feDisplacementMap 色差光斑)
    specular: {
      type: Boolean,
      value: true
    },
    // 是否开启按压流体弹性微形变与反光反馈
    interactive: {
      type: Boolean,
      value: false
    },
    customClass: {
      type: String,
      value: ''
    },
    customStyle: {
      type: String,
      value: ''
    }
  },
  methods: {
    onTap(e) {
      this.triggerEvent('tap', e);
    }
  }
});

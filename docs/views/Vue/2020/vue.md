---
title: Vue 基础知识整理
date: 2018-04-20
tags:
 - Vue
categories:
 -  Vue
---

![img](https://cn.vuejs.org/images/lifecycle.png)

## 创建Vue实例

每个 Vue 应用都是通过用 `Vue` 函数创建一个新的 **Vue 实例**开始的：

```
var vm = new Vue({
  el: '#app',
  data: {
    
  },
  mounted: function () {
    
  },
  methods: {
    // 钩子函数
  }
})
```



## vue有8种生命周期函数：

| 钩子函数       | 触发的行为                                                   | 作用                                                |
| -------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| beforeCreadted | vue实例的挂载元素$el和数据对象data都为undefined，还未初始化  | 加loading事件                                       |
| created        | vue实例的数据对象data有了，$el还没有                         | 结束loading、请求数据为mounted渲染做准备            |
| beforeMount    | vue实例的$el和data都初始化了，但还是虚拟的dom节点，具体的data.filter还未替换 | ..                                                  |
| mounted        | vue实例挂载完成，data.filter成功渲染                         | 配合路由钩子使用                                    |
| beforeUpdate   | data更新时触发                                               | ..                                                  |
| updated        | data更新时触发                                               | 数据更新时，做一些处理（此处也可以用watch进行观测） |
| beforeDestroy  | 组件销毁时触发                                               |                                                     |
| destroyed      | 组件销毁时触发，vue实例解除了事件监听以及和dom的绑定（无响应了），但DOM节点依旧存在 | 组件销毁时进行提示                                  |

**父组件准备要挂载还没挂载的时候，子组件先完成挂载，最后父组件再挂载**
---
title: vuex的使用
date: 2019-08-22
tags:
 - Vue
categories:
 -  Vue
---

**什么是Vuex？**

**官方说法**：Vuex 是一个专为 Vue.js应用程序开发的状态管理模式。它采用集中式存储管理应用的**所有组件的状态**，并以相应的规则保证状态以一种可预测的方式发生变化。

**个人理解**：Vuex是用来管理组件之间通信的一个插件

**为什么要用Vuex？**

　组件之间是独立的，组件之间想要实现通信，我目前知道的就只有props选项，但这也仅限于父组件和子组件之间的通信。如果兄弟组件之间想要实现通信呢？方法应该有。抛开怎么实现的问题，试想一下，当做中大型项目时，面对一大堆组件之间的通信，还有一大堆的逻辑代码，会很苦恼，此时我们应该吧组件之间共享的数据给拿出来，在规则下来管理这些数据，这就是Vuex的基本思想

**VueX的使用**

首先需要下载 vuex

```
npm i -S vuex
```

然后在src文件目录下新建一个名为store的文件夹，为方便引入并在store文件夹里新建一个index.js，里面的内容如下：

```
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store();  
export default store;
```

接下来，在main.js里面引入store，然后再全局注入一下，这样一来就可以在任何一个组件里面使用this.$store了：

```
import store from './store'//引入store
  
new Vue({
  el: '#app',
  router,
  store,//使用store
  template: '<App/>',
  components: { App }
})
```

再接下来vuex 的核心来了，vuex的五大核心---state，getter，mutation，action，module

state就是一个数据仓库，存放数据的，

回到store文件的indexjs里面，我们先声明一个state变量,并赋值一个空对象给它，里面随便定义两个初始属性值;然后再在实例化的Vuex.Store里面传入一个空对象，并把刚声明的变量state仍里面: 

```
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = { //要设置的全局访问的state对象
  showFooter: true,
  changableNum: 0
  //要设置的初始属性值
};
const store = new Vuex.Store({
  state
});
 
export default store;
```

现在你已经可以使用this.$store.state.showFooter和this.$store.state.changebleNum在任何一个组件里面获取showFooter和changebleNum的值。但这不是很完美的方法，vuex官方API提供了一个getters属性，和vue计算属性computed一样，来实时监听state值的变化，并把它扔进Vuex.Store里面，具体如此：

```
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const state = { //要 设置的全局访问的state对象
  showFooter: true,
  changableNum: 0
  //要设置的初始属性值
};
const getters = { //实时 监听state值的变化(最新状态)
  isShow(state) { //方法名随意,主要 是来承载变化的showFooter的值
    return state.showFooter
    //在组件中可以用 this.$store.getters.isShow 来获取它的return值
  },
  getChangedNum() {
    // 方法名随意, 主要是用来承载变化的changableNum的值
    return state.changableNum
    //在组件中可以用 this.$store.getters.getChangedNum 来获取它的return值
  }
}
const store = new Vuex.Store({
  state,
  getters
});
export default store;
```

光有定义的state的初始值，不改变它不是我们想要的需求，接下来要说的就是mutations了，mutattions也是一个对象，这个对象里面可以放改变state的初始值的方法，具体的用法就是给里面的方法传入参数state或额外的参数，然后利用vue的双向数据驱动进行值的改变,同样的定义好之后也把这个mutations扔进Vuex.Store里面，如下:

```
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
 const state={   //要设置的全局访问的state对象
     showFooter: true,
     changableNum:0
     //要设置的初始属性值
   };
const getters = {   //实时监听state值的变化(最新状态)
    isShow(state) {  //承载变化的showFooter的值
       return state.showFooter
    },
    getChangedNum(){  //承载变化的changebleNum的值
       return state.changableNum
    }
};
const mutations = {
    show(state) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        state.showFooter = true;
    },
    hide(state) {  //同上
        state.showFooter = false;
    },
    newNum(state,sum){ //同上，这里面的参数除了state之外还传了需要增加的值sum
       state.changableNum+=sum;
    }
};
 const store = new Vuex.Store({
       state,
       getters,
       mutations
});
export default store;
```

这时候你完全可以用this. $store.commit('show)或this. $store.commit("hide')以及this. $store. commit("newNum',6)在别的组件里面进行改变showfooter和changebleNum的值了,这不是理想的改变值的方式;因为在Vuex中，mutations里面的方法都是同步事务，意思就是说:比如这里的一个this.$store.commit( newNum' sum)方法,两个组件里用执行得到的值，每次都是一样的,这样肯定不是理想的需求。

好在vuex官方API还提供了一个actions,这个actions也是个对象变量,最大的作用就是面的Action方法
可以包含任意异步操作,这里面的方法是睐异步触发mutations里面的方法，actions里面自定 义的函数接
收一个context参数和要变化的形参, context 与store实例具有相同的方法和属性,所以它可以执行
context.commit(' ")，然后也不要忘了把它也扔进Vuex.Store里面

```
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
 const state={   //要设置的全局访问的state对象
     showFooter: true,
     changableNum:0
     //要设置的初始属性值
   };
const getters = {   //实时监听state值的变化(最新状态)
    isShow(state) {  //承载变化的showFooter的值
       return state.showFooter
    },
    getChangedNum(){  //承载变化的changebleNum的值
       return state.changableNum
    }
};
const mutations = {
    show(state) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        state.showFooter = true;
    },
    hide(state) {  //同上
        state.showFooter = false;
    },
    newNum(state,sum){ //同上，这里面的参数除了state之外还传了需要增加的值sum
       state.changableNum+=sum;
    }
};
 const actions = {
    hideFooter(context) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
        context.commit('hide');
    },
    showFooter(context) {  //同上注释
        context.commit('show');
    },
    getNewNum(context,num){   //同上注释，num为要变化的形参
        context.commit('newNum',num)
     }
};
  const store = new Vuex.Store({
       state,
       getters,
       mutations,
       actions
});
export default store;
```

而在外部组件里进行全局执行actions里面方法的时候，你只需要用执行

this.$store.dispatch('hideFooter')

或this.$store.dispatch('showFooter')

以及this.$store.dispatch('getNewNum'，6) //6要变化的实参

这样就可以全局改变改变showfooter或changebleNum的值了，如下面的组件中,需求是跳转组件页面后，根据当前所在的路由页面进行隐藏或显示页面底部的tab选项卡

```
<template>
  <div id="app">
    <router-view/>
    <FooterBar v-if="isShow" />
  </div>
</template>
 
<script>
import FooterBar from '@/components/common/FooterBar'
import config from './config/index'
export default {
  name: 'App',
  components:{
    FooterBar:FooterBar
  },
  data(){
    return {
    }
  },
  computed:{
     isShow(){
       return this.$store.getters.isShow;
     }
  },
  watch:{
      $route(to,from){ //跳转组件页面后，监听路由参数中对应的当前页面以及上一个页面
          console.log(to)
        if(to.name=='book'||to.name=='my'){ // to.name来获取当前所显示的页面，从而控制该显示或隐藏footerBar组件
           this.$store.dispatch('showFooter') // 利用派发全局state.showFooter的值来控制        }else{
           this.$store.dispatch('hideFooter')
        }
      }
  }
}
</script>
        }else{
           this.$store.dispatch('hideFooter')
        }
      }
  }
}
</script>
```
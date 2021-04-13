---
title: Vue or React
date: 2021-04-06
tags:
 - JavaScript
categories:
 -  JavaScript
---

# **Vue**

## **vue2.0**组件通信⽅式有哪些？

⽗⼦组件通信：

```
props` 和 `event`、`v-model`、 `.sync`、 `ref`、 `$parent` 和 `$children
```

⾮⽗⼦组件通信：

```
$attr` 和 `$listeners`、 `provide` 和 `inject`、`eventbus`、通过根实例`$root`访问、
`vuex`、`dispatch` 和 `brodcast
```

## **v-model**是如何实现双向绑定的？

### vue 2.0

v-model 是⽤来在表单控件或者组件上创建双向绑定的，他的本质是 v-bind 和 v-on 的语法糖，在

⼀个组件上使⽤ v-model ，默认会为组件绑定名为 value 的 prop 和名为 input 的事件

### Vue3.0

在 3.x 中，⾃定义组件上的 v-model 相当于传递了 modelValue prop 并接收抛出的

update:modelValue 事件

## **Vuex**和单纯的全局对象有什么区别？

Vuex和全局对象主要有两⼤区别：

1. Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发⽣变

   化，那么相应的组件也会相应地得到⾼效更新。

2. 不能直接改变 store 中的状态。改变 store 中的状态的唯⼀途径就是显式地提交 (commit)

   mutation。这样使得我们可以⽅便地跟踪每⼀个状态的变化，从⽽让我们能够实现⼀些⼯具帮助

   我们更好地了解我们的应⽤。

## **Vue** 的⽗组件和⼦组件⽣命周期钩⼦执⾏顺序是什么？

### 渲染过程：

⽗组件挂载完成⼀定是等⼦组件都挂载完成后，才算是⽗组件挂载完，所以⽗组件的mounted在⼦组

件mouted之后

⽗beforeCreate -> ⽗created -> ⽗beforeMount -> ⼦beforeCreate -> ⼦created -> ⼦beforeMount

-> ⼦mounted -> ⽗mounted

### ⼦组件更新过程：

1. 影响到⽗组件： ⽗beforeUpdate -> ⼦beforeUpdate->⼦updated -> ⽗updted
2. 不影响⽗组件： ⼦beforeUpdate -> ⼦updated

### ⽗组件更新过程：

1. 影响到⼦组件： ⽗beforeUpdate -> ⼦beforeUpdate->⼦updated -> ⽗updted
2. 不影响⼦组件： ⽗beforeUpdate -> ⽗updated

## 销毁过程：

⽗beforeDestroy -> ⼦beforeDestroy -> ⼦destroyed -> ⽗destroyed

看起来很多好像很难记忆，其实只要理解了，不管是哪种情况，都⼀定是⽗组件等待⼦组件完成后，才

会执⾏⾃⼰对应完成的钩⼦，就可以很容易记住

## **v-show** 和 **v-if** 有哪些区别？

v-if 会在切换过程中对条件块的事件监听器和⼦组件进⾏销毁和重建，如果初始条件是false，则什么

都不做，直到条件第⼀次为true时才开始渲染模块。

v-show 只是基于css进⾏切换，不管初始条件是什么，都会渲染。

所以， v-if 切换的开销更⼤，⽽ v-show 初始化渲染开销更⼤，在需要频繁切换，或者切换的部分

dom很复杂时，使⽤ v-show 更合适。渲染后很少切换的则使⽤ v-if 更合适。

## **computed** 和 **watch** 有什么区别？

computed 计算属性，是依赖其他属性的计算值，并且有缓存，只有当依赖的值变化时才会更新。

watch 是在监听的属性发⽣变化时，在回调中执⾏⼀些逻辑。

所以， computed 适合在模板渲染中，某个值是依赖了其他的响应式对象甚⾄是计算属性计算⽽来，

⽽ watch 适合监听某个值的变化去完成⼀段复杂的业务逻辑。

## **Vue** 中的 **computed** 是如何实现的?

流程总结如下：

1. 当组件初始化的时候， computed 和 data 会分别建⽴各⾃的响应系统， Observer 遍历 data

   中每个属性设置 get/set 数据拦截

2. 初始化 computed 会调⽤ initComputed 函数

   1. 注册⼀个 watcher 实例，并在内实例化⼀个 Dep 消息订阅器⽤作后续收集依赖（⽐如渲染函数的 watcher 或者其他观察该计算属性变化的 watcher ）

   2. 调⽤计算属性时会触发其 Object.defineProperty 的 get 访问器函数

   3. 调⽤ watcher.depend() ⽅法向⾃身的消息订阅器 dep 的 subs 中添加其他属性的

      watcher

   4. 调⽤ watcher 的 evaluate ⽅法（进⽽调⽤ watcher 的 get ⽅法）让⾃身成为其他

      watcher 的消息订阅器的订阅者，⾸先将 watcher 赋给 Dep.target ，然后执⾏ getter

      求值函数，当访问求值函数⾥⾯的属性（⽐如来⾃ data 、 props 或其他 computed ）时，

      会同样触发它们的 get 访问器函数从⽽将该计算属性的 watcher 添加到求值函数中属性的

      watcher 的消息订阅器 dep 中，当这些操作完成，最后关闭 Dep.target 赋为 null 并

      返回求值函数结果。

3. 当某个属性发⽣变化，触发 set 拦截函数，然后调⽤⾃身消息订阅器 dep 的 notify ⽅法，遍

   历当前 dep 中保存着所有订阅者 wathcer 的 subs 数组，并逐个调⽤ watcher 的 update ⽅

   法，完成响应更新。

## **Vue** 中 **v-html** 会导致什么问题

在⽹站上动态渲染任意 HTML，很容易导致 XSS 攻击。所以只能在可信内容上使⽤ v-html，且永远不

能⽤于⽤户提交的内容上。

## **Vue** 的响应式原理

Vue 的响应式是通过 Object.defineProperty 对数据进⾏劫持，并结合观察者模式实现。 Vue 利⽤

Object.defineProperty 创建⼀个 observe 来劫持监听所有的属性，把这些属性全部转为 getter

和 setter 。Vue 中每个组件实例都会对应⼀个 watcher 实例，它会在组件渲染的过程中把使⽤过的

数据属性通过 getter 收集为依赖。之后当依赖项的 setter 触发时，会通知 watcher ，从⽽使它关

联的组件重新渲染。

### **Object.defifineProperty**有哪些缺点？

1. Object.defineProperty 只能劫持对象的属性，⽽ Proxy 是直接代理对象

   由于 Object.defineProperty 只能对属性进⾏劫持，需要遍历对象的每个属性。⽽ Proxy 可

   以直接代理对象。

2. Object.defineProperty 对新增属性需要⼿动进⾏ Observe ， 由于

   Object.defineProperty 劫持的是对象的属性，所以新增属性时，需要重新遍历对象，对其新

   增属性再使⽤ Object.defineProperty 进⾏劫持。 也正是因为这个原因，使⽤ Vue 给 data

   中的数组或对象新增属性时，需要使⽤ vm.$set 才能保证新增的属性也是响应式的。

3. Proxy ⽀持13种拦截操作，这是 defineProperty 所不具有的。

4. 新标准性能红利Proxy 作为新标准，⻓远来看，JS引擎会继续优化 Proxy ，但 getter 和 setter 基本不会再

   有针对性优化。

5. Proxy 兼容性差 ⽬前并没有⼀个完整⽀持 Proxy 所有拦截⽅法的Polyfifill⽅案

## **Vue2.0**中如何检测数组变化？

Vue 的 Observer 对数组做了单独的处理，对数组的⽅法进⾏编译，并赋值给数组属性的 __proto__

属性上，因为原型链的机制，找到对应的⽅法就不会继续往上找了。编译⽅法中会对⼀些会增加索引的

⽅法（ push ， unshift ， splice ）进⾏⼿动 observe。

## **nextTick**是做什么⽤的，其原理是什么**?**

能回答清楚这道问题的前提，是清楚 EventLoop 过程。

在下次 DOM 更新循环结束后执⾏延迟回调，在修改数据之后⽴即使⽤ nextTick 来获取更新后的

DOM。

nextTick 对于 micro task 的实现，会先检测是否⽀持 Promise ，不⽀持的话，直接指向 macro

task，⽽ macro task 的实现，优先检测是否⽀持 setImmediate （⾼版本IE和Etage⽀持），不⽀持的

再去检测是否⽀持 MessageChannel，如果仍不⽀持，最终降级为 setTimeout 0；

默认的情况，会先以 micro task ⽅式执⾏，因为 micro task 可以在⼀次 tick 中全部执⾏完毕，在⼀

些有重绘和动画的场景有更好的性能。

但是由于 micro task 优先级较⾼，在某些情况下，可能会在事件冒泡过程中触发，导致⼀些问题，所

以有些地⽅会强制使⽤ macro task （如 v-on ）。

注意：之所以将 nextTick 的回调函数放⼊到数组中⼀次性执⾏，⽽不是直接在 nextTick 中执⾏回

调函数，是为了保证在同⼀个tick内多次执⾏了 nextTcik ，不会开启多个异步任务，⽽是把这些异步

任务都压成⼀个同步任务，在下⼀个tick内执⾏完毕。

## **Vue** 的模板编译原理

 vue模板的编译过程分为3个阶段：

第⼀步：解析

将模板字符串解析⽣成 AST，⽣成的AST 元素节点总共有 3 种类型，1 为普通元素， 2 为表达式，3为

纯⽂本。

第⼆步：优化语法树

 Vue 模板中并不是所有数据都是响应式的，有很多数据是⾸次渲染后就永远不会变化的，那么这部分数

据⽣成的 DOM 也不会变化，我们可以在 patch 的过程跳过对他们的⽐对。

此阶段会深度遍历⽣成的 AST 树，检测它的每⼀颗⼦树是不是静态节点，如果是静态节点则它们⽣成

DOM 永远不需要改变，这对运⾏时对模板的更新起到极⼤的优化作⽤。

⽣成代码:

```
const code = generate(ast, options)
```

通过 generate ⽅法，将ast⽣成 render 函数。

## **v-for** 中 **key** 的作⽤是什么？

key 是给每个 vnode 指定的唯⼀ id ，在同级的 vnode diffff 过程中，可以根据 key 快速的对⽐，

来判断是否为相同节点，并且利⽤ key 的唯⼀性可以⽣成 map 来更快的获取相应的节点。

另外指定 key 后，就不再采⽤“就地复⽤”策略了，可以保证渲染的准确性。

## 为什么 **v-for** 和 **v-if** 不建议⽤在⼀起

当 v-for 和 v-if 处于同⼀个节点时， v-for 的优先级⽐ v-if 更⾼，这意味着 v-if 将分别重复

运⾏于每个 v-for 循环中。如果要遍历的数组很⼤，⽽真正要展示的数据很少时，这将造成很⼤的性

能浪费。

这种场景建议使⽤ computed ，先对数据进⾏过滤。

## **vue-router hash** 模式和 **history** 模式有什么区别？

区别：

1. url 展示上，hash 模式有“#”，history 模式没有

2. 刷新⻚⾯时，hash 模式可以正常加载到 hash 值对应的⻚⾯，⽽ history 没有处理的话，会返回

   404，⼀般需要后端将所有⻚⾯都配置重定向到⾸⻚路由。

3. 兼容性。hash 可以⽀持低版本浏览器和 IE。

## **vue-router hash** 模式和 **history** 模式是如何实现的？

1. hash 模式：

   \# 后⾯ hash 值的变化，不会导致浏览器向服务器发出请求，浏览器不发出请求，就不会刷新⻚

   ⾯。同时通过监听 hashchange 事件可以知道 hash 发⽣了哪些变化，然后根据 hash 变化来实现

   更新⻚⾯部分内容的操作。

2. history 模式：

   history 模式的实现，主要是 HTML5 标准发布的两个 API， pushState 和 replaceState ，这

   两个 API 可以在改变 url，但是不会发送请求。这样就可以监听 url 变化来实现更新⻚⾯部分内容

   的操作。

## **vue** 中组件 **data** 为什么是 **return** ⼀个对象的函数，⽽不是直接是个对象？

当data定义为对象后，这就表示所有的组件实例共⽤了⼀份data数据，因此，⽆论在哪个组件实例中修

改了data,都会影响到所有的组件实例。组件中的data写成⼀个函数，数据以函数返回值形式定义，这

样每复⽤⼀次组件，就会返回⼀份新的data，类似于给每个组件实例创建⼀个私有的数据空间，让各个

组件实例维护各⾃的数据。⽽单纯的写成对象形式，就使得所有组件实例共⽤了⼀份data，就会造成⼀

个变了全都会变的结果。

## **MVVM** 的实现原理

1. 响应式：vue如何监听data的属性变化
2. 模板解析：vue的模板是如何被解析的
3. 渲染：vue模板是如何被渲染成HTML的

MVVM是 Model-View-ViewModel 缩写，也就是把 MVC 中的 Controller 演变成 ViewModel 。Model

层代表数据模型，View代表UI组件，ViewModel是View和Model层的桥梁，数据会绑定到viewModel层

并⾃动将数据渲染到⻚⾯中，视图变化的时候会通知viewModel层更新数据。

## **vue3.0** 相对于 **vue2.x** 有哪些变化？

监测机制的改变（Object.defifineProperty —> Proxy）

模板

对象式的组件声明⽅式 （class）

使⽤ts

其它⽅⾯的更改：⽀持⾃定义渲染器、 ⽀持 Fragment（多个根节点）和 Protal（在 dom 其他部

分渲染组建内容）组件、基于 treeshaking 优化，提供了更多的内置功能

## **Vue3.x**响应式数据原理吗？****

Vue3.x改⽤ Proxy 替代Object.defifineProperty。因为Proxy可以直接监听对象和数组的变化，并且有多

达13种拦截⽅法。并且作为新标准将受到浏览器⼚商重点持续的性能优化。

### Proxy只会代理对象的第⼀层，那么Vue3⼜是怎样处理这个问题的呢？

判断当前Reflflect.get的返回值是否为Object，如果是则再通过 reactive ⽅法做代理， 这样就实现了深

度观测。

### 监测数组的时候可能触发多次get/set，那么如何防⽌触发多次呢？

我们可以判断key是否为当前被代理对象target⾃身属性，也可以判断旧值与新值是否相等，只有满⾜以

上两个条件之⼀时，才有可能执⾏trigger。

## **Vue2.x**和**Vue3.x**渲染器的**diffff**算法

简单来说，diffff算法有以下过程

- 同级⽐较，再⽐较⼦节点
- 先判断⼀⽅有⼦节点⼀⽅没有⼦节点的情况(如果新的children没有⼦节点，将旧的⼦节点移除)
- ⽐较都有⼦节点的情况(核⼼diffff)
- 递归⽐较⼦节点

正常Diffff两个树的时间复杂度是 O(n^3) ，但实际情况下我们很少会进⾏ 跨层级的移动DOM ，所以Vue将

Diffff进⾏了优化，从 O(n^3) -> O(n) ，只有当新旧children都为多个⼦节点时才需要⽤核⼼的Diffff算法

进⾏同层级⽐较。

Vue2的核⼼Diffff算法采⽤了 双端⽐较 的算法，同时从新旧children的两端开始进⾏⽐较，借助key值找

到可复⽤的节点，再进⾏相关操作。相⽐React的Diffff算法，同样情况下可以减少移动节点次数，减少不

必要的性能损耗，更加的优雅。

Vue3.x借鉴了 ivi算法和 inferno算法

在创建VNode时就确定其类型，以及在 mount/patch 的过程中采⽤ 位运算 来判断⼀个VNode的类型，

在这个基础之上再配合核⼼的Diffff算法，使得性能上较Vue2.x有了提升。(实际的实现可以结合Vue3.x源

码看。)

## **Vue**的性能优化

### 编码阶段

- 尽量减少data中的数据，data中的数据都会增加getter和setter，会收集对应的watcher
- v-if和v-for不能连⽤
- 如果需要使⽤v-for给每项元素绑定事件时使⽤事件代理
- SPA ⻚⾯采⽤keep-alive缓存组件
- 在更多的情况下，使⽤v-if替代v-show
- key保证唯⼀
- 使⽤路由懒加载、异步组件
- 防抖、节流
- 第三⽅模块按需导⼊
- ⻓列表滚动到可视区域动态加载
- 图⽚懒加载

### **SEO**优化

- 预渲染
- 服务端渲染SSR

### 打包优化

- 压缩代码
- Tree Shaking/Scope Hoisting
- 使⽤cdn加载第三⽅模块
- 多线程打包happypack
- splitChunks抽离公共⽂件
- sourceMap优化

### ⽤户体验

- ⻣架屏
- PWA

还可以使⽤缓存(客户端缓存、服务端缓存)优化、服务端开启gzip压缩等。

# **React**

## 不知道的react

1. JSX做表达式判断时候，需要强转为boolean类型，如：

   ```
   render() {
    const b = 0;
    return <div>
    {
    !!b && <div>这是⼀段⽂本</div>
    }
    </div>
   }
   ```

   如果不使⽤ !!b 进⾏强转数据类型，会在⻚⾯⾥⾯输出 0。

2. 尽量不要在 componentWillReviceProps ⾥使⽤ setState，如果⼀定要使⽤，那么需要判断结束条

   件，不然会出现⽆限重渲染，导致⻚⾯崩溃。(实际不是componentWillReviceProps会⽆限重渲染，⽽

   是componentDidUpdate)

3. 给组件添加ref时候，尽量不要使⽤匿名函数，因为当组件更新的时候，匿名函数会被当做新的prop

   处理，让ref属性接受到新函数的时候，react内部会先清空ref，也就是会以null为回调参数先执⾏⼀次

   ref这个props，然后在以该组件的实例执⾏⼀次ref，所以⽤匿名函数做ref的时候，有的时候去ref赋值

   后的属性会取到null

4. 遍历⼦节点的时候，不要⽤ index 作为组件的 key 进⾏传⼊。

## 组件封装

- 组件封装的⽬的是为了重⽤，提⾼开发效率和代码质量
- 低耦合，单⼀职责，可复⽤性，可维护性

## **react** 的虚拟**dom**是怎么实现的

⾸先说说为什么要使⽤Virturl DOM，因为操作真实DOM的耗费的性能代价太⾼，所以react内部使⽤js

实现了⼀套dom结构，在每次操作在和真实dom之前，使⽤实现好的diffff算法，对虚拟dom进⾏⽐较，

递归找出有变化的dom节点，然后对其进⾏更新操作。为了实现虚拟DOM，我们需要把每⼀种节点类

型抽象成对象，每⼀种节点类型有⾃⼰的属性，也就是prop，每次进⾏diffff的时候，react会先⽐较该节

点类型，假如节点类型不⼀样，那么react会直接删除该节点，然后直接创建新的节点插⼊到其中，假如

节点类型⼀样，那么会⽐较prop是否有更新，假如有prop不⼀样，那么react会判定该节点有更新，那

么重渲染该节点，然后在对其⼦节点进⾏⽐较，⼀层⼀层往下，直到没有⼦节点。

## **react hooks** 原理是什么？

hooks 是⽤闭包实现的，因为纯函数不能记住状态，只能通过闭包来实现。

## **useState** 中的状态是怎么存储的？

通过单向链表，fifiber tree 就是⼀个单向链表的树形结构。

## 如何遍历⼀个**dom**树

```
function traversal(node) {
    // 对node的处理
    if (node && node.nodeType === 1) {
        console.log(node.tagName);
    }
    var i = 0,
        childNodes = node.childNodes,
        item;
    for (; i < childNodes.length; i++) {
        item = childNodes[i];
        if (item.nodeType === 1) {
            // 递归先序遍历⼦节点
            traversal(item);
        }
    }
}
```

## 数据双向绑定单向绑定优缺点

- 双向绑定是⾃动管理状态的，对处理有⽤户交互的场景⾮常合适，代码量少，当项⽬越来越⼤的时

  候，调试也变得越来越复杂，难以跟踪问题

- 单向绑定是⽆状态的, 程序调试相对容易, 可以避免程序复杂度上升时产⽣的各种问题, 当然写代码

  时就没有双向绑定那么爽了

## **React fiber** 的理解和原理

### **React16** 以前

React16 以前，对virtural dom的更新和渲染是同步的。就是当⼀次更新或者⼀次加载开始以后，diff

virtual dom并且渲染的过程是⼀⼝⽓完成的。如果组件层级⽐较深，相应的堆栈也会很深，⻓时间占⽤

浏览器主线程，⼀些类似⽤户输⼊、⿏标滚动等操作得不到响应。

## **React16 Fiber Reconciler**

React16 ⽤了分⽚的⽅式解决上⾯的问题。

就是把⼀个任务分成很多⼩⽚，当分配给这个⼩⽚的时间⽤尽的时候，就检查任务列表中有没有新的、

优先级更⾼的任务，有就做这个新任务，没有就继续做原来的任务。这种⽅式被叫做异步渲染(Async

Rendering)。

Fiber就是通过对象记录组件上需要做或者已经完成的更新，⼀个组件可以对应多个Fiber。 

在render函数中创建的React Element树在第⼀次渲染的时候会创建⼀颗结构⼀模⼀样的Fiber节点树。

不同的React Element类型对应不同的Fiber节点类型。⼀个React Element的⼯作就由它对应的Fiber节

点来负责。

⼀个React Element可以对应不⽌⼀个Fiber，因为Fiber在update的时候，会从原来的Fiber（我们称为

current）clone出⼀个新的Fiber（我们称为alternate）。两个Fiber diffff出的变化（side effffect）记录

在alternate上。所以⼀个组件在更新时最多会有两个Fiber与其对应，在更新结束后alternate会取代之

前的current的成为新的current节点。

其次，Fiber的基本规则：

更新任务分成两个阶段，Reconciliation Phase和Commit Phase。Reconciliation Phase的任务⼲的事

情是，找出要做的更新⼯作（Diffff Fiber Tree），就是⼀个计算阶段，计算结果可以被缓存，也就可以

被打断；Commmit Phase 需要提交所有更新并渲染，为了防⽌⻚⾯抖动，被设置为不能被打断。

PS: componentWillMount componentWillReceiveProps componentWillUpdate ⼏个⽣命周期⽅法，

在Reconciliation Phase被调⽤，有被打断的可能（时间⽤尽等情况），所以可能被多次调⽤。其实

shouldComponentUpdate 也可能被多次调⽤，只是它只返回true或者false，没有副作⽤，可以暂时

忽略。

## React 中 fiber 是用来做什么的

因为JavaScript单线程的特点，每个同步任务不能耗时太长，不然就会让程序不会对其他输入作出相应，React的更新过程就是犯了这个禁忌，而React Fiber就是要改变现状。 而可以通过分片来破解JavaScript中同步操作时间过长的问题。

把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会。

React Fiber把更新过程碎片化，每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

维护每一个分片的数据结构，就是Fiber。

## **React** 中 **render()** 的⽬的

每个React组件强制要求必须有⼀个 **render()**。它返回⼀个 React 元素，是原⽣ DOM 组件的表示。如

果需要渲染多个 HTML 元素，则必须将它们组合在⼀个封闭标记内，例如 、 、`` 等。此函数必须保持

纯净，即必须每次调⽤时都返回相同的结果。

## 调⽤ **setState** 之后发⽣了什么？

- 在代码中调⽤ setState 函数之后，React 会将传⼊的参数对象与组件当前的状态合并，然后触发

  所谓的调和过程。

- 经过调和过程，React会以相对⾼效的⽅式根据新的状态构建React元素树并且着⼿重新渲染整个

  UI 界⾯。

- 在 React 得到元素树之后，React 会⾃动计算出新的树与⽼树的节点差异，然后根据差异对界⾯进

  ⾏最⼩化重渲染。

- 在差异计算算法中，React 能够相对精确地知道哪些位置发⽣了改变以及应该如何改变，这就保证

  了按需更新，⽽不是全部重新渲染。

## 触发多次**setstate**，那么**render**会执⾏⼏次？

- 多次setState会合并为⼀次render，因为setState并不会⽴即改变state的值，⽽是将其放到⼀个任

  务队列⾥，最终将多个setState合并，⼀次性更新⻚⾯。

- 所以我们可以在代码⾥多次调⽤setState，每次只需要关注当前修改的字段即可

## **react**中如何对**state**中的数据进⾏修改？**setState**为什么是⼀个异步的？

- 修改数据通过this.setState(参数1,参数2)

- this.setState是⼀个异步函数

  参数1 : 是需要修改的数据是⼀个对象

  参数2 : 是⼀个回调函数，可以⽤来验证数据是否修改成功，同时可以获取到数据更新后的

  DOM结构等同于componentDidMount

- this.setState中的第⼀个参数除了可以写成⼀个对象以外，还可以写成⼀个函数 ！，函数中第⼀

  个值为prevState 第⼆个值为prePprops this.setState((prevState,prop)=>({}))

## 为什么建议传递给 **setState**的参数是⼀个**callback**⽽不是⼀个对象？

因为this.props 和this.state的更新可能是异步的，不能依赖它们的值去计算下⼀个state

## 为什么**setState**是⼀个异步的？

当批量执⾏state的时候可以让DOM渲染的更快,也就是说多个setstate在执⾏的过程中还需要被合

并

## 原⽣事件和**React**事件的区别？

- React 事件使⽤驼峰命名，⽽不是全部⼩写。
- 通过 JSX , 你传递⼀个函数作为事件处理程序，⽽不是⼀个字符串。
- 在 React 中你不能通过返回 false 来阻⽌默认⾏为。必须明确调⽤ preventDefault 。

## **React**的合成事件是什么？

React 根据 W3C 规范定义了每个事件处理函数的参数，即合成事件。

事件处理程序将传递 SyntheticEvent 的实例，这是⼀个跨浏览器原⽣事件包装器。它具有与浏览器

原⽣事件相同的接⼝，包括 stopPropagation() 和 preventDefault() ，在所有浏览器中他们⼯作

⽅式都相同。

React 合成的 SyntheticEvent 采⽤了事件池，这样做可以⼤⼤节省内存，⽽不会频繁的创建和销毁

事件对象。

另外，不管在什么浏览器环境下，浏览器会将该事件类型统⼀创建为合成事件，从⽽达到了浏览器兼容

的⽬的。

## 什么是⾼阶组件（**HOC**）

⾼阶组件是重⽤组件逻辑的⾼级⽅法，是⼀种源于 React 的组件模式。 HOC 是⾃定义组件，在它之内

包含另⼀个组件。它们可以接受⼦组件提供的任何动态，但不会修改或复制其输⼊组件中的任何⾏为。

你可以认为 HOC 是“纯（Pure）”组件。

## 你能⽤**HOC**做什么？

HOC可⽤于许多任务，例如：

- 代码重⽤，逻辑和引导抽象
- 渲染劫持
- 状态抽象和控制
- Props 控制
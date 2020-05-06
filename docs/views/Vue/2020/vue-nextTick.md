---
title: Vue nextTick深入理解－vue性能优化、DOM更新时机、事件循环机制
date: 2018-02-20
tags:
 - Vue
categories:
 -  Vue
---

## **一、定义［nextTick、事件循环］**

　　**nextTick的由来：**

　　　　由于VUE的数据驱动视图更新，是异步的，即修改数据的当下，视图不会立刻更新，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新。

　　**nextTick的触发时机：**

　　　　在同一事件循环中的数据变化后，DOM完成更新，立即执行nextTick(callback)内的回调。

　　**应用场景：**

　　　　需要在视图更新之后，基于新的视图进行操作。

　　以上出现了事件循环的概念，其涉及到JS的运行机制，包括主线程的执行栈、异步队列、异步API、事件循环的协作，此处不展开之后再总结。大致理解：主线程完成同步环境执行，查询任务队列，提取队首的任务，放入主线程中执行；执行完毕，再重复该操作，该过程称为事件循环。而主线程的每次读取任务队列操作，是一个事件循环的开始。异步callback不可能处在同一事件循环中。

　　**简单总结事件循环：**

　　　　同步代码执行 -> 查找异步队列，推入执行栈，执行callback1[事件循环1] ->查找异步队列，推入执行栈，执行callback2[事件循环2]...

　　即每个异步callback，最终都会形成自己独立的一个事件循环。

　　结合nextTick的由来，可以推出每个事件循环中，nextTick触发的时机：

　　　　**同一事件循环中的代码执行完毕 -> DOM 更新 -> nextTick callback触发**

 　tips：本文的任务队列、消息队列、异步队列指同一个东西，均指macrotask queue。

　　　　  **事件循环详解：[http://www.cnblogs.com/hity-tt/p/6733062.html ](http://www.cnblogs.com/hity-tt/p/6733062.html)**

## **二、实例理解nextTick的使用，并给出在页面渲染上的优化巧用**

　　***\*(tips：代码的正确阅读方式：看template组成、跳过script代码、看代码后面的用例设计、看之后的代码分析、同时结合回头结合script代码理解)\****

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

```
<template>
    <div>
        <ul>
            <li v-for="item in list1">{{item}}</li>
        </ul>
        <ul>
            <li v-for="item in list2">{{item}}</li>
        </ul>
        <ol>
            <li v-for="item in list3">{{item}}</li>
        </ol>
        <ol>
            <li v-for="item in list4">{{item}}</li>
        </ol>
        <ol>
            <li v-for="item in list5">{{item}}</li>
        </ol>
    </div>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            list1: [],
            list2: [],
            list3: [],
            list4: [],
            list5: []
        }
    },
    created() {
        this.composeList12()
        this.composeList34()
        this.composeList5()
        this.$nextTick(function() {
            // DOM 更新了
            console.log('finished test ' + new Date().toString())
            console.log(document.querySelectorAll('li').length)
        })
    },
    methods: {
        composeList12() {
            let me = this
            let count = 10000

            for (let i = 0; i < count; i++) {
                Vue.set(me.list1, i, 'I am a 测试信息～～啦啦啦' + i)
            }
            console.log('finished list1 ' + new Date().toString())

            for (let i = 0; i < count; i++) {
                Vue.set(me.list2, i, 'I am a 测试信息～～啦啦啦' + i)
            }
            console.log('finished list2 ' + new Date().toString())

            this.$nextTick(function() {
                // DOM 更新了
                console.log('finished tick1&2 ' + new Date().toString())
                console.log(document.querySelectorAll('li').length)
            })
        },
        composeList34() {
            let me = this
            let count = 10000

            for (let i = 0; i < count; i++) {
                Vue.set(me.list3, i, 'I am a 测试信息～～啦啦啦' + i)
            }
            console.log('finished list3 ' + new Date().toString())

            this.$nextTick(function() {
                // DOM 更新了
                console.log('finished tick3 ' + new Date().toString())
                console.log(document.querySelectorAll('li').length)
            })

            setTimeout(me.setTimeout1, 0)
        },
        setTimeout1() {
            let me = this
            let count = 10000

            for (let i = 0; i < count; i++) {
                Vue.set(me.list4, i, 'I am a 测试信息～～啦啦啦' + i)
            }
            console.log('finished list4 ' + new Date().toString())

            me.$nextTick(function() {
                // DOM 更新了
                console.log('finished tick4 ' + new Date().toString())
                console.log(document.querySelectorAll('li').length)
            })
        },
        composeList5() {
            let me = this
            let count = 10000

            this.$nextTick(function() {
                // DOM 更新了
                console.log('finished tick5-1 ' + new Date().toString())
                console.log(document.querySelectorAll('li').length)
            })

            setTimeout(me.setTimeout2, 0)
        },
        setTimeout2() {
            let me = this
            let count = 10000

            for (let i = 0; i < count; i++) {
                Vue.set(me.list5, i, 'I am a 测试信息～～啦啦啦' + i)
            }
            console.log('finished list5 ' + new Date().toString())

            me.$nextTick(function() {
                // DOM 更新了
                console.log('finished tick5 ' + new Date().toString())
                console.log(document.querySelectorAll('li').length)
            })
        }
    }
}</script>
```

[![复制代码](https://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)



　　**2.1、用例设计**

　　　　用例1：通过list1、2、3验证，处在同步代码中的DOM更新情况及nextTick的触发时机；

　　　　用例2：通过list3、list4验证，同步代码及异步代码中Dom更新及nextTick触发的区别；

　　　　用例3：通过list4、list5对比验证，多个异步代码中nextTick触发的区别；

　　　　用例4：通过在视图更新后获取DOM中<li>的数量，判断nextTick序列渲染的时间点。

 

　　**2.2、代码分析**

　　　　函数执行步骤：

　　　　　　事件循环1:

　　　　　　　　step1: this.composeList12() -> update list1, update list2 -> 绑定tick’1&2’

　　　　　　　　step2: this.composeList34() -> update list3, 设置异步1setTimeout1 -> 绑定tick’3’

　　　　　　　　step3: this.composeList5() -> 绑定tick’5-1’ -> 设置异步2setTimeout2 

　　　　　　　　step4: 绑定tick’test’

　　　　　　事件循环2:

　　　　　　　　将setTimeout1的callback推入执行栈 -> update list4 -> 绑定tick’4’

　　　　　　事件循环3:

　　　　　　　　将setTimeout2的callback推入执行栈 -> update list5 -> 绑定tick’5’

 

　　**2.3、推断输出消息**

　　　　由于同一事件循环中的tick按执行顺序，因此消息输出为即：

　　　　　　［同步环境］update list1 -> update list2 -> update list3 -> tick‘1&2’ -> tick‘3’ -> tick’5-1’ -> tick’test'

　　　　　　［事件循环1］->update list4 -> tick’4’ 

　　　　　　 [事件循环2] ->update list5 -> tick’5’

 

　　**2.4、实际运行结果如下图**

   　　  ![img](https://images2015.cnblogs.com/blog/1094893/201704/1094893-20170418180345274-1397446287.png)

　　　　该demo中，设置了5个size为10000的数组，从而能从时间及消息输出两个维度来了解nextTick的执行情况。另外，额外增加了一个参数，即更新后的视图中<li>的数量，从这个数量，可以考察出同一事件循环中的nextTick执行情况。由运行结果图可以看出实际的输出与推导的输出结果相符合。

 

　　**2.5、总结**

　　　　从用例1得出：

　　　　　　a、在同一事件循环中，只有所有的数据更新完毕，才会调用nextTick；

　　　　　　b、仅在同步执行环境数据完全更新完毕，DOM才开始渲染，页面才开始展现；

　　　　　　c、在同一事件循环中，如果存在多个nextTick，将会按最初的执行顺序进行调用；

　　　　从用例1+用例4得出：

　　　　　　d、从同步执行环境中的四个tick对应的‘li’数量均为30000可看出，同一事件循环中，nextTick所在的视图是相同的；

　　　　从用例2得出：

　　　　　　e、只有同步环境执行完毕，DOM渲染完毕之后，才会处理异步callback

　　　　从用例3得出：

　　　　　　f、每个异步callback最后都会处在一个独立的事件循环中，对应自己独立的nextTick;

　　　　从用例1结论中可得出：

　　　　　　g、这个事件环境中的数据变化完成，在进行渲染［视图更新］，可以避免DOM的频繁变动，从而避免了因此带来的浏览器卡顿，大幅度提升性能；

　　　　从b可以得出：

　　　　　　h、在首屏渲染、用户交互过程中，要巧用同步环境及异步环境；首屏展现的内容，尽量保证在同步环境中完成；其他内容，拆分到异步中，从而保证性能、体验。

   

　　tips：

　　　　1、可产生异步callback的有：promise（microtask queue）、setTimeout、MutationObserver、DOM事件、Ajax等;

　　　　2、 vue DOM的视图更新实现，，使用到了ES6的Promise及HTML5的[MutationObserver](http://www.cnblogs.com/jscode/p/3600060.html)，当环境不支持时，使用setTimeout(fn, 0)替代。上述的三种方法，均为异步API。其中MutationObserver类似事件，又有所区别；事件是同步触发，其为异步触发，即DOM发生变化之后，不会立刻触发，等当前所有的DOM操作都结束后触发。关于异步API、事件循环将在以后补充。

 

　　　　**事件循环、任务队列详解：[http://www.cnblogs.com/hity-tt/p/6733062.html ](http://www.cnblogs.com/hity-tt/p/6733062.html)**
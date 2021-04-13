---
title: react--React中为什么要绑定this
date: 2019-01-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

### 概述

之前一直没懂为什么在构造函数中要绑定this，难道React中实例化出来的组件，this还能不指向自身吗？答案是还真有可能不指向自身。

先来看一个构造函数。

```
//...
constructor(props) {
  super(props)
  this.state = { count: props.count };
  this.plus = this.plus.bind(this);
}
//...
```

默认情况下，ES6中的class实现，类方法是直接绑定在原形对象上的，而且一般调用也不会有问题，但是React中有一个地方调用时明显this不会指向当前对象，那就是render方法中的JSX中。

```
return (
  <div>
    <button onClick={this.plus}>plus</button>
    <br/>
    <span>{this.state.count}</span>
  </div>
);
```

上面的this就不会指向当前创建的组件实例，因为这时的plus中的this是事件响应时的上下文环境，并不是组件实例。那么这种情况下应该怎样解决呢？一种最直观的方法是直接创建一个函数对象。

```
//...
  <button onClick={ () => this.plus() }></button>
  <br/>
//...
```

这种情况下，plus中的this即this.plus()的this，也就是我们的组件实例。除此之外的一种解决方法是在赋值事件处理函数的时候绑定。

```
//...
  <button onClick={this.plus.bind(this)}></button>
  <br/>
//...
```

这种写法，是在赋值响应时间处理函数时，临时绑定当前组件实例。

再回过头来，如果我们在构造函数中绑定this，我们可以看到之后使用的this.plus，都不再是原型链上的plus方法了，而是当前组件实例上的plus方法。

为了验证，我们可以在上做测试。

```
//...
constructor(props) {
  super(props)
  this.state = { count: props.count };
  // 注意这里的Counter就是类名
  console.log(this.plus === Counter.prototype.plus); // true
  this.plus = this.plus.bind(this);
  console.log(this.plus === Counter.prototype.plus); // false
}
//...
```

### 总结

StackOverflow上有人说，在构造函数中绑定会使React的热加载器（hot-loader）失效，而在渲染方法中绑定则会影响性能。

由于还没有用过hot-loader，暂时还不清楚具体情况，但是在渲染方法中绑定会影响性能是显而易见的，毕竟每一次渲染都需要执行一次bind，**更重要地是，由于在React中常用的优化方法之一就是在shouldComponentUpdate方法中对比新旧属性，如果事件绑定的是一个组件元素（非原生DOM元素），而该组件又依靠简单的新旧属性对比来优化，则这种优化就会失效，所以还是建议在构造函数中绑定事件处理函数。**

### 参考

1. [Handling Events - React Docs](https://facebook.github.io/react/docs/handling-events.html)
2. [Understanding JavaScript Bind ()#click handlers - Ben Howdle](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/#click-handlers)
3. [React.js and ES6: Any reason not to bind a function in the constructor - FakeRainBrigand’s answer - StackOverflow](https://stackoverflow.com/a/31302493/5772561)
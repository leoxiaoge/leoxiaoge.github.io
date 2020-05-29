---
title: JavaScript--事件捕获和事件冒泡
date: 2018-02-01
tags:
 - JavaScript
categories:
 -  JavaScript
---

事件捕获（event capturing）： 当鼠标点击或者触发dom事件时（被触发dom事件的这个元素被叫作事件源），浏览器会从根节点 =>事件源（由外到内）进行事件传播。

事件冒泡（dubbed bubbling）： 事件源 =>根节点（由内到外）进行事件传播。

无论是事件捕获还是事件冒泡，它们都有一个共同的行为，就是事件传播。

dom标准事件流的触发的先后顺序为：先捕获再冒泡。即当触发dom事件时，会先进行事件捕获，捕获到事件源之后通过事件传播进行事件冒泡。

addEventListener的第三个参数
在我们平常用的addEventListener方法中，一般只会用到两个参数，一个是需要绑定的事件，另一个是触发事件后要执行的函数，然而，addEventListener还可以传入第三个参数：

```
element.addEventListener(event, function, useCapture);
```

第三个参数默认值是false，表示在事件冒泡阶段调用事件处理函数;如果参数为true，则表示在事件捕获阶段调用处理函数。

事件冒泡

```
<body>
  <div id="parent">
    父元素
    <div id="child">
      子元素
    </div>
  </div>
  <script type="text/javascript">
    var parent = document.getElementById("parent");
    var child = document.getElementById("child");
    
    document.body.addEventListener("click",function(e){
      console.log("click-body");
    },false);

    parent.addEventListener("click",function(e){
      console.log("click-parent");
    },false);

    child.addEventListener("click",function(e){
      console.log("click-child");
    },false);
  </script>
</body>
```

上述代码当点击子元素时执行结果如下：



事件触发顺序是由内到外的，这就是事件冒泡。如果点击子元素不想触发父元素的事件，可使用event.stopPropagation();方法：

```
child.addEventListener("click",function(e){
　　console.log("click-child");
  　e.stopPropagation();
},false);
```

## 事件捕获

修改事件冒泡的代码：

```
var parent = document.getElementById("parent");
var child = document.getElementById("child");

document.body.addEventListener("click",function(e){
  console.log("click-body");
  },false);

parent.addEventListener("click",function(e){
  console.log("click-parent---事件传播");
},false);
    　　　　 
　　　　 //新增事件捕获事件代码
parent.addEventListener("click",function(e){
  console.log("click-parent--事件捕获");
},true);

child.addEventListener("click",function(e){
  console.log("click-child");
},false);
```

点击子元素时结果如下：



父元素通过事件捕获的方式注册了click事件，所以在事件捕获阶段就会触发，然后到了目标阶段，即事件源，之后进行事件冒泡，parent同时也用冒泡方式注册了click事件，所以这里会触发冒泡事件，最后到根节点（body）。这就是整个事件流程。

事件委托（事件代理）
事件委托也可以叫事件代理，是事件冒泡与事件捕获的运用。

基本概念
一般来讲，会把一个或者一组元素的事件委托到它的父层或者更外层元素上，真正绑定事件的是外层元素，当事件响应到需要绑定的元素上时（事件捕获），会通过事件冒泡机制从而触发它的外层元素的绑定事件上，然后在外层元素上去执行函数。

举个例子，比如一个宿舍的同学同时快递到了，一种方法就是他们都傻傻地一个个去领取，还有一种方法就是把这件事情委托给宿舍长，让一个人出去拿好所有快递，然后再根据收件人一一分发给每个宿舍同学；

在这里，取快递就是一个事件，每个同学指的是需要响应事件的 DOM 元素，而出去统一领取快递的宿舍长就是代理的元素，所以真正绑定事件的是这个元素，按照收件人分发快递的过程就是在事件执行中，需要判断当前响应的事件应该匹配到被代理元素中的哪一个或者哪几个。

优点
减少内存消耗

```
<ul id="list">
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
  ......
  <li>item n</li>
</ul>
```

如果给每个列表项一一都绑定一个函数，那对于内存消耗是非常大的，比较好的方法就是把这个点击事件绑定到他的父层，也就是 ul 上，然后在执行事件的时候再去匹配判断目标元素。

动态绑定事件
比如上述的例子中列表项就几个，我们给每个列表项都绑定了事件；
在很多时候，我们需要通过 AJAX 或者用户操作动态的增加或者去除列表项元素，那么在每一次改变的时候都需要重新给新增的元素绑定事件，给即将删去的元素解绑事件；

如果用了事件委托就没有这种麻烦了，因为事件是绑定在父层的，和目标元素的增减是没有关系的，执行到目标元素是在真正响应执行事件函数的过程中去匹配的；

所以使用事件在动态绑定事件的情况下是可以减少很多重复工作的。

实现

```
<ul id="list">
  <li className="class-1">item 1</li>
  <li>item 2</li>
  <li className="class-1">item 3</li>
  ......
  <li>item n</li>
</ul>
```

```
document.getElementById('list').addEventListener('click', function (e) {
  // 兼容性处理
  var event = e || window.event;
  var target = event.target || event.srcElement;
  if (target.matches('li.class-1')) {
    console.log('the content is: ', target.innerHTML);
  }
});
```
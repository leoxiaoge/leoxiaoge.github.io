---
title: js发送get 、post请求的方法
date: 2018-10-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

使用XMLHttpRequest

​    主要分三步：

　    第一步：创建需要的对象，这里主要用到的是XMLHttpRequest，注意需要考虑早期的IE；  第二步：连接和发送；

​        第三步：接收；

GET请求：

```
var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
        httpRequest.open('GET', 'url', true);//第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
        httpRequest.send();//第三步：发送请求  将请求参数写在URL中
        /**
         * 获取数据后的处理程序
         */
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;//获取到json字符串，还需解析
                console.log(json);
            }
        };
```

POST请求：

```
var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
httpRequest.open('POST', 'url', true); //第二步：打开连接
httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
httpRequest.send('name=teswe&ee=ef');//发送请求 将情头体写在send中
/**
 * 获取数据后的处理程序
 */
httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
        var json = httpRequest.responseText;//获取到服务端返回的数据
        console.log(json);
    }
};
```

post方式发送json

```
var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
httpRequest.open('POST', 'url', true); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
httpRequest.setRequestHeader("Content-type","application/json");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
httpRequest.send(JSON.stringify(obj));//发送请求 将json写入send中
/**
 * 获取数据后的处理程序
 */
httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
        var json = httpRequest.responseText;//获取到服务端返回的数据
        console.log(json);
    }
};
```



1. get是从服务器上获取数据，post是向服务器传送数据。
   get 和 post只是一种传递数据的方式，get也可以把数据传到服务器，他们的本质都是发送请求和接收结果。只是组织格式和数据量上面有差别，http协议里面有介绍。
2. get是把参数数据队列加到提交表单的ACTION属性所指的URL中，值和表单内各个字段一一对应，在URL中可以看到。post是通过HTTPpost机制，将表单内各个字段与其内容放置在HTML HEADER内一起传送到ACTION属性所指的URL地址。用户看不到这个过程。
   因为get设计成传输小数据，而且最好是不修改服务器的数据，所以浏览器一般都在地址栏里面可以看到，但post一般都用来传递大数据，或比较隐私的数据，所以在地址栏看不到，能不能看到不是协议规定，是浏览器规定的。
3. 对于get方式，服务器端用Request.QueryString获取变量的值，对于post方式，服务器端用Request.Form获取提交的数据。
   没明白，怎么获得变量和你的服务器有关，和get或post无关，服务器都对这些请求做了封装。
4. . get传送的数据量较小，不能大于2KB。post传送的数据量较大，一般被默认为不受限制。但理论上，IIS4中最大量为80KB，IIS5中为100KB。
   post基本没有限制，我想大家都上传过文件，都是用post方式的。只不过要修改form里面的那个type参数。
5. . get安全性非常低，post安全性较高，如果没有加密，他们安全级别都是一样的。
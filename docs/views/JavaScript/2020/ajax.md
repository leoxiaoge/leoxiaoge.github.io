---
title: ajax
date: 2019-02-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

## **传统方法的缺点:**

　　传统的web交互是用户触发一个http请求服务器,然后服务器收到之后,在做出响应到用户,并且返回一个新的页面,,每当服务器处理客户端提交的请求时,客户都只能空闲等待,并且哪怕只是一次很小的交互、只需从服务器端得到很简单的一个数据,都要返回一个完整的HTML页,而用户每次都要浪费时间和带宽去重新读取整个页面。这个做法浪费了许多带宽，由于每次应用的交互都需要向服务器发送请求，应用的响应时间就依赖于服务器的响应时间。这导致了用户界面的响应比本地应用慢得多。

## 个人使用的ajax

```
// http.js
// note：xhr的兼容写法
// function XHR() {
//   if (window.XMLHttpRequest) return new XMLHttpRequest();
//   if (window.ActiveXObject) return new ActiveXObject('Microsoft.XMLHTTP');
//   return 'Not support XMLHttpRequest!';
// }
// 判断是否为纯对象，比如这种格式 {'name': 'jason'} 是纯对象，函数、数组等则不是
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
// 查询字符串中每个参数的名称和值都必须使用 encodeURIComponent() 进行编码，然后才能放到 URL 的末尾；
// 所有名-值对儿都必须由和号 ( & ) 分隔
function addURLParam(url, name, value) {
  url += (url.indexOf('?') == -1 ? '?' : '&');
  url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
  return url;
}
/**
 * Converts an object to x-www-form-urlencoded serialization.
 * @param  {Object} obj
 * @return {String}
 */
function serialize(obj) {
  var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

  for (name in obj) {
    value = obj[name];
    if (value instanceof Array) {
      for (i = 0; i < value.length; ++i) {
        subValue = value[i];
        fullSubName = name + '[' + i + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += serialize(innerObj) + '&';
      }
    }
    else if (value instanceof Object) {
      for (subName in value) {
        subValue = value[subName];
        fullSubName = name + '[' + subName + ']';
        innerObj = {};
        innerObj[fullSubName] = subValue;
        query += serialize(innerObj) + '&';
      }
    }
    else if (value !== undefined && value !== null)
      query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
  }
  return query.length ? query.substr(0, query.length - 1) : query;
}
function ajax(type, url, data, contentType) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    if (type.toUpperCase() === 'GET' && data) {
      for (key in data) {
        if (data.hasOwnProperty(key)) {
          url = addURLParam(url, key, data[key]);
        }
      }
    }
    /** post传输，当传FormData类型的数据时，不需要设置Content-Type
     *  当数据格式为纯对象时
     *  默认设置'Content-Type'为'application/x-www-form-urlencoded'，对数据进行序列化
     *  如果'Content-Type'设置为'application/json'，数据直接传json字符串
     **/
    if (type.toUpperCase() === 'POST' && isPlainObject(data)) {
      if (!contentType || contentType === 'application/x-www-form-urlencoded') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        data = serialize(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        data = JSON.stringify(data);
      }
    }
    xhr.open(type, url, true);
    xhr.onload = function() {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        var res = JSON.parse(xhr.response);
        resolve(res);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.timeout = 10000;
    xhr.ontimeout = function() {
      reject('链接超时！')
    };
    xhr.onerror = function() {
      reject('网络错误！');
    };
    xhr.onabort = function() {
      reject('请求取消！');
    };
    xhr.send(type.toUpperCase() === 'GET' ? null : data); // 如果不需要通过请求主体发送数据，则必须传入null，因为这个参数对有些浏览器来说是必需的
  });
}
export default {
  get: function(url, data) {
    return ajax('GET', url, data);
  },
  post: function(url, data, contentType) {
    return ajax('POST', url, data, contentType);
  }
}
```

## **什么是ajax**

　　ajax的出现,刚好解决了传统方法的缺陷。AJAX 是一种用于创建快速动态网页的技术。通过在后台与服务器进行少量数据交换，AJAX 可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。

## **XMLHttpRequest 对象**

　　XMLHttpRequest对象是ajax的基础,XMLHttpRequest 用于在后台与服务器交换数据。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。目前所有浏览器都支持XMLHttpRequest

| 方  法                                                     | 描  述                                                       |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| abort()                                                    | 停止当前请求                                                 |
| getAllResponseHeaders()                                    | 把HTTP请求的所有响应首部作为键/值对返回                      |
| getResponseHeader("header")                                | 返回指定首部的串值                                           |
| open("method","URL",[asyncFlag],["userName"],["password"]) | 建立对服务器的调用。method参数可以是GET、POST或PUT。url参数可以是相对URL或绝对URL。这个方法还包括3个可选的参数，是否异步，用户名，密码 |
| send(content)                                              | 向服务器发送请求                                             |
| setRequestHeader("header", "value")                        | 把指定首部设置为所提供的值。在设置任何首部之前必须先调用open()。设置header并和请求一起发送 ('post'方法一定要 ) |

五步使用法:

　　1.创建XMLHTTPRequest对象

　　2.使用open方法设置和服务器的交互信息

　　3.设置发送的数据，开始和服务器端交互

　　4.注册事件

　　5.更新界面

下面给大家列出get请求和post请求的例子

## **get请求:**

```javascript
//步骤一:创建异步对象
var ajax = new XMLHttpRequest();
//步骤二:设置请求的url参数,参数一是请求的类型,参数二是请求的url,可以带参数,动态的传递参数starName到服务端
ajax.open('get','getStar.php?starName='+name);
//步骤三:发送请求
ajax.send();
//步骤四:注册事件 onreadystatechange 状态改变就会调用
ajax.onreadystatechange = function () {
    if (ajax.readyState==4 &&ajax.status==200) {
         //步骤五 如果能够进到这个判断 说明 数据 完美的回来了,并且请求的页面是存在的console.log(ajax.responseText);//输入相应的内容
    }
}
```

##  **post请求:**

```
//创建异步对象  
var xhr = new XMLHttpRequest();
//设置请求的类型及url
//post请求一定要添加请求头才行不然会报错
xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
 xhr.open('post', '02.post.php' );
//发送请求
xhr.send('name=fox&age=18');
xhr.onreadystatechange = function () {
    // 这步为判断服务器是否正确响应
  if (xhr.readyState == 4 && xhr.status == 200) {
    console.log(xhr.responseText);
  } 
};
```

为了方便使用,我们可以把他封装进方法里面,要用的时候,直接调用就好了

```
function ajax_method(url,data,method,success) {
    // 异步对象
    var ajax = new XMLHttpRequest();

    // get 跟post  需要分别写不同的代码
    if (method=='get') {
        // get请求
        if (data) {
            // 如果有值
            url+='?';
            url+=data;
        }else{

        }
        // 设置 方法 以及 url
        ajax.open(method,url);

        // send即可
        ajax.send();
    }else{
        // post请求
        // post请求 url 是不需要改变
        ajax.open(method,url);

        // 需要设置请求报文
        ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");

        // 判断data send发送数据
        if (data) {
            // 如果有值 从send发送
            ajax.send(data);
        }else{
            // 木有值 直接发送即可
            ajax.send();
        }
    }

    // 注册事件
    ajax.onreadystatechange = function () {
        // 在事件中 获取数据 并修改界面显示
        if (ajax.readyState==4&&ajax.status==200) {
            // console.log(ajax.responseText);

            // 将 数据 让 外面可以使用
            // return ajax.responseText;

            // 当 onreadystatechange 调用时 说明 数据回来了
            // ajax.responseText;

            // 如果说 外面可以传入一个 function 作为参数 success
            success(ajax.responseText);
        }
    }

}
```
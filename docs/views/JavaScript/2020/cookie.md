---
title: JavaScript中cookie的操作与封装
date: 2018-02-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

### 一、了解cookie

- `cookie`是一个在客户端的存储空间，在浏览器里。可以将一些信息存储在客户端中。
- 它有大小限制，一般不超过4kb,超出的将不再保存
- 以字符串的形式存储一些数据
  1. 数据格式必须是 `key=value`
  2. 多条数据中间用分号`;`间隔
  3. 每一个cookie都有一个过期事件`expires`，到达设置时间后关闭浏览器

### 二、cookie的特点

- 按照`域名`存储，你在哪一个域名下存储的内容, 就在哪一个域名下使用，其他域名都用不了，和资源路径地址没有关系。

- 存储大小有限制,4KB或者50条cookie。

- 时效性，默认是会话级别的时效性(关闭浏览器就没有了)， 可以手动设置, 七天后, 两个小时以后。

- 请求自动携带

  - 当你的 cookie 空间里面有内容的时候， 只要是当前域名下的任意一个请求, 都会自动携带 cookie 放在请求头里面，cookie 里面有多少自动携带多少，如果 cookie 空间中没有内容, 就不会携带了。

- 前后端操作

  - 前端可以通过 js 操作 cookie 空间进行增删改查。

  - 后端也可以通过任何后端语言进行 cookie 空间的增删改查。

### 三、cookie的操作

- 在chrome浏览器中，cookie的设置需要打开服务器设置，我用的时phpstudy服务器，本地路径打开无法设置cookie。

##### 设置cookie

- `document.cookie = 'key=value'`
- 一次只能设置一条`cookie`，如果想设置多条cookie，需要`多次执行代码`
- 想要更改某条`cookie`值，就设置相同的`key`值，不一样的`value`
- 当你不进行额外设置的时候, 你设置的 cookie 默认就是`会话级别(关闭浏览器就没有了)`
- 想要给cookie设置一个过期时间
  - 语法:`document.cookie = 'a=100;expires=时间对象'`
  - cookie使用的是世界标准时间，而我们使用的new Date()则是我们自己的时间，也就是中国所在时区的时间，`+8时区`
    我们需要减去这8个小时在设置cookie时间，才是我们正确设置的时间。

1. 设置两条 cookie

```javascript
// 设置两条 cookie
     document.cookie = 'a=100'
   	 document.cookie = 'b=200'
```

2. 设置15秒后过期的cookie

```javascript
  // 设置一个有过期时间的 cookie
    document.cookie = 'a=100'
    // new Date() 就是当前时间的时间对象
    document.cookie = 'b=200;expires=' + new Date()
    // 一个合适的时间
    var time = new Date() // 当前时间
    // time.getTime() // 时间戳
    // time.getTime() - 1000 * 60 * 60 * 8 // 八个小时以前的时间戳
    // 把这个时间戳再从新设置会 time 时间对象上
    time.setTime(time.getTime() - 1000 * 60 * 60 * 8 + 1000 * 15) // 当前时间的 15 秒以后
    // 此时 time 就是当前时间 8 个小时以前的时间对象
    // 设置 cookie 的时候就使用这个 八个小时 以前的 时间对象
    // console.log(time)
    // time 就是 15 秒以后的时间
    document.cookie = 'c=300;expires=' + time
    // 语法: document.cookie = 'a=100;expires=时间对象'
```

##### 删除cookie

- 把cookie的过期时间设置成当前时间之前，也就是不存在，就意味着删除

```html
<!-- 点击之后删除cookie -->
<button>删除 cookie</button>
  <script>
    document.cookie = 'a=100' // 默认会话级别  关闭浏览器才会消失
    var but = document.querySelector('button')
    btn.onclick = function () {
      var time = new Date()
      //先减去+8时区的时间  得到cookie使用的时间   在设置一秒前让cookie消失
      time.setTime(time.getTime() - 1000 * 60 * 60 * 8 - 1000)
      document.cookie = 'a=100;expires=' + time 
    }
    /*
      打开页面的时候设置一个会话级别的 cookie
      当我点击 按钮的时候就删除这个 cookie
    */
  </script>
```

##### 修改cookie

- 修改cookie就是再设置一条key值相同的cookie

```html
 <button>修改 cookie</button>
  <script>
    /*
      修改 cookie
        + 因为 cookie 的存储不允许同名
        + 所以你第二次设置同一条 cookie 的时候就是修改
    */
    document.cookie = 'a=100'
    var btn = document.querySelector('button')
    btn.onclick = function () {
      // 再次设置一遍 a 这个 cookie 就是修改
      document.cookie = 'a=200'
    }
    /*
      打开页面的时候设置了一个 a = 100 的 cookie
      当我点击按钮的时候从西你设置 cookie 的值变为    a = 200
    */
  </script>
```

##### 获得cookie

```javascript
//直接打印
console.log(document.cookie)
```

- 这里的cookie值是一个字符串，需要注意的是，每一条cookie后面都有`;`加上`一个空格`

### 四、cookie操作的简单封装

##### 设置cookie

```javascript
function setCookie(key, value, expires) {
  // key 就是你要设置的 cookie 的属性名
  // value 就是你要设置的 cookie 的属性值
  // expires 就是你要设置的 cookie 的过期时间
  // 先判断以下你有没有传递 expires   也就是是否设置过期时间
  if (expires) {
	//如果设置 过期时间
    var time = new Date()
    time.setTime(time.getTime() - 1000 * 60 * 60 * 8 + 1000 * expires)
    // 设置上
    document.cookie = key + '=' + value + ';expires=' + time
  } else {
    // 你没有传递
    // 直接设置就可以了
    document.cookie = key + '=' + value
  }
}
```

##### 获取某一条cookie

```javascript
function getCookie(key) {
  // key 就是你要获取的那一条 cookie 的属性名
  // 1. 准备一个 str
  var str = ''
  // 2. 去到 document.cookie 里面找到对应的 key 的 value 赋值给 str
  // console.log(document.cookie) // 不好直接操作
  // 使用 split 方法切割以下
  var tmp = document.cookie.split('; ')
  // 循环遍历 tmp
  tmp.forEach(function (item) {
    // item 就是每一条 cookie
    // console.log(item)
    // item = 前面的就是每一条 cookie 的 key
    // item = 后面的就是每一条 cookie 的 value
    // 使用 split 方法把 item 切割
    var t = item.split('=')
    // console.log(t)
    // t[0] 就是每一条 cookie 的 key
    // t[1] 就是每一条 cookie 的 value
    // 判断
    if (t[0] === key) {
      str = t[1]
    }
  })
  // 3. 把 str 返回
  return str
}
```

## JavaScript 存储对象

Web 存储 API 提供了 sessionStorage （会话存储） 和 localStorage（本地存储）两个存储对象来对网页的数据进行添加、删除、修改、查询操作。

- localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去除。
- sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。

### 存储对象属性

| 属性   | 描述                           |
| :----- | :----------------------------- |
| length | 返回存储对象中包含多少条数据。 |

### 存储对象方法

| 方法                        | 描述                                               |
| :-------------------------- | :------------------------------------------------- |
| key(*n*)                    | 返回存储对象中第 *n* 个键的名称                    |
| getItem(*keyname*)          | 返回指定键的值                                     |
| setItem(*keyname*, *value*) | 添加键和值，如果对应的值存在，则更新该键对应的值。 |
| removeItem(*keyname*)       | 移除键                                             |
| clear()                     | 清除存储对象中所有的键                             |

### Web 存储 API

| 属性                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [window.localStorage](https://www.runoob.com/jsref/prop-win-localstorage.html) | 在浏览器中存储 key/value 对。没有过期时间。                  |
| [window.sessionStorage](https://www.runoob.com/jsref/prop-win-sessionstorage.html) | 在浏览器中存储 key/value 对。 在关闭窗口或标签页之后将会删除这些数据。 |

## 移动浏览器：

| 移动浏览器Browser | 版本Version | 存储大小Available |
| :---------------- | :---------- | ----------------- |
| Chrome            | 40          | 10MB              |
| Android Browser   | 4.3         | 2MB               |
| Firefox           | 34          | 10MB              |
| iOS Safari        | 6-8         | 5MB               |

## 桌面浏览器：

| 桌面浏览器Browser | 版本Version | 存储大小Available |
| :---------------- | :---------- | ----------------- |
| Chrome            | 40          | 10MB              |
| Opera             | 27          | 10MB              |
| Firefox           | 34          | 10MB              |
| Safari            | 6-8         | 5MB               |
| IE                | 9-11        | 10MB              |
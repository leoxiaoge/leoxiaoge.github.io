---
title: JavaScript 将两个json数组合并
date: 2018-06-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

方法1：

使用push

```
var str1=[{name:"11",age:11}];
var str2=[{name:"22",age:22}];
var str3 = [];
for (var i = 0; i < str1.length; i++) {
    str3.push(str1[i]);
}
for (var i = 0; i < str2.length; i++) {
    str3.push(str2[i]);
}
console.log(str3);
```

方法2:

使用ES5的concat

```
var str1=[{name:"11",age:11}];
var str2=[{name:"22",age:22}];
var str3 = str1.concat(str2);
console.log(str3);
```

方法3：

使用ES6的扩展运算符(...)

```
var str1=[{name:"11",age:11}];
var str2=[{name:"22",age:22}];
var str3 = [...str1, ...str2]
console.log(str3);
```


---
title: JavaScript--遍历数组：for、for-in、forEach、for-of
date: 2021-03-29
tags:
 - JavaScript
categories:
 -  JavaScript
---

## for 循环

```
for (let i = 0; index < someArray.length; index++) {
   const item = someArray[i];
   // ···
}
```

## for-in 循环

```
for (const key in someArray) {
   console.log(key);
}
```

## 数组的 .forEach() 方法

```
someArray.forEach((item, index) => {
   console.log(item, index);
});
```

## for-of 循环

```
for (const elem of someArray) {
   console.log(elem);
}
```

# for 循环[ES1]

JavaScript中的普通 for 循环已经很老了，它在ECMAScript 1中就已经存在了。这个 `for` 循环记录了arr的每个元素的索引和值：

```
const arr = ['a', 'b', 'c'];
arr.prop = 'property value';
for (let index=0; index < arr.length; index++) {
  const elem = arr[index];
  console.log(index, elem);
}
// 输出:
// 0, 'a'
// 1, 'b'
// 2, 'c'
```

此循环的优缺点是什么？

- 它是相当通用的，但可惜的是，当我们要做的是在一个数组上循环时，它也很啰嗦。
- 如果我们不想从第一个 Array 元素开始循环，它还是很有用的。其他的循环机制都不能让我们这样做。

# for-in 循环 [ES1]

for-in 循环和 for 循环一样古老--它在ECMAScript 1中也已经存在。这个 for-in 循环记录了arr的键：

```
const arr = ['a', 'b', 'c'];
arr.prop = 'property value';
for (const key in arr) {
  console.log(key);
}
// 输出:
// '0'
// '1'
// '2'
// 'prop'
```
---
title: JavaScript push()和splice（）方法
date: 2018-07-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

# JavaScript push() 方法

## 定义和用法

push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。

### 语法

```
arrayObject.push(newelement1,newelement2,....,newelementX)
```

| 参数        | 描述                             |
| ----------- | -------------------------------- |
| newelement1 | 必需。要添加到数组的第一个元素。 |
| newelement2 | 可选。要添加到数组的第二个元素。 |
| newelementX | 可选。可添加多个元素。           |

### 返回值

把指定的值添加到数组后的新长度。

### 说明

push() 方法可把它的参数顺序添加到 arrayObject 的尾部。它直接修改 arrayObject，而不是创建一个新的数组。push() 方法和 pop() 方法使用数组提供的先进后出栈的功能。

# JavaScript splice() 方法

## 定义和用法

splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。

注释：该方法会改变原始数组。

### 语法

```
arrayObject.splice(index,howmany,item1,.....,itemX)
```

| 参数              | 描述                                                         |
| ----------------- | ------------------------------------------------------------ |
| index             | 必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。 |
| howmany           | 必需。要删除的项目数量。如果设置为 0，则不会删除项目。       |
| item1, ..., itemX | 可选。向数组添加的新项目。                                   |

# JavaScript slice() 方法

## 定义和用法

slice() 方法可从已有的数组中返回选定的元素。

### 语法

```
arrayObject.slice(start,end)
```

| 参数  | 描述                                                         |
| ----- | ------------------------------------------------------------ |
| start | 必需。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。 |
| end   | 可选。规定从何处结束选取。该参数是数组片断结束处的数组下标。如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。 |

### 返回值

返回一个新的数组，包含从 start 到 end （不包括该元素）的 arrayObject 中的元素。

### 说明

请注意，该方法并不会修改数组，而是返回一个子数组。如果想删除数组中的一段元素，应该使用方法 Array.splice()。

## 提示和注释

注释：您可使用负值从数组的尾部选取元素。

注释：如果 end 未被规定，那么 slice() 方法会选取从 start 到数组结尾的所有元素。

## 实例

### 例子 1

在本例中，我们将创建一个新数组，然后显示从其中选取的元素：

```
<script type="text/javascript">

var arr = new Array(3)
arr[0] = "George"
arr[1] = "John"
arr[2] = "Thomas"

document.write(arr + "<br />")
document.write(arr.slice(1) + "<br />")
document.write(arr)

</script>
```

输出：

```
George,John,Thomas
John,Thomas
George,John,Thomas
```

### 例子 2

在本例中，我们将创建一个新数组，然后显示从其中选取的元素：

```
<script type="text/javascript">

var arr = new Array(6)
arr[0] = "George"
arr[1] = "John"
arr[2] = "Thomas"
arr[3] = "James"
arr[4] = "Adrew"
arr[5] = "Martin"

document.write(arr + "<br />")
document.write(arr.slice(2,4) + "<br />")
document.write(arr)

</script>
```

输出：

```
George,John,Thomas,James,Adrew,Martin
Thomas,James
George,John,Thomas,James,Adrew,Martin
```
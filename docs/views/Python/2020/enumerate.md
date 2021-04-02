---
title: Python enumerate() 函数
date: 2019-03-23
tags:
 - Python
categories:
 -  Python
---

## 描述

enumerate() 函数用于将一个可遍历的数据对象(如列表、元组或字符串)组合为一个索引序列，同时列出数据和数据下标，一般用在 for 循环当中。

Python 2.3. 以上版本可用，2.6 添加 start 参数。

### 语法

以下是 enumerate() 方法的语法:

```
enumerate(sequence, [start=0])
```

### 参数

- sequence -- 一个序列、迭代器或其他支持迭代对象。
- start -- 下标起始位置。

### 返回值

返回 enumerate(枚举) 对象。

------

## 实例

以下展示了使用 enumerate() 方法的实例：

```
>>>seasons = ['Spring', 'Summer', 'Fall', 'Winter']
>>> list(enumerate(seasons))
[(0, 'Spring'), (1, 'Summer'), (2, 'Fall'), (3, 'Winter')]
>>> list(enumerate(seasons, start=1))       # 下标从 1 开始
[(1, 'Spring'), (2, 'Summer'), (3, 'Fall'), (4, 'Winter')]
```

## 普通的 for 循环

```
>>>i = 0
>>> seq = ['one', 'two', 'three']
>>> for element in seq:
...     print i, seq[i]
...     i +=1
... 
0 one
1 two
2 three
```

## for 循环使用 enumerate

```
>>>seq = ['one', 'two', 'three']
>>> for i, element in enumerate(seq):
...     print i, element
... 
0 one
1 two
2 three
```

关于enumerate()函数，有以下几点需要注意：

- ① enumerate()函数是Python中的内置函数，可以直接配合for循环使用；
- ② 默认情况下，start参数索引计数器是从零开始计数的，但是你可以将其设置为任意的整数；
- ③ enumerate()函数得到的是多个值，我们需要采用“序列解包”的方式，获取到每一个元素；

在使用enumerate()函数之前，有两个概念需要解释一下：

**第一个概念是“可迭代对象”**

通俗的讲：可迭代指的就是我们可以循环获取其中的每一个元素。某对象可以使用for循环的必要条件是该对象是可迭代的。

你可能还不知道什么是可迭代对象，这里也不过多的去解释，你如果想深入了解它，可以自行下去查资料，但是这里我要讲述 **“如何判断一个对象是可迭代对象”**。

可以通过內置函数isinstance()来判断一个对象是否为可迭代对象。

```
>>> from collections.abc import Iterable
>>> isinstance("黄同学", Iterable)
True
>>> isinstance([1,True,2.3],Iterable)
True
>>> isinstance(1, Iterable)
False
>>> isinstance(range(10), Iterable)
True
```

通过上述代码演示，我们就知道哪些对象是可迭代对象，可以使用for循环，哪些对象不是可迭代对象，也不能使用for循环。

在Python基础中，我们还将到了一个**“序列”**的概念，其实序列也是一种可迭代对象，其中列表（ list）、元组（ tuple）、字符串（ str）等都是序列，因此它们也都是可迭代对象，也就都可以配合enumerate()函数使用了。
**第二个概念是“序列解包”**

通俗的说：就是一次将多个变量赋值给多个值。很简单，不要想的太高深，我们简单举个例子你就知道了。

```
x,y = (12,54)
print(x)
print(y)
```

结果如下：

```
12
54
```

## enumerate() 函数的简单使用

该函数最常就是配合for循环使用，我们就以此为例，为大家演示enumerate() 函数的用法。

需求：打印出班级中大于18岁的同学名字；

如果使用普通的for循环：

```
i = 0
name = ["张三","李四","王五"]
lis = [13,22,43]
for element in lis:
    if element >= 18:
        print(i, name[i],lis[i])
    i += 1
```

结果如下：

```
1 李四 22
2 王五 43
```

如果for循环，配合enumerate()函数使用：

```
name = ["张三","李四","王五"]
lis = [13,22,43]

for index,value in enumerate(lis):
    if value >= 18:
        print(index,name[index],value)
```

结果如下：

```
1 李四 22
2 王五 43
```

普通for循环我也就不多说了。仔细观察**for循环+enumerate()函数**的搭配使用，序列使用过该函数后，会返回元素下标和元素组合的元组，我们采用**序列解包**的方式，将其赋值给了index和value，其中index表示lis列表中每个元素的下标，value表示lis列表中每个元素的值，如所示：

```
lis = [13,22,43]
```

采用序列解包

```
for index,value in enumerate(lis):
    print(index,value)
```

```
0 13
1 22
2 43
```

不采用序列解包i

```
for i in enumerate(lis):
    print(i)
```

```
(0, 13)
(1, 22)
(2, 43)
```

可以发现：enumerate()函数默认序列第一个元素的下标为0，这个也是和Python中序列的元素访问一致。但是有时候，我们就想让第一个元素的下标变为1，第二个元素的下标变为2，怎么办呢？

```
lis = [13,22,43]
```

不使用start参数，则默认start=0

```
for index,value in enumerate(lis):
    print(index,value)
```

```
0 13
1 22
2 43
```

使用start参数，将其修改为start=1

```
for index,value in enumerate(lis, satrt=1):
    print(index,value)
```

```
1 13
2 22
3 43
```


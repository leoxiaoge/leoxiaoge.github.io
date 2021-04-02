---
title: Python -- json格式的转换
date: 2019-01-10
tags:
 - Python
categories:
 -  Python
---

json数组转json字符串：

```
# 使用dumps()函数，将列表a转换为json格式的字符串，赋值给b
a = [1,2,3,4]
b = json.dumps(a)
```

json字符串转json数组：

```
# 使用loads()函数，将json格式的字符串a转为列表，赋值给b
a = "[1,2,3,4]"
b = json.loads(a)
```



```
import json             # 引入json模块
a = [1,2,3,4]           # 创建一个列表a。
b = json.dumps(a)       # 使用dumps()函数，将列表a转换为json格式的字符串，赋值给b。
print(type(b))          # 打印b的数据类型，结果为字符串
c = json.loads(b)       # 使用loads()函数，将json格式的字符串b转为列表，赋值给c。
print(type(c))          # 打印c的数据类型，又转回列表了
```


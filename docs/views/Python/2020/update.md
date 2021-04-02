---
title: Python 合并字典
date: 2019-02-25
tags:
 - Python
categories:
 -  Python
---

给定一个字典，然后计算它们所有数字值的和。

## 实例 1 : 使用 update() 方法，第二个参数合并第一个参数

```
def Merge(dict1, dict2): 
    return(dict2.update(dict1)) 
      
# 两个字典
dict1 = {'a': 10, 'b': 8} 
dict2 = {'d': 6, 'c': 4} 
  
# 返回  None 
print(Merge(dict1, dict2)) 
  
# dict2 合并了 dict1
print(dict2)
```

执行以上代码输出结果为：

```
None
{'d': 6, 'c': 4, 'a': 10, 'b': 8}
```

## 实例 2 : 使用 **，函数将参数以字典的形式导入

```
def Merge(dict1, dict2): 
    res = {**dict1, **dict2} 
    return res 
      
# 两个字典
dict1 = {'a': 10, 'b': 8} 
dict2 = {'d': 6, 'c': 4} 
dict3 = Merge(dict1, dict2) 
print(dict3)
```

执行以上代码输出结果为：

```
{'a': 10, 'b': 8, 'd': 6, 'c': 4}
```


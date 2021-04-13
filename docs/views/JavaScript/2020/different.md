---
title: js比较两个数组对象,取出不同的值
date: 2019-08-10
tags:
 - JavaScript
categories:
 -  JavaScript
---

```
var array1 = [ { "Num" :  "A "   },{ "Num" :  "B"  }];
var array2 = [ { "Num" :  "A " , "Name" :  "t1 "  }, { "Num" :  "B" , "Name" :  "t2" }, { "Num" :  "C "  , "Name" :  "t3 " }];
var result = [];
for (var i =  0 ; i < array2.length; i++){
     var obj = array2[i];
     var num = obj.Num;
     var isExist =  false ;
     for (var j =  0 ; j < array1.length; j++){
         var aj = array1[j];
         var n = aj.Num;
         if (n == num){
             isExist =  true ;
             break ;
         }
     }
     if (!isExist){
         result.push(obj);
     }
}
console.log(result);
```


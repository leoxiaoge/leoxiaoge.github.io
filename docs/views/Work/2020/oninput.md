---
title: input框允许输入正整数最佳方案(两位小数)
date: 2018-11-15
tags:
 - Work
categories:
 -  Work
---

```
<input type="number" @keydown="handleInput2" placeholder="请输入或查看" v-model="item.SalePrice">

handleInput2(e) {
  // 通过正则过滤小数点后两位
  e.target.value = (e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]) || null
},

<input type="number" @keydown="handleInput" placeholder="请输入" v-model="SaleQty">

handleInput(e) {
  // 输入数字 不可小数
  e.target.value=e.target.value.replace(/[^\d]/g,'');
}

// 将不是数字的符号替换为空字符
oninput="this.value = this.value.replace(/[^0-9]/g, '');"
```

验证

```
$("#id").keyup(function () {
    if (isFloat($(this).val()) == true) {
        vtip(this, "请输入正确数值")
    };
})
```



```
function isFloat(theFloat) {
    theFloat = theFloat.replace(/\b(0+)/gi,"");
    //判断是否为浮点型；
    len = theFloat.length;
    dotNum = 0;
    if (len == 0)
        return true;
    for (var i = 0; i < len; i++) {
        oneNum = theFloat.substring(i, i + 1);
        if (oneNum == ".")
            dotNum++;
        if (((oneNum < "0" || oneNum > "9") && oneNum != ".") || dotNum > 1)
            return true;
    }
    if (len > 1 && theFloat.substring(0, 1) == "0") {
        if (theFloat.substring(1, 2) != ".")
            return true;
    }
    return false;
}
function BASEisNotInt(theInt) {
    theInt = theInt.replace(/\b(0+)/gi, "");
    //判断是否为整数 
    if ((theInt.length > 1 && theInt.substring(0, 1) == "0") || BASEisNotNum(theInt)) {
        return true;
    }
    return false;
}
function Big0isNotInt(theInt) {
    theInt = theInt.replace(/\b(0+)/gi, "");
    //判断是否为大于0整数 

    if ((theInt.length = 1 && theInt.substr(0, 1) == "0") || BASEisNotNum(theInt)) {
        return true;
    }
    return false;
}
function BASEisNotNum(theNum) {
    theNum = theNum.replace(/\b(0+)/gi, "");
    //判断是否为数字 
    for (var i = 0; i < theNum.length; i++) {
        oneNum = theNum.substring(i, i + 1);
        if (oneNum < "0" || oneNum > "9")
            return true;
    }
    return false;
}
```

//监听屏幕变化

```
$(window).resize(function () {
    var wrapHeight = $(window).height() - 170 - $("#breadNav").outerHeight(true) - $("#contantNav").outerHeight(true);
    $(".wrapBox").css("min-height", wrapHeight)
    //tab宽度
    var tabWidth = $(window).width() - 123;
    $(".tab").css("width", tabWidth)
})
```
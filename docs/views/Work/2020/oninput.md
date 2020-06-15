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


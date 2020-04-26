---
title: CSS居中完整指南
date: 2018-06-15
tags:
 - Work
categories:
 -  Work
---

## 水平居中

### 行内或类行内元素（比如文本和链接）

在块级父容器中让行内元素居中，只需使用 `text-align: center;`：

<iframe id="cp_embed_HulzB" src="https://codepen.io/chriscoyier/embed/HulzB?height=184&amp;theme-id=1&amp;slug-hash=HulzB&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="184" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

这种方法可以让 `inline`/`inline-block`/`inline-table`/`inline`/`flex` 等类型的元素实现居中。

### 块级元素

让块级元素居中的方法就是设置 `margin-left` 和 `margin-right` 为 `auto`（前提是已经为元素设置了适当的 `width` 宽度，否则块级元素的宽度会被拉伸为父级容器的宽度）。常见用法如下所示：

```
.center-me {
  margin: 0 auto;
}
```

<iframe id="cp_embed_eszon" src="https://codepen.io/chriscoyier/embed/eszon?height=200&amp;theme-id=1&amp;slug-hash=eszon&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="200" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

无论父级容器和块级元素的宽度如何变化，都不会影响块级元素的居中效果。

请注意，`float` 属性是不能实现元素居中的。如果你想知道使用 `float` 实现居中的非常规方案，可以参考[这篇文章](https://www.w3cplus.com/css/float-center.html)。

> 有关于水平居中更多实现方法，可以参阅早期整理的一篇博客《[六种实现元素水平居中](https://www.w3cplus.com/css/elements-horizontally-center-with-css.html)》

### 多个块级元素

如果要让多个块级元素在同一水平线上居中，那么可以修改它们的 `display` 值。这里有两个示例，其中一个使用了 `inline-block` 的显示方式，另一个使用了 `flexbox` 的显示方式：

<iframe id="cp_embed_ebing" src="https://codepen.io/chriscoyier/embed/ebing?height=438&amp;theme-id=1&amp;slug-hash=ebing&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="438" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

如果你想让多个垂直堆栈的块元素，那么仍然可以通过设置 `margin-left` 和 `margin-right` 为 `auto` 来实现：

<iframe id="cp_embed_haCGt" src="https://codepen.io/chriscoyier/embed/haCGt?height=352&amp;theme-id=1&amp;slug-hash=haCGt&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="352" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

## 垂直居中

使用 CSS 实现垂直居中需要一些技巧。

### 行内或类行内元素（比如文本和链接）

#### 单行

对于单行行内或者文本元素，只需为它们添加等值的 `padding-top` 和 `padding-bottom` 就可以实现垂直居中：

```
.link {
  padding-top: 30px;
  padding-bottom: 30px;
}
```

<iframe id="cp_embed_ldcwq" src="https://codepen.io/chriscoyier/embed/ldcwq?height=180&amp;theme-id=1&amp;slug-hash=ldcwq&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="180" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

如果因为某些原因我们不能使用 `padding` 属性来实现垂直居中，而且已知文本不会换行，那么就可以让 `line-height` 和 `center` 相等，从而实现垂直居中：

```
.center-text-trick {
  height: 100px;
  line-height: 100px;
  white-space: nowrap;
}
```

<iframe id="cp_embed_LxHmK" src="https://codepen.io/chriscoyier/embed/LxHmK?height=305&amp;theme-id=1&amp;slug-hash=LxHmK&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="305" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

#### 多行

对于多行文本，同样可以使用等值 `padding-top` 和 `padding-bottom` 的方式实现垂直居中。如果你在使用过程中发现这种方法没见效，那么你可以通过 CSS 为文本设置一个类似 `table-cell` 的父级容器，然后使用 [`vertical-align`](http://www.w3cplus.com/css/what-is-vertical-align.html) 属性实现垂直居中：

<iframe id="cp_embed_ekoFx" src="https://codepen.io/chriscoyier/embed/ekoFx?height=426&amp;theme-id=1&amp;slug-hash=ekoFx&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="426" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

此外，你还可以使用 `flexbox` 实现垂直居中，对于父级容器为 `display: flex` 的元素来说，它的每一个子元素都是垂直居中的：

```
.flex-center-vertically {
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 400px;
}
```

<iframe id="cp_embed_uHygv" src="https://codepen.io/chriscoyier/embed/uHygv?height=380&amp;theme-id=1&amp;slug-hash=uHygv&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="380" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

值得注意的是，上述方法只适用于父级容器拥有确定高度的元素。

如果上述方法都不起作用，那么你就需要使用被称为`幽灵元素（ghost element）`的非常规解决方式：在垂直居中的元素上添加伪元素，设置伪元素的高等于父级容器的高，然后为文本添加 `vertical-align: middle;` 样式，即可实现垂直居中。

```
.ghost-center {
  position: relative;
}
.ghost-center::before {
  content: " ";
  display: inline-block;
  height: 100%;
  width: 1%;
  vertical-align: middle;
}
.ghost-center p {
  display: inline-block;
  vertical-align: middle;
}
```

<iframe id="cp_embed_ofwgD" src="https://codepen.io/chriscoyier/embed/ofwgD?height=392&amp;theme-id=1&amp;slug-hash=ofwgD&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="392" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

### 块级元素

#### 已知元素的高度

无法获知元素的具体高度是非常常见的一种状况，比如：视区宽度变化，会触发布局重绘，从而改变高度；对文本施加不同的样式会改变高度；文本的内容量不同会改变高度；当宽度变化时，对于宽高比例固定的元素（比如图片），也会自动调整高度……

如果我们知道元素的高度，可以这样来实现垂直居中：

```
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  height: 100px;
  margin-top: -50px; /* account for padding and border if not using box-sizing: border-box; */
}
```

<iframe id="cp_embed_HiydJ" src="https://codepen.io/chriscoyier/embed/HiydJ?height=457&amp;theme-id=1&amp;slug-hash=HiydJ&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="457" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

#### 未知元素的高度

如果我们不知道元素的高度，那么就需要先将元素定位到容器的中心位置，然后使用 `transform` 的 `translate` 属性，将元素的中心和父容器的中心重合，从而实现垂直居中：

```
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

<iframe id="cp_embed_lpema" src="https://codepen.io/chriscoyier/embed/lpema?height=469&amp;theme-id=1&amp;slug-hash=lpema&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="469" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

#### flexbox

使用 [`flexbox`](https://www.w3cplus.com/blog/tags/157.html) 实现垂直居中非常简单：

```
.parent {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

<iframe id="cp_embed_FqDyi" src="https://codepen.io/chriscoyier/embed/FqDyi?height=471&amp;theme-id=1&amp;slug-hash=FqDyi&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="471" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

## 水平且垂直居中

通过组合水平居中和垂直居中的技巧，可以实现非常完美的居中效果。我觉得可以将它们分为三种类型：

### 宽高固定元素

设定父级容器为相对定位的容器，设定子元素绝对定位的位置 `position: absolute; top: 50%; left: 50%`，最后使用负向 `margin` 实现水平和垂直居中，`margin` 的值为宽高（具体的宽高需要根据实际情况计算 `padding`）的一半。

```
.parent {
  position: relative;
}
.child {
  width: 300px;
  height: 100px;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -70px 0 0 -170px;
}
```

<iframe id="cp_embed_JGofm" src="https://codepen.io/chriscoyier/embed/JGofm?height=386&amp;theme-id=1&amp;slug-hash=JGofm&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="386" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

### 宽高不固定元素

如果无法获取确定的宽高，同样需要设定父级容器为相对定位的容器，设定子元素绝对定位的位置 `position: absolute; top: 50%; left: 50%`。不同的是，接下来需要使用 `transform: translate(-50%, -50%);` 实现垂直居中：

```
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

<iframe id="cp_embed_lgFiq" src="https://codepen.io/chriscoyier/embed/lgFiq?height=412&amp;theme-id=1&amp;slug-hash=lgFiq&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="412" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

使用 `transform` 有一个缺陷，就是当计算结果含有小数时（比如 `0.5`），会让整个元素看起来是模糊的，一种解决方案就是为父级元素设置 `transform-style: preserve-3d;` 样式：

```
.parent-element {
  -webkit-transform-style: preserve-3d;
  -moz-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

.element {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}
```

### flexbox

使用 flexbox 实现水平和垂直居中，只需使用两条居中属性即可：

```
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

<iframe id="cp_embed_msItD" src="https://codepen.io/chriscoyier/embed/msItD?height=404&amp;theme-id=1&amp;slug-hash=msItD&amp;default-tab=result&amp;user=chriscoyier" scrolling="no" frameborder="0" height="404" allowtransparency="true" allowfullscreen="true" class="cp_embed_iframe undefined" style="box-sizing: inherit; width: 1562.78px; overflow: hidden;"></iframe>

## 结论

使用 CSS 可以让任何元素实现居中效果。
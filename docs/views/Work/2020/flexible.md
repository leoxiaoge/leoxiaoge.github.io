---
title: flexible.js 移动端自适应方案
date: 2018-06-01
tags:
 - Work
categories:
 -  Work
---

# 一、flexible.js 的使用方式：

github地址：[https://github.com/amfe/lib-flexible](https://link.jianshu.com?t=https://github.com/amfe/lib-flexible)
 官方文档地址：[https://github.com/amfe/article/issues/17](https://link.jianshu.com?t=https://github.com/amfe/article/issues/17)
 本文中有部分内容引至上面这个文档。

### （一）、引用方式

##### 1、引用cdn地址

```xml
<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.2/??flexible_css.js,flexible.js"
></script>
```

当前最新的版本是0.3.2。

##### 2、下载flexible.js 等文件到项目指定目录下，然后在head中引入。建议对于js做内联处理，在所有资源加载之前执行这个js。

下面是淘宝的写法：

```xml
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="yes" name="apple-touch-fullscreen" />
    <meta content="telephone=no,email=no" name="format-detection" />
    <meta content="maximum-dpr=2" name="flexible" />
    <script src="build/flexible_css.js"></script>
    <script src="build/flexible.js"></script>
    <title>lib.flexible</title>
</head>
```

### （二）、flexible.js原理

在页面中引入flexible.js后，flexible会在<html>标签上增加一个data-dpr属性和font-size样式（如下图）。

![img](https:////upload-images.jianshu.io/upload_images/2366172-edd6ff17b7189539.png?imageMogr2/auto-orient/strip|imageView2/2/w/490/format/webp)

flexible.png

js首先会获取设备型号，然后根据不同设备添加不同的data-dpr值，比如说1、2或者3，从源码中我们可以看到。

```jsx
if (!dpr && !scale) {
    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/iphone/gi);
    var devicePixelRatio = win.devicePixelRatio;
    if (isIPhone) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
            dpr = 3;
        } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
            dpr = 2;
        } else {
            dpr = 1;
        }
    } else {
        // 其他设备下，仍旧使用1倍的方案
        dpr = 1;
    }
    scale = 1 / dpr;
}
```

另外，页面中的元素用rem单位来设置，rem就是相对于根元素<html>的font-size来计算的，flexible.js能根据<html>的font-size计算出元素的盒模型大小。这样就意味着我们只需要在根元素确定一个px字号，因此来算出各元素的宽高，从而实现屏幕的适配效果。

### （三）、把视觉稿中的px转换成rem

工作中我们常见的视觉稿大小大至可为640、750、1125三种。不过flexible.js并没有限制只能用这三种，所以你还可以根据自身情况来调整，具体如何转换，我们以视觉稿为640px的宽来举例子，把640px分为100份，每一份称为一个单位a，那么每个a就是6.4px，而1rem单位被认定为10a，此时，1rem=1(a)X10X6.4(px)即64px。

```undefined
640px/100=6.4px                              1个单位a为6.4px
1rem = 10a                                   1rem单位被认定为10a
1rem = 1(a)*10*6.4(px) = 64px
```

因此，对于视觉稿上的元素的尺寸换算，只需要原始px值除以rem基准px值(此例子中为64px)即可。例如240px * 120px的元素，最后转换为3.75rem * 1.875rem。

#### 在开发过程中那我们如何快速的把px转换成rem呢？

##### 1、如果你用的是Sublime Text3，你可以直接在这个编辑器上安装CSSREM插件。

github地址：[https://github.com/flashlizi/cssrem](https://link.jianshu.com?t=https://github.com/flashlizi/cssrem)

##### 2、如果你用的是其他编辑器或者IDE，就可以用CSS的处理器来处理，比如说Sass、LESS以及PostCSS这样的处理器。我们简单来看两个示例。

```ruby
@function px2em($px, $base-font-size: 75px) {
  @if (unitless($px)) {
    @warn "Assuming #{$px} to be in pixels, attempting to convert it into pixels for you";
    @return px2em($px + 0px); // That may fail.
  } @else if (unit($px) == em) {
    @return $px;
  }
  @return ($px / $base-font-size) * 1em;
}
```

除了使用Sass函数外，还可以使用Sass的混合宏：

```php
@mixin px2rem($property,$px-values,$baseline-px:75px,$support-for-ie:false){
  //Conver the baseline into rems
  $baseline-rem: $baseline-px / 1rem * 1;
  //打印出第一行的像素值
  @if $support-for-ie {
    #{$property}: $px-values;
  }
  //if there is only one (numeric) value, return the property/value line for it.
  @if type-of($px-values) == "number"{
    #{$property}: $px-values / $baseline-rem;
  }
  @else {
    //Create an empty list that we can dump values into
    $rem-values:();
    @each $value in $px-values{
      // If the value is zero or not a number, return it
      @if $value == 0 or type-of($value) != "number"{
        $rem-values: append($rem-values, $value / $baseline-rem);
      }
    }
    // Return the property and its list of converted values
    #{$property}: $rem-values;
  }
}
```

### （四）、字体不使用rem的方法

工作中做完一个触屏版的页面后，我们会拿iPhone5s、iPhone6、iPhone6s等手机进行测试，他们都是Retina屏，我们当然希望在这些手机型号上看到的文本字号是相同的。也就是说，我们不希望文本在Retina屏幕下变小，另外，我们希望在大屏手机上看到更多文本（例如iPhone7、iPhone7Plus）。另外，现在绝大多数的字体文件都自带一些点阵尺寸，通常是16px和24px，都是偶数，所以我们不希望出现13px和15px这样的奇葩尺寸。
 如此一来，就决定了在制作H5的页面中，rem并不适合用到段落文本上。所以在Flexible整个适配方案中，考虑文本还是使用px作为单位。只不过使用[data-dpr]属性来区分不同dpr下的文本字号大小。

```csharp
div {
    width: 1rem;
    height: 0.4rem;
    font-size: 12px; // 默认写上dpr为1的fontSize
}
[data-dpr="2"] div {
    font-size: 24px;
}
[data-dpr="3"] div {
    font-size: 36px;
}
```

为了能更好的利于开发，在实际开发中，我们可以定制一个font-dpr()这样的Sass混合宏：

```ruby
@mixin font-dpr($font-size){
    font-size: $font-size;
 
    [data-dpr="2"] & {
        font-size: $font-size * 2;
    }
 
    [data-dpr="3"] & {
        font-size: $font-size * 3;
    }
}
```

有了这样的混合宏之后，在开发中可以直接这样使用：

```css
@include font-dpr(16px);
```

当然这只是针对于描述性的文本，比如说段落文本。但有的时候文本的字号也需要分场景的，比如在项目中有一个slogan，业务方希望这个slogan能根据不同的终端适配。针对这样的场景，完全可以使用rem给slogan做计量单位。

### （五）、viewport的meta标签。

该标签主要用来告诉浏览器如何规范的渲染Web页面，而你则需要告诉它视窗有多大。在开发移动端页面，我们需要设置meta标签如下：

```xml
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

代码以显示网页的屏幕宽度定义了视窗宽度。网页的比例和最大比例被设置为100%。

###### 而我们在使用flexible.js时候就只需要像下面这样写<meta>标签，或者干脆省略下面的标签：

```xml
<meta name="viewport" content="width=device-width, user-scalable=no">
```

或者我们也可以像flexible的github例子中那样写：

```xml
<meta content="maximum-dpr=2" name="flexible" />
```

原理：flexible.js会先去获取页面上[name="viewport"]或[name="flexible"]的meta标签，如果有就直接根据获取到的值来判断，如果没有，会自己创建一个meta标签，我们看一下源码就知道了。

```dart
var metaEl = doc.querySelector('meta[name="viewport"]');
var flexibleEl = doc.querySelector('meta[name="flexible"]');
...
if (!metaEl) {
    metaEl = doc.createElement('meta');
    metaEl.setAttribute('name', 'viewport');
    metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    if (docEl.firstElementChild) {
        docEl.firstElementChild.appendChild(metaEl);
    } else {
        var wrap = doc.createElement('div');
        wrap.appendChild(metaEl);
        doc.write(wrap.innerHTML);
    }
}
```

有了<meta>标签之后，就可以动态改写data-dpr和font-size两个属性的值，因此也就达到了适配的效果。

# 二、手动设置的相关问题：

### （一）、手动配置dpr

引入执行js之前，可以通过输出meta标签方式来手动设置dpr。语法如下：

```xml
<meta name="flexible" content="initial-dpr=2, maximum-dpr=3" />
```

注意：initial-dpr=2, maximum-dpr=3这两个参数只能选其一。

### （二）、当我们手动设置maximum-dpr=x时

在flexible的github例子中，添加maximum-dpr这个属性，content="maximum-dpr=2"，这个属性是给出一个最大的dpr限制，然后比较系统的dpr和给定的dpr，取最小值。

### （三）、当我们手动设置initial-dpr=x时

如果要使用flexible.js来做布局的话，建议不要添加这个属性，因为这个属性会把dpr强制设置为给定的值，如果手动设置initial-dpr=1之后，不管设备是多少dpr都会强制认为其dpr是你设备的值。
 另外，在flexible中，只对IOS设备进行dpr判断，对于Android系列始终认为其dpr为1，手机淘宝并没有对安卓的dpr进行一个适配。咱们可以通过flexible.js的源码来看：

```jsx
if (!dpr && !scale) {
    var isAndroid = win.navigator.appVersion.match(/android/gi);
    var isIPhone = win.navigator.appVersion.match(/iphone/gi);
    var devicePixelRatio = win.devicePixelRatio;
    if (isIPhone) {
        // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
        if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
            dpr = 3;
        } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
            dpr = 2;
        } else {
            dpr = 1;
        }
    } else {
        // 其他设备下，仍旧使用1倍的方案
        dpr = 1;
    }
    scale = 1 / dpr;
}
```

作者：[Scaukk](https://www.jianshu.com/u/3cf4ecea95fa) 在这篇[http://www.jianshu.com/p/221bebfae266](https://www.jianshu.com/p/221bebfae266)文章中是这么理解的：
 android手机屏幕大小，宽高比是花开满地，要做的调整真的是太多了。如果根元素的font-size尺寸不对，页面效果不用多说。
 就算把当前的设备信息都考虑进去了，那以后呢。
 所以，考虑开发，维护，兼容性...淘宝这么做还是有道理的。

### （四）、手动设置rem基准值的方法：

```css
html{ font-size: 60px !important; }
```

# 三、需要注意的几个地方：

### （一）、遇到下面两种情况的时候，我们在切页面的时候需要切两套图片，即@2x和@3x：

#### 1、当图标被放大时会模糊。

#### 2、当产品对页面上的图片清晰度要求很高时。

@2x为750X1334的设计稿(高度会随着内容多少而改变)。@3x为1125X2001的设计稿(高度会随着内容多少而改变)。如果要放大设计稿来切图的时候是等比放大1.5倍。

### （二）、 解决雪碧图的问题，建议能用SVG的地方就尽量用SVG，或者有些常用的图标用iconfont来替代，另外，有些小图片在遇到dpr=2时，可能会模糊，这时建议用大图来切图。

# 五、几个后期我们开发中可能会遇到的名词：

**Element.getBoundingClientRect().width** 用来获取元素自身的宽度。

**Element.getBoundingClientRect()**用来获取页面中某个元素的左、上、右、下分别相对于浏览器视窗的位置，是DOM元素到浏览器可视范围的距离（不含页面不可见部分）。

设备的px不会改变，css的px改变%（百分比）时，不会影响设备的px，只是原本设备的1个px中可能会显示多个或不足一个css的px。当缩放级别100%时，1个单位的css px严格等于1个单位的设备px。

**screen.width、screen.height**用户屏幕的完整宽度和高度。

**window.innerWidth、window.innerHeight**浏览器窗口内部宽度和高度的尺寸，包含了滚动条的尺寸。

**window.pageXOffset、window.pageYOffset**用户滚动了多少滚动条的距离。

**视窗viewport** 简单的理解，viewport是严格等于浏览器的窗口。在桌面浏览器中，viewport就是浏览器窗口的宽度高度。但在移动端设备上就有点复杂。移动端的viewport太窄，为了能更好为CSS布局服务，所以提供了两个viewport:虚拟的viewportvisualviewport和布局的viewportlayoutviewport。

**Retina** 是视网膜的意思，指显示屏的分辨率极高，使得肉眼无法分辨单个像素。

**物理像素**，也可以称为设备像素，他是显示设备中一个最微小的物理部件，每个像素可以根据操作系统设置自己的颜色和亮度。正是这些设备像素的微小距离欺骗了我们肉眼看到的图像效果。

**设备独立像素**也称为密度无关像素，可以认为是计算机坐标系统中的一个点，这个点代表一个可以由程序使用的虚拟像素(比如说CSS像素)，然后由相关系统转换为物理像素。

**CSS像素**是一个抽像的单位，主要使用在浏览器上，用来精确度量Web页面上的内容。一般情况之下，CSS像素称为与设备无关的像素(device-independent pixel)，简称DIPs。

**屏幕密度**，即设备表面上存在的像素数量，通常以每英寸有多少像素来计算（PPI）。

**设备像素比(device pixel ratio)**，简称dpr，定义了物理像素和设备独立像素的对应关系，它的值可以按下面的公式计算得到：

```undefined
设备像素比 = 物理像素 / 设备独立像素
```

众所周知，iPhone6的设备宽度和高度为375pt * 667pt,可以理解为设备的独立像素；而其dpr为2，根据上面公式，我们可以很轻松得知其物理像素为750pt * 1334pt。
 在不同的屏幕上，CSS像素所呈现的物理尺寸是一致的，而不同的是CSS像素所对应的物理像素具数是不一致的。
 在普通屏幕下1个CSS像素对应1个物理像素，而在Retina屏幕下，1个CSS像素对应的却是4个物理像素。
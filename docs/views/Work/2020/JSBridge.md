---
title: JSBridge原理
date: 2019-10-01
tags:
 - Work
categories:
 -  Work
---

为了提高开发效率，开发人员往往会使用原生app里面嵌套前端h5页面的快速开发方式，这就要涉及到h5和原生的相互调用，互相传递数据，接下来就实践项目中的交互方式做一个简单的记录分享，废话不多说，直接上正文：

由于安卓和ios的处理方式不一样，所以我们要分开处理 先贴上判断访问终端的代码

```
//判断访问终端
function browserVersion(){
    var u = navigator.userAgent;
    return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
```

## 通信原理之先了解webview

IOS容器 在IOS客户端中，我们首先要提到的是一个叫UIWebView的容器，苹果对他的介绍是：

UIWebView是一个可加载网页的对象，它有浏览记录功能，且对加载的网页内容是可编程的。说白了UIWebView有类似浏览器的功能，我们使用可以它来打开页面，并做一些定制化的功能，如可以让js调某个方法可以取到手机的GPS信息。

但需要注意的是，Safari浏览器使用的浏览器控件和UIwebView组件并不是同一个，两者在性能上有很大的差距。幸运的是，苹果发布iOS8的时候，新增了一个WKWebView组件容器，如果你的APP只考虑支持iOS8及以上版本，那么你就可以使用这个新的浏览器控件了。

WKWebView重构了原有UIWebView的14个类，3个协议，性能提升的同时，赋予了开发者更加细致的配置（这些配置仅针对客户端IOS开发，对于前端H5来说，保持两种容器调用方法的一致性很重要）。

Android容器 在安卓客户端中，webView容器与手机自带的浏览器内核一致，多为android-chrome。不存在兼容性和性能问题。

RN容器 在react-native开发中，从rn 0.37版本开始官方引入了组件，在安卓中调用原生浏览器，在IOS中默认调用的是UIWebView容器。从IOS12开始，苹果正式弃用UIWebView，统一采用WKWebView。

RN从0.57起，可指定使用WKWebView作为WebView的实现

```
// rn js code
<WebView useWebKit={true} source={{ url: 'https://m.douyu.com' }} />
```

WebView组件不要嵌套在或原生点击组件中，会造成H5内页面滚动失效

## h5向ios客户端发送消息；

在ios中，并没有现成的api让js去调用native的方法，但是UIWebView与WKWebView能够拦截h5内发起的所有网络请求。所以我们的思路就是通过在h5内发起约定好的特定协议的网络请求，如`'jsbridge://bridge2.native?params=' + encodeURIComponent(obj)`然后带上你要传递给ios的参数；然后在客户端内拦截到指定协议头的请求之后就阻止该请求并解析url上的参数，执行相应逻辑

在H5中发起这种特定协议的请求方式分两种：

- 通过localtion.href；

通过location.href有个问题，就是如果我们连续多次修改window.location.href的值，在Native层只能接收到最后一次请求，前面的请求都会被忽略掉。

- 通过iframe方式；

使用iframe方式，以唤起Native;以唤起分享组件为例

```
// h5 js code 将它封装一下
  function createIframe(url){
    var url = 'jsbridge://getShare?title=分享标题&desc=分享描述&link=http%3A%2F%2Fwww.douyu.com&cbName=jsCallClientBack';
    var iframe = document.createElement('iframe');
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.display = 'none';
    iframe.src = https://segmentfault.com/a/url;
    document.body.appendChild(iframe);
    setTimeout(function() {
        iframe.remove();
    }, 100);
  }
```

然后客户端通过拦截这个请求，并且解析出相应的方法和参数：这里以ios为例：

```
// IOS swift code
 func webView(webView: UIWebView, shouldStartLoadWithRequest request: NSURLRequest, navigationType: UIWebViewNavigationType) -> Bool {
        let url = request.URL
        let scheme = url?.scheme
        let method = url?.host
        let query = url?.query
        
        if url != nil && scheme == "jsbridge" {
            switch method! {
                case "getShare":
                    self.getShare()
                default:
                    print("default")
            }
    
            return false
        } else {
            return true
        }
    }
```

看不懂就略过，非重点。。。。。

这里我们在请求参数中加上了cbName=jsCallClientBack，这个jsCallClientBack为JS调用客户端所定义的回调函数，在业务层jsBridge封装中，我们传入一个匿名函数作为回调，底层将这个函数绑定在window的jsbridge对象下并为其定义一个独一无二的key，这个key就是jsCallClientBack，客户端在处理完逻辑后，会通过上面已经介绍过的方法来回调window下的方法。

ps: 在将回调绑定在window下时，特别注意要使用bind保持函数内this的原有指向不变

## IOS客户端调用H5方法

Native调用Javascript语言，是通过UIWebView组件的stringByEvaluatingJavaScriptFromString方法来实现的，该方法返回js脚本的执行结果。

```
// IOS swift code
webview.stringByEvaluatingJavaScriptFromString("window.methodName()")
```

从上面代码可以看出它其实就是执行了一个字符串化的js代码，调用了window下的一个对象，如果我们要让native来调用我们js写的方法，那这个方法就要在window下能访问到。但从全局考虑，我们只要暴露一个对象如JSBridge给native调用就好了。

调用客户端原生方法的回调函数也将绑在window下供客户端成功反调用，实际上一次调用客户端方法最后产生的结果是双向互相调用。

## H5调用Android客户端方法

在安卓webView中有三种调用native的方式：

通过schema方式，客户端使用`shouldOverrideUrlLoading`方法对url请求协议进行解析。这种js的调用方式与ios的一样，使用iframe来调用native方法。通过在webview页面里直接注入原生js代码方式，使用`addJavascriptInterface`方法来实现。

```
// android JAVA code
  class JSInterface {
    @JavascriptInterface
    public String getShare() {
        //...
        return "share";
    }
}
webView.addJavascriptInterface(new JSInterface(), "AndroidNativeApi");
```

上面的代码就是在页面的`window`对象里注入了`AndroidNativeApi`对象。在js里可以直接调用原生方法。

使用`prompt,console.log,alert`方式，这三个方法对js里是属性原生的，在`android webview`这一层是可以重写这三个方法的。一般我们使用`prompt`，因为这个在js里使用的不多，用来和native通讯副作用比较少。

```
 // android JAVA code
class WebChromeClient extends WebChromeClient {
    @Override
    public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
        // 重写window下的prompt，通过result返回结果
    }
    @Override
    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {

    }
    @Override
    public boolean onJsAlert(WebView view, String url, String message, JsResult result) {

    }
} 
```

一般而言安卓客户端选用1、2方案中的一种进行通信，从前端层面来讲，推荐客户端都使用`schema`协议的方式，便于前端jsBridge底层代码的维护与迭代。

## Android客户端调用H5方法

在安卓APP中，客户端通过`webview`的`loadUrl`进行调用:

```
// android JAVA code
webView.loadUrl("javascript:window.jsBridge.getShare()");
```

H5端将方法绑定在window下的对象即可，无需与IOS作区分

## H5调用RN客户端

我们知道RN的webView组件实际上就是对原生容器的二次封装，因此我们不需要直接通过`schema`协议来通信，只需要使用浏览器`postMessage、onMessage`来传递消息即可，类似于`iframe`，而真正的通信过程RN已经帮我们做了。

```
// h5 js code
window.postMessage(data);
// rn js code
<WebView
      ref="webView"
      source={require('../html/index.html')}
      injectedJavaScript={'window.androidConfig = {}'}    // 通过这个props可以在webView初始化时注入属性方法
      onMessage={e => {
          let { data } = e.nativeEvent;
        //...
      }}
 />
```

## RN客户端调用H5

`postMessage`是双向的，所以也可以在RN里发消息，H5里接消息来触发对应的回调

```
this.refs.webView.postMessage({
    cbName: 'xxx',
    param: {}
}); 
```

## 前端jsBridge的封装

在了解了js与客户端底层的通信原理后，我们可以将IOS、安卓统一封装成jsBridge提供给业务层开发调用。

```
class JsBridge {
    static lastCallTime
    constructor() {
        if (UA.isReactNative()) {
           document.addEventListener('message', function(e) {
               window.jsClientCallBack[e.data.cbName](e.data.param);
           });
         }
    }
    // 通用callNtive方法
    callClient(functionName, data, callback) {
        // 避免连续调用
        if (JsBridge.lastCallTime && (Date.now() - JsBridge.lastCallTime) < 100) {
            setTimeout(() => {
                this.callClient(functionName, data, callback);
            }, 100);
            return;
        }
        JsBridge.lastCallTime = Date.now();
    
        data = data || {};
        if (callback) {
            const cbName = randomName();
            Object.assign(data, { cbName });
            window.jsClientCallBack[cbName] = callBack.bind(this);
        }
    
        if (UA.isIOS()) {
            data.forEach((key, value) => {
                try {
                    data[key] = JSON.stringify(value);
                } catch(e) { }
            });
            var url = 'jsbridge://' + functionName + '?' parseJSON(data);
            var iframe = document.createElement('iframe');
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() => {
                iframe.remove();
            }, 100);
        } else if (UA.isAndroid()) {    //  这里安卓客户端使用的是上面说的第二种通信方法
            window.AndroidNativeApi && 
            window.AndroidNativeApi[functionName] && 
            window.AndroidNativeApi[functionName](JSON.stringify(data));
        } else if (UA.isReactNative()) {     //rn的<webView>组件可以设置props.userAgent来让H5识别
            window.postMessage(
              JSON.stringify(data);
            );
        } else {
            console.error('未获取platform信息，调取api失败');
        }
    }
    // 业务层自定义方法
    getShare(data, callBack) {
            //..
    }
}
```

在核心封装的基础上，我们可以还做更多的优化，比如将每个回调函数调用后自我销毁释放内存

## 四、调试

安卓使用`chrome://inspect`进行调试，需要翻墙 IOS使用`mac safari的develop`选项进行调试 使用RN的`http://localhost:8081/debugger-ui` 只能调试RN代码，无法调试webView代码，RN下webView调试和对应native相同，但是在c`hrome://inspect`下会出现样式问题。除非是纯RN编写，直接打包成APP，否则不建议在RN下调用webView组件。
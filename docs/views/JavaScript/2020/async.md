---
title: ES7异步编程：async/await理解
date: 2019-08-10
tags:
 - Javascript
categories:
 -  Javascript
---

在最新的ES7（ES2017）中提出的前端异步特性：async、await。

async顾名思义是“异步”的意思，async用于声明一个函数是异步的。而await从字面意思上是“等待”的意思，就是用于等待异步完成。并且await只能在async函数中使用

通常async、await都是跟随Promise一起使用的。为什么这么说呢？因为async返回的都是一个Promise对象同时async适用于任何类型的函数上。这样await得到的就是一个Promise对象(如果不是Promise对象的话那async返回的是什么 就是什么)；

await得到Promise对象之后就等待Promise接下来的resolve或者reject。

```
async function testSync() {
     const response = await new Promise(resolve => {
         setTimeout(() => {
             resolve("async await test...");
          }, 1000);
     });
     console.log(response);
}
testSync();//async await test...
```

就这样一个简单的async、await异步就完成了。使用async、await完成异步操作代码可读与写法上更像是同步的，也更容易让人理解。

## async、await串行并行处理

### 串行：等待前面一个await执行后接着执行下一个await，以此类推

```
async function asyncAwaitFn(str) {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(str)
        }, 1000);
    })
}

const serialFn = async () => { //串行执行

    console.time('serialFn')
    console.log(await asyncAwaitFn('string 1'));
    console.log(await asyncAwaitFn('string 2'));
    console.timeEnd('serialFn')
}

serialFn();
```

### 并行：将多个promise直接发起请求（先执行async所在函数），然后再进行await操作。

```
async function asyncAwaitFn(str) {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(str)
        }, 1000);
    })
}
const parallel = async () => { //并行执行
    console.time('parallel')
    const parallelOne = asyncAwaitFn('string 1');
    const parallelTwo = asyncAwaitFn('string 2')

    //直接打印
    console.log(await parallelOne)
    console.log(await parallelTwo)

    console.timeEnd('parallel')


}
parallel()
```

## async、await错误处理

JavaScript异步请求肯定会有请求失败的情况，上面也说到了async返回的是一个Promise对象。既然是返回一个Promise对象的话那处理当异步请求发生错误的时候我们就要处理reject的状态了。

在Promise中当请求reject的时候我们可以使用catch。为了保持代码的健壮性使用async、await的时候我们使用try catch来处理错误。

```
async function catchErr() {
      try {
          const errRes = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject("http error...");
                 }, 1000);
           );
                //平常我们也可以在await请求成功后通过判断当前status是不是200来判断请求是否成功
                // console.log(errRes.status, errRes.statusText);
        } catch(err) {
             console.log(err);
        }
}
catchErr(); //http error...
```

以上就是async、await使用try catch 处理错误的方式。

虽然async、await也使用到了Promise但是却减少了Promise的then处理使得整个异步请求代码清爽了许多。
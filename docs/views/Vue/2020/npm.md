---
title: 发布npm包
date: 2018-02-20
tags:
 - Vue
categories:
 -  Vue
---

## [如何发布一个npm包(基于vue)](https://www.cnblogs.com/zlp-blog/p/10718383.html)

前言：工作的时候总是使用别人的npm包，然而我有时心底会好奇自己如何发布一个npm包呢，什么时候自己的包能够被很多人喜欢并使用呢...

前提：会使用 npm，有 vue 基础，了解一点 webpack

## **一、编写自己的npm包**

　　1. 新建一个空文件夹

　　2. 进入文件夹，终端(cmd)运行 **npm init**

　　完成后会在目录下生成一个 package.json 文件

　　我们可以根据自己的需要补充文件内容

```
{
  "name": "bing-test-publish-npm",
  "version": "1.0.0",
  "description": "布一个npm包",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server --hot --inline",
    "build": "webpack --display-error-details --config webpack.config.js"
  },
  "author": "bing",
  "license": "ISC",
  "devDependencies": {
        "babel-core": "^6.26.0",
        "babel-loader": "^7.1.2",
        "babel-plugin-transform-object-rest-spread": "^6.26.0",
        "babel-plugin-transform-runtime": "^6.23.0",
        "babel-polyfill": "^6.26.0",
        "babel-preset-es2015": "^6.24.1",
        "css-loader": "^0.28.7",
        "es6-promise": "^4.1.1",
        "less": "^2.7.3",
        "less-loader": "^4.0.5",
        "style-loader": "^0.19.0",
        "url-loader": "^0.6.2",
        "vue": "^2.5.9",
        "vue-hot-reload-api": "^2.2.4",
        "vue-html-loader": "^1.2.4",
        "vue-loader": "^13.5.0",
        "vue-router": "^3.0.1",
        "vue-style-loader": "^3.0.3",
        "vue-template-compiler": "^2.5.9",
        "vuex": "^3.0.1",
        "webpack": "^3.9.1",
        "webpack-dev-server": "^2.9.5"
  }
}
```

　　3. 配置完后，命令行运行 **npm install** 安装依赖包，安装完会生成一个node_modules目录

　　4. 接下来新建两个文件夹 src(开发目录)，dist(发布目录)

　　5. 然后我们就可以在 src 目录下编写自己的组件吧

　　app.vue

```
<template>
    <div class="helloName">
        <input type="text" placeholder="请输入姓名" v-model="yourName"></input>
        <div v-if="name">hello<span class="name">{{name}}!</span></div>
    </div>
</template>
<script>
    export default {
        name:'helloName',
        data () {
            return {
                yourName: ''
            }
        },
        methods: {
 
        },
        created(){
        }
    }
</script>
<style>
</style>
```

　　index.js

```
import helloName from './app.vue'
export default helloName
```

　　webpack.dev.conf.js

```
const path = require("path");
const webpack = require("webpack");
const uglify = require("uglifyjs-webpack-plugin");
 
module.exports = {
    devtool: 'source-map',
    entry: "./src/index.js",//入口文件，src目录下的index.js文件，
    output: {
        path: path.resolve(__dirname, './dist'),//输出路径，就是新建的dist目录，
        publicPath: '/dist/',
        filename: 'helloName.min.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "less-loader" }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg|gif|ttf|svg|woff|eot)$/,
                loader: 'url-loader',
                query: {
                    limit: 30000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
}
```

　　文件写好后，我们运行 **npm run build**，结果是会在 dist 目录下生成一个 **helloName.min.js**，就是我们在 webpack.dev.conf.js 中 **filename** 的值

　　6. 将 package.json 中的 **main** 字段指向新生成的 helloName.min.js

　　7. 新建一个 **.npmignore** 文件（npm忽略文件），可以把不需要发布的文件忽略，如果只有 .gitignore，没有 .npmignore，则会使用 .gitignore

　　如：

```
.*
*.md
*.yml
build/
node_modules/
src/
test/
gulpfile.js
```



## **二、发布npm包**

　　1. 到 https://www.npmjs.com 注册一个账号

　　2. 进入你的项目根目录，运行 **npm login**

　　  会输入你的用户名、密码和邮箱

　　3. 登录成功后，执行 **npm publish**，就发布成功啦

## **三、使用自己的npm包**

 　接下来我们在其他项目中使用自己刚发布的npm包

　　1. 我们进入我们的项目目录运行 **npm** (或cnpm) **install bing-test-publish-npm**

　　2. 在需要使用此包的页面引入，并使用

```
<template>
  <div>
    我的npm包
    <helloName></helloName>
  </div>
</template>
<script>
  import helloName from 'bing-test-publish-npm'
export default {
  name: 'npm',
  data () {
    return {
    }
  },
  components: {
    helloName
  }
}
</script>
```

　　这时我发现我的控制台报错了，原来是编码错误，因此，我们需要修改更新代码

```
<template>
    <div class="helloName">
        <input type="text" placeholder="请输入姓名" v-model="yourName"></input>
        <div v-if="yourName">hello<span class="name">{{yourName}}!</span></div>
    </div>
</template>
<script>
    export default {
        name:'helloName',
        data () {
            return {
                yourName: ''
            }
        },
        methods: {
 
        },
        created(){
        }
    }
</script>
<style>
</style>
```



## **四、更新npm包**

 　1. 修改完代码后，我们需要修改 package.json 的version版本

> 规则：对于"version":"x.y.z"
>
> **1.修复bug,小改动，增加z**
>
> **2.增加了新特性，但仍能向后兼容，增加y**
>
> **3.有很大的改动，无法向后兼容,增加x**

 　2. 修改后 运行 **npm run build**, **npm publish** 就成功更新了包的版本

　　 3. 使用时需要

　　　　卸载之前安装的包 npm **uninstall** bing-test-publish-npm

　　　　重新安装 npm **install** bing-test-publish-npm

　　　　可通过 npm **list** bing-test-publish-npm 查看到版本已是最新的版本

主要参考文章

　　1. 如何制作并发布一个vue的组件npm包？ https://blog.csdn.net/hamupp/article/details/79337643

　　2. package.json  http://javascript.ruanyifeng.com/nodejs/packagejson.html
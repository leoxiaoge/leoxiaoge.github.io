---
title: vue-cli创建项目
date: 2017-06-20
tags:
 - Vue
categories:
 -  Vue
---

npm 更至最新
node >=8.9

1、全局安装

```
npm install -g @vue/cli
yarn global add @vue/cli
```

2、查看版本/是否安装成功

```
vue -V
```

3、在新文件夹下创建项目

```
vue create my-project
```

指向的vuecli3是因为上一次记录过的cli3配置，第一次执行create是没有的
 按键盘上下键可以选择默认（default）还是手动（Manually），如果选择default，一路回车执行下去就行了
 继续手动一下

4、选择配置

注意，空格键是选中与取消，A键是全选

TypeScript 支持使用 TypeScript 书写源码
 Progressive Web App (PWA) Support PWA 支持。
 Router 支持 vue-router 。
 Vuex 支持 vuex 。
 CSS Pre-processors 支持 CSS 预处理器。
 Linter / Formatter 支持代码风格检查和格式化。
 Unit Testing 支持单元测试。
 E2E Testing 支持 E2E 测试。

5、css的预处理

6、代码检测-ESLint + Prettier

7、选择语法检查方式

8、单元测试，Mocha

9、配置文件存放地方

10、询问是否记录这一次的配置，以便下次使用，如一开始的时候会显示的vuecli3配置

11、回车确定等待下载

12、装好后，启动

```
cd my-project // 进入到项目根目录
npm run serve // 启动项目
```

如果你仍然需要使用旧版本的 vue init 功能，你可以全局安装一个桥接工具

```
npm install -g @vue/cli-init
vue init webpack my-project
```


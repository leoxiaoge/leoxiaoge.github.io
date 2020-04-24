---
title: yarn 常用命令
date: 2019-10-16
tags:
 - Node
categories:
 -  Node
---

### yarn add

```
yarn add [package]@[version]
```

这将安装您的dependencies中的一个或多个包。
用 `--dev` 或 `-D` 会在 devDependencies 里安装一个或多个包。

```
yarn global add <package...>
```

全局安装依赖

对于绝大部分包来说，这是个坏习惯，因为它们是隐藏的。 最好本地安装你的依赖，这样它们都是明确的，每用你项目的人都能得到同样的依赖。
 注意：yarn add global <package...>会变成本地安装，注意顺序。

### yarn cache

```
yarn cache dir
```

运行 yarn cache dir 会打印出当前的 yarn 全局缓存在哪里。

yarn cache list --pattern <pattern> 将列出匹配指定模式的已缓存的包

示例：yarn cache list --pattern "gulp-(match|newer)"

```
yarn cache clean
```

运行此命令将清除全局缓存。 将在下次运行 yarn 或 yarn install 时重新填充。

### yarn list

```
yarn list [--depth] [--pattern]
```

默认情况下，所有包和它们的依赖会被显示。 要限制依赖的深度，你可以给 list 命令添加一个标志 --depth 所需的深度。

示例：yarn list --depth=0

### yarn remove

```
yarn remove <package...>
```

运行 `yarn remove foo` 会从你的直接依赖里移除名为 `foo` 的包，在此期间会更新你的 `package.json` 和 `yarn.lock` 文件。

### yarn run

```
yarn run [script] [<args>]
```

如果你已经在你的包里定义了 `scripts`，这个命令会运行指定的 `[script]`。例如：
运行这个命令会执行你的 `package.json` 里名为 `"test"` 的脚本。

### yarn upgrade

```
yarn upgrade [package | package@tag | package@version | @scope/]... [--ignore-engines] [--pattern]
```

可以选择指定一个或多个包名称。指定包名称时，将只升级这些包。未指定包名称时，将升级所有依赖项。

查看npm上已经全局安装的命令

```
npm list -g --depth=0
```

查看yarn 全局安装的根目录

```
yarn global bin
```

查看npm 全局安装的根目录

```
npm bin
```

yarn windows 安装

```
choco install yarn
```

 或者 

```
scoop install yarn
```

 或者下载安装包

yarn指定淘宝源 :

```
yarn config set registry http://registry.npm.taobao.org
```


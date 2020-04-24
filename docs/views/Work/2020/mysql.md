---
title: MySQL 安装及建议
date: 2019-12-15
tags:
 - Work
categories:
 -  Work
---

## **一、官网下载安装包**

## **1. 选择版本**

> 推荐文章：[MySQL各个版本区别](https://link.zhihu.com/?target=https%3A//www.cnblogs.com/lisuyun/p/4225560.html)，这篇文章关于各版本之间的区别说得十分详细，以及介绍了一些其他概念。比如 GA，msi，zip 等等。墙裂建议先读此篇文章。
> GA：通用版本，下载时的首选。

我们一般选择的是 MySQL Community Server ，社区版本，是官方免费供给我们使用的。

所以我们进入这个页面下载即可：

https://dev.mysql.com/downloads/mysql/

![img](https://pic1.zhimg.com/80/v2-f7c195e72c3742b3dc7e75c4b5ad13fc_720w.jpg)页面内容

## **2. 选择版本号**

> 推荐下载 5.7.23 版本号。

页面向下拉至最后，会出现最新版本的下载界面，书写此篇文章时最新的版本号为 8.0.12。

![img](https://pic3.zhimg.com/80/v2-9b46a28c55014f63d78a88e990d473ae_720w.jpg)最新版本下载页面

点击右边的”Looking for previous GA versions?“（查找之前的稳定版本？），会出现选择其他稳定版本的内容。

![img](https://pic1.zhimg.com/80/v2-29195d80cbf7385b79bb0d37fb02dae4_720w.jpg)其他稳定版本下载页面

## **3. 选择下载格式**

> 引用前文推荐文章内的概念：
> mysql-xxx-win64.msi，windows安装包，msi安装包是用msiexec安装完成的。windows下双击根据向导安装即可，简单方便。
> mysql-xxx.zip，这个是windows源文件，需要编译。
> mysql-xxx-win64.zip，这个文件解压缩后即可使用，是编译好的windows64位MySQL。需要手工配置。

推荐下载 ZIP Archive 内的软件包，`mysql-xxx-win64.zip`。

之前使用 msi 和 zip 各安装了一次，前者比后者繁琐太多太多。

![img](https://pic1.zhimg.com/80/v2-28179dfb9d4805517fa1989c9b788980_720w.jpg)选择下载格式

## **二、安装 MySQL**

## **1. 解压缩软件包**

新建 MySQL 文件夹，解压缩下载包，进入文件夹 `mysql-5.7.23-winx64`。

之后的操作基本都在此文件夹内。注意路径替换，我的路径是：

> C:\Program Files\mysql-5.7.23-winx64

## **2. 配置环境变量**

> 方便调用数据库，相当于一个快捷方式。

① win+q，输入“环境”，选择”编辑系统环境变量“，点击”环境变量“；

![img](https://pic2.zhimg.com/80/v2-c53ef88fc8c84a3496c766704d07d5f1_720w.jpg)打开环境变量

② 在下方的”系统变量“内，新建一个 `MYSQL_HOME` 变量，输入你的 MySQL 解压缩后文件夹的目录；

> 在地址栏右键，“将地址复制为文本”，粘贴即可
> `C:\Program Files\mysql-5.7.23-winx64`

![img](https://pic4.zhimg.com/80/v2-8a58c5cce114129b8d749d7a0eae4ebf_720w.jpg)

③ 在“系统变量内”找到其中的 “Path” 变量，双击打开，再最后加上

> `%MYSQL_HOME%\bin`
> 如果打开不是这样的框，请继续向下看。

![img](https://pic3.zhimg.com/80/v2-0e4ad69769eda4ddd145b882eea2ea66_720w.jpg)在 Path 内添加变量

如果打开 `Path` 是这样的框，则直接添加在文字尾部即可，但需要注意前后都要有 `;` 。

![img](https://pic2.zhimg.com/80/v2-1e265ce1d2aa1fcd13116aefc22a398d_720w.jpg)旧式 Path

## **3. 配置文件**

## **新建 my.ini 文件**

进入解压缩后的文件内（mysql-5.7.23-winx64），新建 my.ini 文件。

> 两种新建方法：
> ① 新建 txt 文件，再重命名文件为 `my.ini`（后缀名显示：菜单栏->查看->文件扩展名，勾上）；
> ② shift+右键，“在此处打开命令提示符”或者“在此处打开 Powershell"，输入 `echo > my.ini`。

![img](https://pic1.zhimg.com/80/v2-da06d5edbacfd0c9f0aa318acf1f6164_720w.jpg)my.ini文件

## **输入配置内容**

双击 `my.ini` 文件默认记事本打开。

请注意输入的内容中 `basedir` 和 `datadir` 是**你自己的目录**

> ctrl + A 全选

```text
[mysql]  
# 设置 mysql 客户端默认字符集  
default-character-set=utf8 
 
[mysqld]  
#设置 3306 端口  
port = 3306  

# 设置 mysql 的安装目录  
basedir=C:\Program Files\mysql-5.7.23-winx64

# 设置 mysql 数据库的数据的存放目录  
datadir=C:\Program Files\mysql-5.7.23-winx64\data 

# 允许最大连接数  
max_connections=200  

# 服务端使用的字符集默认为 8 比特编码的 latin1 字符集  
character-set-server=utf8  

# 创建新表时将使用的默认存储引擎  
default-storage-engine=INNODB
```

## **4. 安装命令**

> 以下命令必须以管理员身份进行！

## **以管理员身份打开命令行**

win+x 后按 a 键，命令提示符（管理员）；一定要以**管理员身份**打开。

我这里是 powershell，两个基本功能类似。

## **定位至 bin 文件夹内**

cd XXXX：其中的 XXXX为你的 MySQL 安装目录，跟之前一样，复制粘贴即可。

> ```
> cd C:\"Program Files"\mysql-5.7.23-winx64\bin`
> 如果路径中，某文件夹含有空格，需要加上 `""
> ```

![img](https://pic3.zhimg.com/80/v2-989abb40c2432811ea916c4d867e638e_720w.jpg)定位至 bin 文件夹内

## **建立默认数据库**

输入下面这个语句新建 data 文件夹：

```text
mysqld --initialize-insecure --user=mysql
```

之后你会发现多了一个 data 文件夹，如下图内容；此时 MySQL 建立了默认的数据库，用户名为 root，密码为空。

![img](https://pic3.zhimg.com/80/v2-483297ca3300f232608fe30431119042_720w.jpg)data 文件夹

## **安装服务**

输入下面语句：

```text
mysqld -install
```

第一次安装的话会显示 "Service successfully installed."

如果已经安装过了，会显示"The service already exists! ..."，如下图：

![img](https://pic2.zhimg.com/80/v2-a18f483ca942f54c27e4c590112afc89_720w.jpg)安装服务

如果需要移除服务：

> 切换 MySQL 版本的时候，需要先移除服务再安装。感觉免安装，切换版本挺容易的。
> 需要在原先的文件夹内 remove ，再在当前的文件夹内 install

```text
mysqld -remove
```

![img](https://pic3.zhimg.com/80/v2-e5977cdd9a9d607ea7c81ccfe10a6f22_720w.png)移除服务

## **三、进入 MySQL**

## **1. 启动服务**

```text
net start mysql
```

![img](https://pic3.zhimg.com/80/v2-ac8d7b56faf6fc092db237c18acc1ec2_720w.png)启动 MySQL 服务

## **2. 登录**

输入登录语句：-u 指的是登录的用户名，-p 是密码，因为是默认安装的数据库，此时密码为空，回车即可。

```text
mysql -u root -p //默认为 root，mysql -u <用户名> -p <密码>
```

![img](https://pic3.zhimg.com/80/v2-f167e4d0dfd893a1fd9b625b33c57916_720w.jpg)登录 MySQL

## **3. 设置密码**

为了避免之后出现登录问题，登陆后第一件事情就是修改密码。

new_password 部分是你的新密码部分，自行修改。

> 注意结尾的分号：";"
> 注意密码在单引号内部：'password'

```text
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
```

![img](https://pic4.zhimg.com/80/v2-c2d30ff1cd568bf3d7e65d5afb3ba7e3_720w.jpg)修改密码

## **4. 操作数据库**

现在我们就可以操作数据库啦，如何操作数据库这部分就不深入了。

这是默认的建立数据哦~

![img](https://pic4.zhimg.com/80/v2-f2e8ee6217aed01d36ebcb6d31a92f23_720w.jpg)显示数据库列表

## **5. 退出和停止**

不使用的时候最好停止 MySQL 服务~

```text
quit  // 退出
net stop mysql // 停止服务
```

![img](https://pic4.zhimg.com/80/v2-afe5943c632b88f45611e2c8c957171f_720w.jpg)退出和关闭 MySQL 服务

## **四、图形界面 HeidiSQL**

命令行有它的优点，但图像界面（GUI）也有它的优点。最后介绍一款简洁的数据库管理的 GUI。

## **1. 下载并解压**

官方链接：[https://www.heidisql.com/download.php](https://link.zhihu.com/?target=https%3A//www.heidisql.com/download.php)

![img](https://pic2.zhimg.com/80/v2-58942a4f9848306cd49ab220459b5825_720w.jpg)下载 HeidiSQL

解压后找到“heidisql.exe"打开即可。

## **2. 新建链接**

此时需要 **MySQL 服务在运行**哦~

输入数据库的密码，打开即可。如果有需要，可以修改此会话的名称等等操作。

> 在命令行开启服务 net start mysql，记得要关闭服务哟~

![img](https://pic4.zhimg.com/80/v2-0a6608ea871eaea0aff84daa2ff4809f_720w.jpg)GUI 下输入密码准备链接数据库

## **3. 成功链接~**

我们已经进入数据库了，可以看到左边的数据与之前命令行内的 show databases 显示的数据是一致的~

之后就是操作数据库咯。

![img](https://pic1.zhimg.com/80/v2-d88d5eb767d0f8b5e5f7353c4a3990b8_720w.jpg)GUI 下成功链接数据库
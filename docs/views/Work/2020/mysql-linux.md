---
title: linux下安装mysql数据库与相关操作
date: 2019-12-15
tags:
 - Work
categories:
 -  Work
---

**简介：** 如下命令都是用root身份安装，或者在命令前加上sudo 采用yum安装方式安装 yum install mysql #安装mysql客户端 yum install mysql-server #安装mysql服务端 判断MYSQL是否安装好: chkconfig --list|grep m...

如下命令都是用root身份安装，或者在命令前加上sudo

采用yum安装方式安装

#安装mysql客户端

```
yum install mysql
```

#安装mysql服务端

```
yum install mysql-server
```

判断MYSQL是否安装好:

```
chkconfig --list|grep mysql
```

启动mysql服务:

```
service mysqld start
```

 或者

```
/etc/init.d/mysqld start
```

检查是否启动mysql服务:

```
/etc/init.d/mysqld status
```

设置MySQL开机启动:

```
chkconfig mysqld on
```

检查设置MySQL开机启动是否配置成功:

```
chkconfig --list|grep mysql
```

创建root管理员

```
mysqladmin -uroot password root
```

登录

```
mysql -uroot -proot
```

 

 

 重新设置用户密码

方法一：
在mysql系统外，使用mysqladmin
**mysqladmin -u root -p password "test123"**
nter password: 【输入原来的密码】

方法二：
通过登录mysql系统，
**mysql -uroot -p**
Enter password: 【输入原来的密码】
mysql>**use mysql;**
mysql> **update user set password=passworD("test") where user='root';**
mysql> **flush privileges;**
mysql> **exit;**   

 

 

mysql导入.sql文件

```
use database;
source sql文件绝对路径;
```


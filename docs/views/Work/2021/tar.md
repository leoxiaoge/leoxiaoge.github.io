---
title: 文件夹打包tar.gz
date: 2017-06-15
tags:
 - Work
categories:
 -  Work
---

#### 文件夹打包tar.gz

```
tar -cf html.tar.gz html
```

### **tar.gz解压**

```
tar -zxvf log.tar.gz
```

#### **上传文件到Linux目录**

```
pscp -pw 123456 html.tar.gz root@192.168.21.180:/home/nginx/
```

**1、上传文件到Linux目录**

windows-->linux：pscp -pw linux密码 windows文件名 linux用户名@linuxIP:linux路径

```
 pscp -pw 123456 console_1.0.7.jar root@192.168.21.180:/home/work/
```

**2、上传文件目录到Linux目录**windows-->linux：pscp -pw linux密码 -r windows文件名 linux用户名@linuxIP:linux路径

```
 pscp -pw 123456 -r C:/test root@192.168.21.180:/home/work/
```

**3、从Linux上下载文件到windows目录**linux-->windows：pscp -pw linux密码 linux用户名@linuxIP:linux文件 windows路径

```
 pscp -pw 123456 root@192.168.21.180:/home/work/CpLcp/dmr.env C:/
```

**4、从Linux上下载文件目录到windows目录**linux-->windows：pscp -pw linux密码 linux用户名@linuxIP:linux文件夹 windows路径

```
 pscp -pw 1 root@192.168.21.180:/home/work/CpLcp/ C:/
```

Mac的终端是十分强大 , 可以通过命令进行上传下载

##### 1.下载文件

```
scp -r 远程登录服务器用户名@远程服务器ip地址:/下载文件夹的目录 本地目录
```

##### 2.上传文件夹

```
scp  -r  本地目录 远程登录服务器用户名@远程服务器ip地址:/下载文件夹的目录
```

##### 3.上传文件

```
scp 本地目录  远程登录服务器用户名@远程服务器ip地址:/下载文件的目录
```


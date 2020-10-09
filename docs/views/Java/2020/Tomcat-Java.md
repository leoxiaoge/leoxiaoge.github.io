---
title: Tomcat部署Java Web项目教程
date: 2020-02-15
tags:
 - Java
categories:
 -  Java
---

**简介：** Tomcat是一个开源的且免费的Java Web服务器，常用来作为web开发的工具。它可以托管由servlet，JSP页面（动态内容），HTML页面，js，样式表，图片（静态内容）组成的Java Web应用程序，本文教你怎样使用Tomcat部署Java Web项目。

Tomcat是一个开源的且免费的Java Web服务器，常用来作为web开发的工具。它可以托管由servlet，JSP页面（动态内容），HTML页面，js，样式表，图片（静态内容）组成的Java Web应用程序。

JDK版本下载

https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html

**部署方式**

在阿里云服务器下部署JAVA提供三种部署方式:

- **JAVA镜像部署**

JAVA环境（CentOS7.2 Nginx Tomcat8 JDK）

- **一键安装包部署**

OneinStack一键PHP JAVA安装工具《专业版》

- **手动部署（源码编译安装/YUM安装）**

一般推荐镜像部署适合新手使用更加快捷方便，安装包部署以及手动部署适合对Linux命令有基本了解的用户，可以满足用户个性化部署的要求。本教程主要介绍镜像和手工部署的方式。

**镜像部署**

\1. 单击 **JAVA环境（CentOS7.2 Nginx Tomcat8 JDK）**进入镜像详情页。

\2. 单击 ***\*立即购买\****，按提示步骤购买 ECS 实例。

\3. 登录 [**ECS 管理控制台**](https://ecs.console.aliyun.com/?spm=a2c6h.12873639.0.0.1864178fbKLQCa#/home)。

\4. 在左边导航栏里，单击 ***\*实例\****，进入 ECS 实例列表页。

\5. 选择所购 ECS 实例所在的地域，并找到所购 ECS 实例，在 ***\*IP 地址\**** 列获取该实例的公网 IP 地址。

\6. 在浏览器地址栏中输入公网 IP 地址，下载操作文档。

![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/32285c7cff36f1f6f4230ae06430d70ba9a1edc8.png)

\7. 使用putty登录Linux服务器，参考[**《连接Linux实例》**](https://help.aliyun.com/document_detail/25434.html)；忘记root密码参考**[《重置实例密码》](https://help.aliyun.com/document_detail/25439.html)**。

\8. 使用winscp工具将Java代码放入**/data/wwwroot/default中**。

![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/5ca33af8c42d790ee6657409651c62d45ea4e84d.png)

\9. 默认tomcat是以一般www用户运行，将网站代码权限改为www，执行下面命令：

```none
chown -R www.www /data/wwwroot
```

![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/e31a51838939a08b7bb032a892d6a32a3e5bfed5.png)

\10. 重启tomcat

![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/76b0b622201f0674edb542605ae547435032bb8a.png)

\11. 在浏览器地址栏中输入公网 IP 地址，验证。出现 ***\*If you're seeing this...\**** 字样，标明安装成功。

 

**手工部署**

系统平台：CentOS 7.3

Tomcat版本：Tomcat8.5.13

JDK版本：JDK1.8.0_121

**安装前准备**

CentOS 7.3系统默认开启了防火墙，需关闭后外部才可访问本机的80、443、8080等端口，如需做安全类配置可自行参考官方文档。

- 关闭防火墙：



```none
systemctl stop firewalld.service	
```

- 关闭防火墙开机自启动：

```none
systemctl disable firewalld.service
```

- 创建一般用户www，运行tomcat：

```none
useradd www
```

- 创建网站根目录：

```none
mkdir -p /data/wwwroot/default
```

- 新建Tomcat测试页面：

```none
echo Tomcat test > /data/wwwroot/default/index.jsp
chown -R www.www /data/wwwroot
```



***\*![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/289ae1403360fb94d500ca1c2c4418f8d90f41f1.png)
\****

**源代码下载**

```none
wget https://mirrors.aliyun.com/apache/tomcat/tomcat-8/v8.5.13/bin/apache-tomcat-8.5.13.tar.gz
wget http://mirrors.linuxeye.com/jdk/jdk-8u121-linux-x64.tar.gz
```

**安装JDK**

- 新建一个目录：

```none
mkdir /usr/java
```

- 解压**jdk-8u121-linux-x64.tar.gz**到/usr/java

```none
tar xzf jdk-8u121-linux-x64.tar.gz -C /usr/java  
```

![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/0f506872d364ac9d6e8325dd34d81ab117b407ef.png)

- 设置环境变量

```none
vi /etc/profile
#set java environment
export JAVA_HOME=/usr/java/jdk1.8.0_121
export CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib
export PATH=$JAVA_HOME/bin:$PATH
```

- 加载环境变量：

```none
source /etc/profile
```

- 查看jdk版本：

```none
java -version
```

**![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/4a98341091819b4bbbdd6dfe08cf6e56a470b9bc.png)
**

**安装Tomcat**

- 解压**apache-tomcat-8.5.13.tar.gz**，重命名tomcat目录，设置用户权限

```none
tar xzf apache-tomcat-8.5.13.tar.gz
mv apache-tomcat-8.5.13 /usr/local/tomcat
chown -R www.www /usr/local/tomcat
```

说明：

**bin：**目录中存放Tomcat的一些脚本文件，包含启动和关闭tomcat服务脚本。

**conf：**存放Tomcat服务器的各种全局配置文件，其中最重要的是server.xml和web.xml

**webapps：**Tomcat的主要Web发布目录，默认情况下把Web应用文件放于此目录

**logs：**存放Tomcat执行时的日志文件

- 配置**server.xml**

```none
cd /usr/local/tomcat/conf/
mv server.xml server.xml_bk
```

**vi server.xml** 添加如下内容：

```none
<?xml version="1.0" encoding="UTF-8"?>
<Server port="8006" shutdown="SHUTDOWN">
  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener"/>
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener"/>
  <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener"/>
  <Listener className="org.apache.catalina.core.AprLifecycleListener"/>
  <GlobalNamingResources>
    <Resource name="UserDatabase" auth="Container"
              type="org.apache.catalina.UserDatabase"
              description="User database that can be updated and saved"
              factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
              pathname="conf/tomcat-users.xml" />
  </GlobalNamingResources>

  <Service name="Catalina">
    <Connector port="8080"
              protocol="HTTP/1.1"
              connectionTimeout="20000"
              redirectPort="8443"
              maxThreads="1000"
              minSpareThreads="20"
              acceptCount="1000"
              maxHttpHeaderSize="65536"
              debug="0"
              disableUploadTimeout="true"
              useBodyEncodingForURI="true"
              enableLookups="false"
              URIEncoding="UTF-8" />
    <Engine name="Catalina" defaultHost="localhost">
      <Realm className="org.apache.catalina.realm.LockOutRealm">
        <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
               resourceName="UserDatabase"/>
      </Realm>
      <Host name="localhost" appBase="/data/wwwroot/default" unpackWARs="true" autoDeploy="true">
        <Context path="" docBase="/data/wwwroot/default" debug="0" reloadable="false" crossContext="true"/>
        <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
          prefix="localhost_access_log." suffix=".txt" pattern="%h %l %u %t "%r" %s %b" />
      </Host>
    </Engine>
  </Service>
</Server>
```

- 设置JVM内存参数

```none
vi /usr/local/tomcat/bin/setenv.sh
JAVA_OPTS='-Djava.security.egd=file:/dev/./urandom -server -Xms256m -Xmx496m -Dfile.encoding=UTF-8'
```

- 设置tomcat自启动脚本

下载脚本：

```none
wget https://github.com/lj2007331/oneinstack/raw/master/init.d/Tomcat-init
mv Tomcat-init /etc/init.d/tomcat
```

添加执行权限：

```none
chmod +x /etc/init.d/tomcat
```

设置启动脚本JAVA_HOME：

```none
sed -i 's@^export JAVA_HOME=.*@export JAVA_HOME=/usr/java/jdk1.8.0_121@' /etc/init.d/tomcat
```

![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/6e9eb229aade67c66c92835530e197952c48b0e2.png)

- 设置自启动

```none
chkconfig --add tomcat        
chkconfig tomcat on
```

- 启动tomcat

```none
service tomcat start
```

![Tomcat部署Java Web项目教程](https://yqfile.alicdn.com/0083c35a70906088e9b6a24c45e09480094a8e99.png)

- 在浏览器地址栏中输入**http://ip:8080**，即可访问
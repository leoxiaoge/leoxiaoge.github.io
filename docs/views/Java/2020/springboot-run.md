---
title: spring-boot的三种启动方式
date: 2020-04-15
tags:
 - Java
categories:
 -  Java
---

```
mvn spring-boot:run
```

spring-boot的启动方式主要有三种:

1. 运行带有main方法类
2. 通过命令行 java -jar 的方式
3. 通过spring-boot-plugin的方式

## 一、执行带有main方法类

    这种方式很简单，我主要是通过idea的方式，进行执行。这种方式在启动的时候，会去自动加载classpath下的配置文件
    
    (这里只是单独的强调了classpath下，其实spring-boot有自己的加载路径和优先级的，日后在发布).

```
@RestController
@EnableAutoConfiguration
public class Example {

    @RequestMapping("/")
    public String home() {
        return "Hello World";
    }
     
    public static void main(String[] args) {
        /**
         * SpringApplication会自动加载application.properties文件，具体的加载路径包含以下:
         * <p>
         *     1. A <b>/config</b> subdirectory of the current directory;
         *     <p/>
         * <p>
         *     2. The Current Directory
         * </p>
         * <p>
         *     3. A classpath /config package
         * </p>
         * <p>
         *     4. The classpath root.
         * </p>
         */
        SpringApplication.run(Example.class, args);
    }

}
```


在idea中，可以通过配置application的方式配置上自己请求参数

## 二、通过java -jar的方式

```
java -jar jar_path --param
```


jar_path: 指代将项目打包为jar打包之后的存储路径

--param: 为需要在命令行指定的参数。例如:

java -jar emample.jar --server.port=8081
该命令通过在启动行指定了项目启动后绑定的端口号，因为该命令行参数，将会覆盖application.properties中的端口配置

## 三、通过spring-boot-plugin方式启动

如果需要正常使用该maven查件，需要我们在maven项目中增加以下插件配置:

```
<plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <!--<version>${spring.boot.version}</version>-->
                <!--<executions>-->
                    <!--<execution>-->
                        <!--<goals>-->
                            <!--<goal>repackage</goal>-->
                        <!--</goals>-->
                    <!--</execution>-->
                <!--</executions>-->
            </plugin>
```

注: 因为我在项目中指定了父模块 spring-boot-starter-parent。因此我不需要单独指定插件版本，该父模块会自动匹配与当前spring-boot版本相匹配的查件版本。

```
<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.10.RELEASE</version>

        <!--<groupId>com.spring.sourcecode</groupId>-->
        <!--<artifactId>learn.spring</artifactId>-->
        <!--<version>1.0-SNAPSHOT</version>-->
    </parent>


```

准备工作做好之后，我们需要进入项目的根目录，执行
mvn sprint-boot:run
该命令能够正常启动项目，但是如何为其指定执行参数呢?

spring-boot:run该maven查件在插件首页中指定了相关能够使用的可选参数：

通过查阅文档，可以通过命令的方式查看具体选项的意义以及用法:

```
mvn spring-boot:help -Ddetail
```

其中arguments的描述中，大意为：指定的参数会传递给具体应用，如果有多个参数需要指定，以","进行分割。具体用法通过run.arguments来指定：

```
mvn spring-boot:run -Drun.arguments="--server.port=8888"
```


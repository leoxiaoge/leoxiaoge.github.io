---
title: 什么是token及怎样生成token
date: 2018-06-01
tags:
 - Work
categories:
 -  Work
---

## **什么是token**

　　Token是服务端生成的一串字符串，以作客户端进行请求的一个令牌，当第一次登录后，服务器生成一个Token便将此Token返回给客户端，以后客户端只需带上这个Token前来请求数据即可，无需再次带上用户名和密码。

　　基于 Token 的身份验证

1. 使用基于 Token 的身份验证方法，在服务端不需要存储用户的登录记录。流程是这样的：
2. 客户端使用用户名跟密码请求登录
3. 服务端收到请求，去验证用户名与密码
4. 验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端
5. 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里
6. 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token
7. 服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据
8. APP登录的时候发送加密的用户名和密码到服务器，服务器验证用户名和密码，如果成功，以某种方式比如随机生成32位的字符串作为token，存储到服务器中，并返回token到APP，以后APP请求时，
9. 凡是需要验证的地方都要带上该token，然后服务器端验证token，成功返回所需要的结果，失败返回错误信息，让他重新登录。其中服务器上token设置一个有效期，每次APP请求的时候都验证token和有效期。

## **token的优势**

### 　　**1.无状态、可扩展**

​    在客户端存储的Tokens是无状态的，并且能够被扩展。基于这种无状态和不存储Session信息，负载负载均衡器能够将用户信息从一个服务传到其他服务器上。如果我们将已验证的用户的信息保存在Session中，则每次请求都需要用户向已验证的服务器发送验证信息(称为Session亲和性)。用户量大时，可能会造成 一些拥堵。但是不要着急。使用tokens之后这些问题都迎刃而解，因为tokens自己hold住了用户的验证信息。

### 　　**2.安全性**

　　请求中发送token而不再是发送cookie能够防止CSRF(跨站请求伪造)。即使在客户端使用cookie存储token，cookie也仅仅是一个存储机制而不是用于认证。不将信息存储在Session中，让我们少了对session操作。token是有时效的，一段时间之后用户需要重新验证。我们也不一定需要等到token自动失效，token有撤回的操作，通过token revocataion可以使一个特定的token或是一组有相同认证的token无效。

### 　　**3.可扩展性**

　　Tokens能够创建与其它程序共享权限的程序。当通过服务登录Twitter(我们将这个过程Buffer)时，我们可以将这些Buffer附到Twitter的数据流上(we are allowing Buffer to post to our Twitter stream)。使用tokens时，可以提供可选的权限给第三方应用程序。当用户想让另一个应用程序访问它们的数据，我们可以通过建立自己的API，得出特殊权限的tokens。

### 　　**4.多平台跨域**

　　我们提前先来谈论一下CORS(跨域资源共享)，对应用程序和服务进行扩展的时候，需要介入各种各种的设备和应用程序。Having our API just serve data, we can also make the design choice to serve assets from a CDN. This eliminates the issues that CORS brings up after we set a quick header configuration for our application.只要用户有一个通过了验证的token，数据和资源就能够在任何域上被请求到。Access-Control-Allow-Origin: *

### 　　**5.基于标准**

　　创建token的时候，你可以设定一些选项。我们在后续的文章中会进行更加详尽的描述，但是标准的用法会在JSON Web Tokens体现。最近的程序和文档是供给JSON Web Tokens的。它支持众多的语言。这意味在未来的使用中你可以真正的转换你的认证机制。

## *token原理*

　　1.将荷载payload，以及Header信息进行Base64加密，形成密文payload密文，header密文。

　　2.将形成的密文用句号链接起来，用服务端秘钥进行HS256加密，生成签名.

　　3.将前面的两个密文后面用句号链接签名形成最终的token返回给服务端

注：

　　（1）用户请求时携带此token(分为三部分，header密文，payload密文，签名)到服务端，服务端解析第一部分(header密文)，用Base64解密，可以知道用了什么算法进行签名，此处解析发现是HS256。

　　（2）服务端使用原来的秘钥与密文(header密文+"."+payload密文)同样进行HS256运算，然后用生成的签名与token携带的签名进行对比，若一致说明token合法，不一致说明原文被修改。

　　（3）判断是否过期，客户端通过用Base64解密第二部分（payload密文），可以知道荷载中授权时间，以及有效期。通过这个与当前时间对比发现token是否过期。

## **token实现思路**

　　1.用户登录校验，校验成功后就返回Token给客户端。

　　2.客户端收到数据后保存在客户端

　　3.客户端每次访问API是携带Token到服务器端。

　　4.服务器端采用filter过滤器校验。校验成功则返回请求数据，校验失败则返回错误码

## **token代码生成工具类demo**

```
package com.frank.common.utils;

import com.alibaba.fastjson.JSON;
import com.frank.common.entity.TokenHeader;
import com.frank.common.entity.TokenPlayload;
import com.frank.common.entity.User;

import java.rmi.server.UID;
import java.util.UUID;

/**
* Description:Token生成工具
* 第一部分我们称它为头部（header),第二部分我们称其为载荷（payload, 类似于飞机上承载的物品)，第三部分是签证（signature).
*/
public class TokenUtil {
public static final String TOKEN_AES_KEY = "xiangli8Token";
public static final String REFREH_TOKEN_AES_KEY = "xiangli8RefreshToken";
public static final String JWT_TYP = "JWT";
public static final String JWT_ALG = "AES";
public static final String JWT_EXP = "30";
public static final String JWT_ISS = "xiangli8";

/**
* 获得token
* @param data 自定义数据
* @param <T> 自定义数据
* @return
* @throws Exception
*/
public static <T> String getToken(T data) throws Exception {
  TokenPlayload<T> userTokenPlayload = new TokenPlayload<>();
  userTokenPlayload.setExpData(data);
  String jwt = createJWT(userTokenPlayload);
  return jwt;
}

/**
* 生成jwt的header部分内容
* @return
* @throws Exception
*/
private static String tokenHeaderBase64() throws Exception {
  TokenHeader tokenHeader = new TokenHeader();
  tokenHeader.setTyp(JWT_TYP);
  tokenHeader.setAlg(JWT_ALG);

  String headerJson = JSON.toJSONString(tokenHeader);

  String headerBase64 = Base64Util.encryptBASE64(headerJson.getBytes());

  return headerBase64;
}

/**
* 生成jwt的payload部分内容
* @param tokenPlayload
* @param <T>自定义的数据块
* @return
* @throws Exception
*/
private static <T> String tokenPayloadBase64(TokenPlayload<T> tokenPlayload) throws Exception {
  tokenPlayload.setIss(JWT_ISS);
  tokenPlayload.setExp(JWT_EXP);

  tokenPlayload.setIat(String.valueOf(System.currentTimeMillis()));

  String headerJson =JSON.toJSONString(tokenPlayload);

  String headerBase64 = Base64Util.encryptBASE64(headerJson.getBytes());

  return headerBase64;
}

/**
* 生成JWT
* @return
*/
public static <T> String createJWT(TokenPlayload<T> tokenPlayload) throws Exception {
  StringBuilder jwtSb = new StringBuilder();
  StringBuilder headerPlayloadSb = new StringBuilder();

  String tokenHeaderBase64 = tokenHeaderBase64();
  String tokenPayloadBase64 = tokenPayloadBase64(tokenPlayload);

  jwtSb.append(tokenHeaderBase64);
  jwtSb.append(".");
  jwtSb.append(tokenPayloadBase64);
  jwtSb.append(".");

  headerPlayloadSb.append(tokenHeaderBase64);
  headerPlayloadSb.append(tokenPayloadBase64);

  String headerPlayloadSalt = SaltUtil.addSalt(headerPlayloadSb.toString());

  String key = AesUtil.initKey(TOKEN_AES_KEY+tokenPlayload.getIat());

  String signature = Base64Util.encryptBASE64(AesUtil.encrypt(headerPlayloadSalt.getBytes(),key));

  jwtSb.append(signature);

  return Base64Util.encryptBASE64(jwtSb.toString().getBytes());
}

/**
* 校验token是否是服务器生成的，以防token被修改
* @param jwtBase64
* @return
* @throws Exception
*/
public static <T> boolean verifyJWT(String jwtBase64) throws Exception {
  String jwt = new String (Base64Util.decryptBASE64(jwtBase64));

  if(!jwt.contains(".")){
  return false;
  }

  String[] jwts = jwt.split("\\.");
  if(jwts.length<3){
  return false;
  }

  TokenPlayload tTokenPlayload = JSON.parseObject(new String(Base64Util.decryptBASE64(jwts[1])),TokenPlayload.class);
  String key = AesUtil.initKey(TOKEN_AES_KEY+tTokenPlayload.getIat());

  //解析出header跟playload
  StringBuilder headerPlayloadSb = new StringBuilder();
  headerPlayloadSb.append(jwts[0]);
  headerPlayloadSb.append(jwts[1]);

  //解析signature
  String headerPlayloadSalt = new String (AesUtil.decrypt(Base64Util.decryptBASE64(jwts[2]),key));

  return SaltUtil.verifyPwd(headerPlayloadSb.toString(),headerPlayloadSalt);
}

 

public static void main(String[] args) throws Exception {
  String jwt = getToken(new User(1L,"你是逗逼"));
  System.out.println("jwt:"+jwt);
  System.out.println("verifyJWT:"+verifyJWT(jwt));
  }
}
```



### **使用说明**

　　1，根据上面生成一个由base64编码的token，该token由Header，Payload，Signature组成。

　　2，token作为用户请求的标识，客户端保存这token的全部信息。服务端只需要保存token的Signature部分。

　　3，服务端把token的Signature存于redis和服务器的数据库中。

　　4，客户端请求的数据附带token，服务端拿到token，首先校验token，以防token伪造。校验规则如下：

　　　　4.1，拆分出token的Header，Payload，Signature。

　　　　4.2，校验Signature，通过token的header和payload生成Signature，看看生成的Signature是否和客户端附带上来的Signature一致。如果一致继续请求操作，不一致则打回操作

　　　　4.3，查看Signature是否存在服务器的redis和数据库中。如果不存在则打回请求操作
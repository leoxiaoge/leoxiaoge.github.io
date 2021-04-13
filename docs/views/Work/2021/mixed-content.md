---
title: https请求报错block:mixed-content问题的解决办法
date: 2020-06-15
tags:
 - Work
categories:
 -  Work
---

**错误：https页面去发送http请求报错(浏览器阻止https发送http请求)**

浏览器不允许在https页面里嵌入http的请求，现在高版本的浏览器为了用户体验，都不会弹窗报错，只会在控制台上打印一条错误信息。

```
Mixed Content: The page was loaded over HTTPS，blocked the content must be served over HTTPS
```

# 解决方法

**方法1.** 在主页面的head中加入下面代码（**将调用的http请求升级成https请求并调用**）：

```
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```

**方法2.** 走一下本地后端（将本地后端当成service中间层），从后端再去调用其他服务器的http请求

```
/**
	 * 删除应用App
	 */
	@RequestMapping(value = "/delVersionConfig", produces = "text/html;charset=UTF-8")
	@ResponseBody
	public JSONObject delVersionConfig(Model model, HttpServletRequest request, String appId) {
 
		JSONObject resultJSON = new JSONObject();
 
		String JSONURL = "http://" + CommonData.DATA_URL + "/app/xxx/xxxx";
		Map<String, Object> condMap = new HashMap<String, Object>();
		condMap.put("id", appId);
                // 调用http封装类
		String result = HttpUtils.getHttpClient(JSONURL, condMap);
		LOGGER.info("selectAllApplication_info--result:" + result);
		resultJSON = JSON.parseObject(result);
		return resultJSON;
 
	}
```

**HttpUtils封装类中HttpUtils.getHttpClient执行方法**

```
/**
     * 向指定URL发送GET方法的请求
     *
     * @param url   发送请求的URL 例如：http://localhost:8080/demo/login
     * @param param 请求参数 例：{ "userName":"admin", "password":"123456" }
     * @return URL 所代表远程资源的响应结果
     */
    public static String getHttpClient(String url, Map<String, Object> param) {
        StringBuilder result = new StringBuilder();
        BufferedReader in = null;
        try {
            URL realUrl = createURL(url, param);
            HttpURLConnection conn = (HttpURLConnection) realUrl.openConnection();
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("Charset", "UTF-8");
            conn.connect();
            in = new BufferedReader(new InputStreamReader(
                    conn.getInputStream(),"UTF-8"));
            String line;
            while ((line = in.readLine()) != null) {
                result.append(line);
            }
        } catch (Exception e) {
            System.out.println("发送GET请求出现异常！" + e);
            e.printStackTrace();
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result.toString();
    }
```


module.exports = {
  "title": "",
  "description": "",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "link",
      {
        "rel": "stylesheet",
        "href": "http://lcbblog.com/styles/styles.css"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "theme": "reco",
  "themeConfig": {
    "nav": [
      {
        "text": "主页",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "时轴",
        "link": "/timeline/",
        "icon": "reco-date"
      },
      {
        "text": "工具",
        "icon": "reco-message",
        "items": [
          {
            "text": "程序员在线工具",
            "link": "https://www.bejson.com/"
          },
          {
            "text": "JSON编辑器",
            "link": "https://json.cn/"
          },
          {
            "text": "JSON工具",
            "link": "https://www.bejson.com/jsoneditoronline"
          },
          {
            "text": "bable编译",
            "link": "https://www.babeljs.cn/repl"
          },
          {
            "text": "代码格式化",
            "link": "https://tool.oschina.net/codeformat/html"
          },
          {
            "text": "MD表格生成器",
            "link": "https://tableconvert.com/?output=text"
          },
          {
            "text": "编码转换器",
            "link": "http://tool.chinaz.com/tools/native_ascii.aspx"
          },
          {
            "text": "tinypng",
            "link": "https://tinypng.com/"
          },
          {
            "text": "codelf",
            "link": "https://unbug.github.io/codelf/"
          },
          {
            "text": "caniuse",
            "link": "http://www.caniuse.com/"
          },
          {
            "text": "chrome",
            "link": "chrome://inspect/#devices"
          },
          {
            "text": "ip查询",
            "link": "https://www.ipaddress.com/"
          },
          {
            "text": "vue3",
            "link": "https://vue3js.cn/"
          }
        ]
      },
      {
        "text": "链接",
        "icon": "reco-message",
        "items": [
          {
            "text": "NPM",
            "link": "https://www.npmjs.com/",
            "icon": "reco-npm"
          },
          {
            "text": "GitHub",
            "link": "https://github.com/leoxiaoge",
            "icon": "reco-github"
          },
          {
            "text": "码云",
            "link": "https://gitee.com/xiaogeleo",
            "icon": "reco-mayun"
          },
          {
            "text": "知乎",
            "link": "https://www.zhihu.com/people/li-lu-72-8",
            "icon": "reco-zhihu"
          },
          {
            "text": "CSDN",
            "link": "https://blog.csdn.net/recoluan",
            "icon": "reco-csdn"
          },
          {
            "text": "博客圆",
            "link": "https://home.cnblogs.com/u/1742557/",
            "icon": "reco-bokeyuan"
          },
          {
            "text": "掘金",
            "link": "https://juejin.im/user/5cd3aecb51882535d2567512",
            "icon": "reco-juejin"
          },
          {
            "text": "MDN",
            "link": "https://developer.mozilla.org/zh-CN/",
            "icon": "reco-mdn"
          }
        ]
      }
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "分类"
      },
      "tag": {
        "location": 3,
        "text": "标签"
      }
    },
    "friendLink": [
      {
        "title": "github",
        "desc": "github",
        "avatar": "http://lcbblog.com/images/banner.png",
        "link": "https://github.com/leoxiaoge"
      }
    ],
    "themePicker": {
      "colorName1": "red",
      "colorName2": "yellow",
      "colorName3": "blue"
    },
    "logo": "/logo.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "sidebar": "auto",
    "lastUpdated": "Last Updated",
    "author": "李楚标",
    "authorAvatar": "/avatar.png",
    "record": "粤ICP备18003568号-2",
    "recordLink": "https://beian.miit.gov.cn",
    "startYear": "2017"
  },
  "markdown": {
    "lineNumbers": true
  },
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
      title: '友人帐',
      description: '前端进阶积累'
    }
  },
  // 搜索设置
  search: true,
  searchMaxSuggestions: 10,
  // 插件
  plugins: [
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine', 
        // options选项中的所有参数，会传给Valine的配置
        options: {
          el: '#valine-vuepress-comment',
          appId: 'Your own appId',
          appKey: 'Your own appKey'
        }
      }
    ],
    ["flowchart"], // 支持流程图
    [
      "@vuepress-reco/vuepress-plugin-bgm-player", // BGM播放器
      {
        audios: [
          {
            name: "Faster Than Light",
            artist: "Andreas Waldetoft / Mia Stegmar",
            url:
              "https://cdn-image.tsanfer.xyz/music/Andreas%20Waldetoft%2CMia%20Stegmar%20-%20Faster%20Than%20Light.mp3",
            cover:
              "https://p1.music.126.net/Gxv6d9W4Yd9q9WNHPpi8rw==/1379887104073348.jpg"
          },
          {
            name: "Dawn",
            artist: "DDRKirby(ISQ)",
            url:
              "https://cdn-image.tsanfer.xyz/music/Dawn%20-%20DDRKirby%28ISQ%29.mp3",
            cover:
              "https://p2.music.126.net/IPnqMCk8YaN9inwYV2bdgQ==/18774161044446693.jpg"
          },
          {
            name: "TRON Legacy (End Titles)",
            artist: "Daft Punk",
            url:
              "https://cdn-image.tsanfer.xyz/music/Daft%20Punk%20-%20TRON%20Legacy%20%28End%20Titles%29.mp3",
            cover:
              "https://p2.music.126.net/qOOTIykbSLw9RHB0vI83GA==/737772302281958.jpg"
          },
          {
            name: "Broken Boy",
            artist: "Tonspender",
            url:
              "https://cdn-image.tsanfer.xyz/music/Tonspender%20-%20Broken%20Boy.flac",
            cover:
              "https://p2.music.126.net/4TnTRyHqa3-D2H1UnOa00w==/109951163666994621.jpg"
          },
          {
            name: "Life Of Sin Pt. 4",
            artist: "MitiS",
            url:
              "https://cdn-image.tsanfer.xyz/music/MitiS%20-%20Life%20Of%20Sin%20Pt.%204.mp3",
            cover:
              "https://p2.music.126.net/LmjTrSwvSLSNBsfFsQFO6g==/2533274793491743.jpg"
          },
          {
            name: "Sea Of Voices (RAC Mix)",
            artist: "Porter Robinson",
            url:
              "https://cdn-image.tsanfer.xyz/music/Porter%20Robinson%20-%20Sea%20Of%20Voices%20%28RAC%20Mix%29.mp3",
            cover:
              "https://p1.music.126.net/zjQROkEUokU7iS5eUvnVZQ==/3264450027161111.jpg"
          },
          {
            name: "New Lipstick",
            artist: "The Kissaway Trail",
            url:
              "https://cdn-image.tsanfer.xyz/music/The%20Kissaway%20Trail%20-%20New%20Lipstick.flac",
            cover:
              "https://p2.music.126.net/VjN74c1hoYgPCEZ9DngeQw==/109951163772624643.jpg"
          }
        ]
      }
    ],
    ["vuepress-plugin-smooth-scroll"], // 平滑滚动
    ["@vuepress/nprogress"], // 加载进度条
    ["reading-progress"] // 阅读进度条
  ]
}
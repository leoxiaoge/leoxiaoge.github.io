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
            "text": "NPM",
            "link": "https://www.npmjs.com/~reco_luan",
            "icon": "reco-npm"
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
        "title": "vuepress-theme-reco",
        "desc": "A simple and beautiful vuepress Blog & Doc theme.",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
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
    "record": "粤ICP备20005033号-1",
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
      description: '前端进阶积累友人帐'
    }
  },
  // 搜索设置
  search: true,
  searchMaxSuggestions: 10,
  // 插件
  plugins: [
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
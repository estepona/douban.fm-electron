# Contributing to douban.fm-electron

If you are interested in contributing to douban.fm-electron, your contributions will fall into two categories:

1. You want to propose a new feature and implement it.
    - Post about your intended feature, and we shall discuss the design and
    implementation. Once we agree that the plan looks good, go ahead and implement it.
2. You want to implement a feature or bug-fix for an outstanding issue.
    - Search for your issue here: https://github.com/estepona/douban.fm-electron/issues
    - Pick an issue and comment on the task that you want to work on this feature.
    - If you need more context on a particular issue, please ask and we shall provide.

Once you finish implementing a feature or bug-fix, please send a Pull Request to https://github.com/estepona/douban.fm-electron

This document covers some of the more technical aspects of contributing to douban.fm-electron.

## Developing douban.fm-electron

To develop douban.fm-electron on your machine, here are some tips:

1. Clone a copy of douban.fm-electron from source:

   ```bash
   git clone https://github.com/estepona/douban.fm-electron.git
   cd douban.fm-electron
   ```

2. Install douban.fm-electron dependencies

   ```bash
   npm install
   ```

## Unit testing

No test yet written

## Coding Standard

Use eslint and prettier.

## Install Application on Your OS with electron-builder

Use `electron-builder`:
- for Mac, issue `npx electron-builder -m`
- for Windows, issue `npx electron-builder -w --x64`

Then find the installer under `./dist`

## TODO
- [ ] system tray control
- [x] option - set on top
- [x] ready position of main
- [x] disable login option if logged in
- [x] ready position of login
- [x] style of login
- [x] js in separate folder
- [x] 窗口边缘阴影
- [x] 参考itunes缩小
- [x] 做很小
- [x] 第二行是artist+album
- [x] 第二行滚动
- [x] frameless
- [x] option icon
- [x] 所有options放到一个options的图标里
- [x] 鼠标在mac上会有不同的形态，应该什么都没有，或者按钮是pointer
- [x] 音乐结束自动下一首
- [x] options - refresh
- [ ] loading default text
- [x] set up vscode debugger
- [x] time update
- [x] about page
- [ ] sponsor page
- [ ] 快捷键
    - [ ] 精选
    - [ ] 红心
    - [ ] 私人
- [ ] 鼠标移动到按键上显示快捷键
    - [ ] 新的webpage
- [ ] 鼠标移动到每个选项上显示说明
- [x] 各种快捷键单独放到constant里
- [x] 图标
- [x] 播放图标和文字距离远点儿
- [x] 艺术家文字小点儿
- [ ] 鼠标移到时间整个窗口变成进度条
- [ ] style buttons
- [ ] english support
- [x] console.log 有utf-8问题
- [x] 登录成功自动3S后关闭，文字在消息里
- [x] 安装
- [ ] 更新版本
- [x] redheart -> liked
- [x] shuffle liked songs
- [x] mac上显示icon和title有问题: https://stackoverflow.com/questions/41551110/unable-to-override-app-name-on-mac-os-electron-menu
- [x] 置顶快捷键不管用
- [ ] 不能有各种选择文字
- [x] 每首歌有channel信息
- [ ] axios wrap all requests with headers
- [ ] git version hook
- [x] 豆瓣推荐
- [x] 私人频道
- [x] option menu change channel
- [x] like event
- [x] unlike event
- [x] liked songs playlist
- [ ] add description
- [ ] liked songs length == 0 not show
- [ ] 登录按钮鼠标悬在上面显示名字
- [x] 感谢子昭和小炎
- [ ] refactor main.js, maybe main.ts?
- [x] Electron\[9861:463831\] *** WARNING: Textured window <AtomNSWindow: 0x7f9177c7fa10> is getting an implicitly transparent titlebar. This will break when linking against newer SDKs. Use NSWindow's -titlebarAppearsTransparent=YES instead.~~
- [x] full sid requires cookie in headers
- [x] only loggined can like/unlike songs
- [x] mac上一格的耳机音量都太高了
- [ ] 暂停，登出后播放键没变
- [ ] 登录后尽管更新了豆瓣精选，但是optionMenu不会更新，只有登录后退出重进才会显示“从单曲出发”，cookie的原因？
- [x] 重启应用
- [ ] change macOS sys menu
- [ ] set cookie gracefully: https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests/46412839#46412839
- [x] 降低初始音量
- [x] 换个icon
- [x] macOS的app名字改成douban.fm-electron
- [x] macOS安装后无法登出
- [x] change location to save user data
- [ ] macOS unable to select text
- [ ] 登陆成功后倒计时有时不准

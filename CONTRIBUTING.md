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
- [ ] axios wrap all requests with headers
- [ ] git version hook
- [ ] add description
- [ ] liked songs length == 0 not show
- [ ] 登录按钮鼠标悬在上面显示名字
- [ ] refactor main.js, maybe main.ts?
- [ ] 鼠标移到时间整个窗口变成进度条
- [ ] style buttons
- [ ] english support
- [ ] 鼠标移动到每个选项上显示说明
- [ ] loading default text
- [ ] system tray control
- [ ] 快捷键
    - [ ] 精选
    - [ ] 红心
    - [ ] 私人
- [ ] 鼠标移动到按键上显示快捷键
    - [ ] 新的webpage
- [ ] 暂停，登出后播放键没变
- [ ] 登录后尽管更新了豆瓣精选，但是optionMenu不会更新，只有登录后退出重进才会显示“从单曲出发”，cookie的原因？
- [ ] change macOS sys menu
- [ ] set cookie gracefully: https://stackoverflow.com/questions/46288437/set-cookies-for-cross-origin-requests/46412839#46412839
- [ ] macOS unable to select text
- [ ] 登陆成功后倒计时有时不准
- [ ] check "like" function
- [ ] check liked songs order
- [ ] 刷新bug，会把边框也刷出来

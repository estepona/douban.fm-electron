# douban.fm-electron
A tiny, elegant douban.fm desktop client developed with electron.

![example](./src/asset/img/example.png)

If anything doesn't work, try refreshing!

## Features
- login/logout, cookie saving
- channels:
    - douban selected / 豆瓣精选
    - douban recommended / 豆瓣推荐
    - liked songs / 红心歌曲
    - personal channel / 私人频道
- set window on top / 置顶
- ...

## Install

Mac and Windows installers can be found at https://github.com/estepona/douban.fm-electron/releases.

Currently all releases are pre-releases, if you find any bugs and have any feature improvements, please submit an issue! Thank you!

## Shortcuts
- pause or play: `space`
- next song: `right`
- like song: `up`
- unlike song: `down`
- refresh: `F5` (Win / Linux), `Cmd+R` (Mac)
- set window on top: `Alt+F2` (Win / Linux), `Cmd+E` (Mac)
- relaunch: `Alt+F3` (Win / Linux), `Cmd+L` (Mac)
- quit: `Alt+F4` (Win / Linux), `Cmd+Q` (Mac)

## Known Issues
- To view "从单曲出发", please login and relaunch;

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

## Ref
- [豆瓣FM API](https://github.com/zonyitoo/doubanfm-qt/wiki/%E8%B1%86%E7%93%A3FM-API)
- [豆瓣电台api](https://blog.csdn.net/hello2me/article/details/42078317)
- [各种音乐平台API整理 | Music APIs](https://www.fangr.cc/2018/01/22/music-apis-md.html#%E8%B1%86%E7%93%A3FM)

## Author
[Binghuan Zhang](https://github.com/estepona)

## Contributors
- [Zizhao Wang](https://github.com/MikuZZZ)
- [Xiaoyan Wang](https://github.com/miniwangdali)

## Credit
<div>Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/"                 title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/"                 title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>

## LICENSE
MIT
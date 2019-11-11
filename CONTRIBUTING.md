## Contributing to douban.fm-electron

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

## Install Application on Your OS

Use `electron-builder`:
- for Mac, issue `npx electron-builder -m`
- for Windows, issue `npx electron-builder -w --x64`

Then find the installer under `./dist`

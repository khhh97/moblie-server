# mobile-server

- 毕业设计-多平台技术交流类小程序后端服务

## Development

```bash
$ npm i
$ npm run dev
```

## 接口文档

- 使用 postman 在线生成的接口文档地址：[mobile-server](https://documenter.getpostman.com/view/9725103/SzKVQxr7?version=latest)

## npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org

## `git`提交代码指南及生成版本日志

### 代码提交流程

- 全局安装 `commitizen`,命令 `npm install commitizen -g`或者`yarn add commitizen global`
- 通过`npm scripts`命令提交代码,命令`npm run commit`或者`yarn commit`

### 版本日志生成

- 根据`git`信息自动生成版本日志 `CHANGELOG.md` 文件

  ```bash
  # npm
  npm run version
  # yarn
  yarn version
  ```

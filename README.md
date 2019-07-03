# Nobibi-admin
此项目为Nobibi后台管理界面，需依赖api项目[Nobibi-api](https://github.com/


## 运行项目
> 保证已启动api项目[Nobibi-api](https://github.com/seawind8888/Nobibi-api)

1. Clone项目
```
git clone https://github.com/seawind8888/Nobibi-admin my-project
```

2. 安装依赖
```
cd my-porject
npm install 或 yarn
```

3. 运行项目
```
npm run start
```

## 效果演示
> [演示地址](http://47.244.103.124:8000)

![image](/preview/demo.gif)
![image](/preview/dashboard@2x.png)
![image](/preview/role@2x.png)
![image](/preview/topic@2x.png)




## 功能模块

- [x] 用户管理
- [x] 角色管理
- [x] 内容管理
- [x] 评论管理
- [x] 内容分类管理

## 目录结构

``` lua
ant-cms-admin
├── dist/               # 默认build输出目录
├── mock/               # Mock文件目录
├── public/             # 静态资源文件目录
├── src/                # 源码目录
│ ├── components/       # 组件目录
│ ├── e2e/              # e2e目录
│ ├── layouts/          # 布局目录
│ ├── locales/          # 国际化文件目录
│ ├── models/           # 数据模型目录
│ ├── pages/            # 页面组件目录
│ ├── services/         # 数据接口目录
│ │ ├── api.js          # 接口配置
│ │ └── index.js        # 接口输出
│ ├── themes/           # 项目样式目录
│ │ ├── default.less    # 样式变量
│ │ ├── index.less      # 全局样式
│ │ ├── mixin.less      # 样式函数
│ │ └── vars.less       # 样式变量及函数
│ ├── utils/            # 工具函数目录
│ │ ├── config.js       # 项目配置
│ │ ├── constant.js     # 静态常量
│ │ ├── index.js        # 工具函数
│ │ ├── request.js      # 异步请求函数(axios)
│ │ └── theme.js        # 项目需要在js中使用到样式变量
├── .editorconfig       # 编辑器配置
├── .env                # 环境变量
├── .eslintrc           # ESlint配置
├── .gitignore          # Git忽略文件配置
├── .prettierignore     # Prettier忽略文件配置
├── .prettierrc         # Prettier配置
├── .stylelintrc.json   # Stylelint配置
├── .travis.yml         # Travis配置
└── .umirc.js           # Umi配置
└──  package.json       # 项目信息

```

## 技术选型

- react - [https://reactjs.org/](https://reactjs.org/)
- Ant Design - [https://ant.design/docs/react/introduce-cn](https://ant.design/docs/react/introduce-cn)
- Ant Design Pro - [https://pro.ant.design/index-cn](https://pro.ant.design/index-cn)
- UmiJS - [https://umijs.org/zh/guide/](https://umijs.org/zh/guide/)
- DvaJs（数据流） - [https://dvajs.com/](https://dvajs.com/)
- ESlint - [https://cn.eslint.org/](https://cn.eslint.org/)
- braft-editor（富文本） - [https://github.com/margox/braft-editor](https://github.com/margox/braft-editor)



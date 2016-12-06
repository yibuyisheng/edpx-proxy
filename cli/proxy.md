# edpx-proxy

## Usage

```bash
edp proxy
edp proxy --config=edp-webserver-config.js
```

## Options

* --config - 启动的配置文件，不指定则使用默认配置文件。

## Description

这是一个基于 `edp-webserver` 的方便快捷地将请求代理到线上环境的 edp 插件。

本插件的配置文件基于 `edp-webserver` 的配置文件，新增了如下配置：

* loginPage：如果需要登录，则跳转到该配置指定的url页面（在一个 electron 应用中跳转）；
* isLoginOk：登录期间发生页面跳转变动的时候会调用这个函数来判断当前是否已经登录成功了，会收到一个 url 参数。登录成功之后，会搜集网站返回的 cookie ；
* backendHostName：代理到的后端服务器的 host name ；
* pageScript：electron 应用右上角会有一个“执行脚本”的按钮，点击之后会执行该配置指定的脚本，可用于向登录表单中快速填充用户名密码；
* defaultUrl：本地 edp-webserver 启动好之后，让系统默认浏览器跳转到的页面。

配置示例：

```js
var host = 'brandplus.baidu.com';
exports.loginPage = 'http://' + host;
exports.isLoginOk = function ({url}) {
    return url.indexOf('index.html') + 1;
};
exports.backendHostName = host;
exports.pageScript = `
    document.getElementById('uc-common-account').value = 'username';
    document.getElementById('ucsl-password-edit').value = 'password';
`;

const ip = require('edp-webserver/lib/util/ip');
exports.defaultUrl = `http://${ip}:${exports.port}/entry/client.html`;
```

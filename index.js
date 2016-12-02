const {spawn} = require('child_process');
const edpWebserverStart = require('edp-webserver/lib/start');
const fs = require('fs');
const ip = require('edp-webserver/lib/util/ip');
const log = require('edp-core/lib/log');
const readline = require('readline');

module.exports = function (configFilePath) {
    log.info('config file path: ' + configFilePath);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('是否需要登录（Y/N，默认：N）： ', answer => {
        answer = answer.replace(/\s+/g, '').toLowerCase();

        if (answer === 'y') {
            spawnLogin(configFilePath);
        }
        else {
            let conf = require(configFilePath);
            edpWebserverStart(conf);
            require('open')(conf.defaultUrl || `http://${ip}:${conf.port || '8088'}/`);
        }

        rl.close();
    });
};

function spawnLogin(configFilePath) {
    let conf = require(configFilePath);

    let child = spawn(
        require('electron/index'),
        [
            require('path').join(__dirname, 'electron.js'),
            '--config=' + configFilePath
        ],
        {
            stdio: []
        }
    );

    child.on('exit', (status) => {
        if (status === 0) {
            let cookies = '' + fs.readFileSync(require('path').join(__dirname, 'cookies'));
            if (cookies) {
                log.info('get cookies: ' + cookies);
            }
            else {
                log.warn('no cookie');
            }
            edpWebserverStart(
                getEdpWebserverConfig(conf, cookies, conf.backendHostName)
            );
        }
        else if (status === 1) {
            log.warn('close the login window directly');
            edpWebserverStart(conf);
        }

        require('open')(conf.defaultUrl || `http://${ip}:${conf.port || '8088'}/`);
    });
}

function getEdpWebserverConfig(conf, cookies, backendHostName) {
    let oldFn = conf.overrideProxyRequestHeader;
    conf.overrideProxyRequestHeader = function (reqHeaders) {
        reqHeaders.cookie = cookies;
        reqHeaders.host = backendHostName;
        reqHeaders.origin = 'http://' + backendHostName;
        reqHeaders.referer = 'http://' + backendHostName;

        log.info('proxy cookies: ' + cookies);
        log.info('proxy backend host: ' + backendHostName);

        if (oldFn instanceof Function) {
            oldFn(reqHeaders);
        }
    };
    conf.proxyMap = conf.proxyMap || {};
    conf.proxyMap[ip + ':' + (conf.port || '8088')] = backendHostName;

    log.info('proxy map: ' + JSON.stringify(conf.proxyMap, null, 4));

    return conf;
}

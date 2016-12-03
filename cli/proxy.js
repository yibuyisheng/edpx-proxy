/**
 * @file clie
 * @author yibuyisheng(yibuyisheng@163.com)
 */

const path = require('path');
const fs = require('fs');
const proxy = require('../index');

exports.cli = {
    description: '' + fs.readFileSync(path.join(__dirname, 'proxy.md')),
    options: ['config:'],
    main(args, opts) {
        proxy(path.join(process.cwd(), opts.config || 'edp-webserver-config.js'));
    }
};

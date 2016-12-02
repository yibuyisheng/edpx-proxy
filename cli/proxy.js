var path = require('path');
var fs = require('fs');
var proxy = require('../index');

exports.cli = {
    description: '' + fs.readFileSync(path.join(__dirname, 'proxy.md')),
    options: ['config:'],
    main: function(args, opts) {
        proxy(path.join(process.cwd(), opts.config || 'edp-webserver-config.js'));
    }
};

const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')
const url = require('url')

let configFilePath = getConfigFilePath();
if (!configFilePath) {
    process.exit(2);
}

app.on('ready', () => {
    let win;
    let isSuccessfullyClosed;

    // Create the browser window.
    win = new BrowserWindow({
        width: 1366,
        height: 800,
        title: configFilePath
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.on('closed', () => {
        win = null;
        if (!isSuccessfullyClosed) {
            app.exit(1);
        }
    });

    ipcMain.on('ok', () => {
        isSuccessfullyClosed = true;
        app.exit(0);
    });
});

function getConfigFilePath() {
    let configFilePath;
    process.argv.forEach((val, index) => {
        let valSplit = val.split('=');
        if (valSplit.length === 2 && valSplit[0] === '--config') {
            configFilePath = valSplit[1];
        }
    });
    return configFilePath;
}

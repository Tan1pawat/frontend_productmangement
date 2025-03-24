const { app, BrowserWindow } = require('electron')
const url = require('url');
const path = require('path');
// const { exec } = require('child_process');
let mainWindow
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/product-management/browser/index.html`),
            protocol: "file:",
            slashes: true
        })
    );
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
// exec('start /B php -S localhost:8000 -t C:\\laragon\\www\\Stock-Mangement\\public', (error) => {
//     if (!error) createWindow();
// });
app.on('ready', createWindow)
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
    if (mainWindow === null) createWindow()
})
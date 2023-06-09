import { 
    app, // Electron的全局对象，用于控制整个应用程序的生命周期
    BrowserWindow 
} from "electron";
import { CustomScheme } from "./custom-scheme";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

let mainWindow: BrowserWindow; // 全局，避免主窗口被js垃圾回收器回收



app.whenReady().then(() => {
    let config = {
        webPreferences: {
          nodeIntegration: true, // Node.js 环境集成到渲染进程中
          webSecurity: false,
          allowRunningInsecureContent: true,
          contextIsolation: false, // 在同一个 JavaScript 上下文中使用 Electron API
          webviewTag: true,
          spellcheck: false,
          disableHtmlFullscreenWindowResize: true,
        },
    };
    mainWindow = new BrowserWindow(config);
    // mainWindow.webContents.openDevTools({ mode: "undocked" }); w// 打开开发者调试工具
    // mainWindow.loadURL(process.argv[2]);


    // console.log(process.argv);
    
    if (process.argv[2]) {
        mainWindow.loadURL(process.argv[2]);
        // mainWindow.webContents.openDevTools({mode:'undocked'})
    } else {
        CustomScheme.registerScheme();
        mainWindow.loadURL(`app://index.html`);
    }
});

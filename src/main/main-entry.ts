import { 
    app, // Electron的全局对象，用于控制整个应用程序的生命周期
    BrowserWindow 
} from "electron";
import { CustomScheme } from "./custom-scheme";
import { CommonWindowEvent } from './common-window-event'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

app.on("browser-window-created", (e, win) => {
    CommonWindowEvent.regWinEvent(win);
  });

let mainWindow: BrowserWindow; // 全局，避免主窗口被js垃圾回收器回收

app.whenReady().then(() => {
    let config = {
        frame: false, // 要想自定义一个窗口的标题栏必须把窗口默认的标题栏取消掉才行。只要我们在初始化mainWindow对象时（主进程里的逻辑），把窗口配置对象的frame属性设置为false就可以使这个窗口成为无边框窗口了。
        show: false, // 可以让主窗口初始化成功后处于隐藏状态。接下来再在合适的时机让渲染进程控制主窗口显示出来即可
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

    CommonWindowEvent.listen()
});

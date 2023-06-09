//plugins\devPlugin.ts
import { ViteDevServer } from "vite";
export let devPlugin = () => {
  return {
    name: "dev-plugin",
    // 启动http服务时，该钩子会执行
    configureServer(server: ViteDevServer) {
      require("esbuild").buildSync({
        entryPoints: ["./src/main/main-entry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/main-entry.js",
        external: ["electron"],
      });
      server.httpServer!.once("listening", () => {
        let { spawn } = require("child_process"); // 用于启动 electron 子进程
        let addressInfo: any = server.httpServer!.address()!;
        let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
        /** 
         * 通过监听 server.httpServer 的 listening 事件来判断 httpServer 是否已经成功启动。
         * 如果已经成功启动了，那么就启动 Electron 应用，并给它传递两个命令行参数，
         * 第一个参数是主进程代码编译后的文件路径，第二个参数是 Vue 页面的 http 地址 
         * */
        let electronProcess = spawn(require("electron").toString(), ["./dist/main-entry.js", httpAddress], {
          cwd: process.cwd(), // 设置当前的工作目录
          stdio: "inherit", // 让 electron 子进程的控制台输出数据同步到主进程的控制台
        });
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    },
  };
};

export let getReplacer = () => {
    let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
    let result: any = {};
    for (let item of externalModels) {
      result[item] = () => ({
        find: new RegExp(`^${item}$`),
        code: `const ${item} = require('${item}');export { ${item} as default }`,
      });
    }
    result["electron"] = () => {
      let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
      return {
        find: new RegExp(`^electron$`),
        code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
      };
    };
    return result;
  };

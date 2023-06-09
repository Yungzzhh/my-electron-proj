//plugins\buildPlugin.ts
import path from "path";
import fs from "fs";

class BuildObj {
  //编译主进程代码  Vite 在编译之前会清空 dist 目录,因此需要再次编译主进程代码
  buildMain() {
    require("esbuild").buildSync({
      entryPoints: ["./src/main/main-entry.ts"],
      bundle: true,
      platform: "node",
      minify: true,
      outfile: "./dist/main-entry.js",
      external: ["electron"],
    });
  }
  //为生产环境准备package.json: 启动我们的应用程序时，实际上是通过 Electron 启动一个 Node.js 的项目
  preparePackageJson() {
    let pkgJsonPath = path.join(process.cwd(), "package.json");
    let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
    let electronConfig = localPkgJson.devDependencies.electron.replace("^", ""); // 这是 electron-builder 的一个 Bug，这个 bug 导致 electron-builder 无法识别带 ^ 或 ~ 符号的版本号
    localPkgJson.main = "main-entry.js";
    delete localPkgJson.scripts;
    delete localPkgJson.devDependencies;
    localPkgJson.devDependencies = { electron: electronConfig };
    let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
    fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
    fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
  }
  //使用electron-builder制成安装包
  buildInstaller() {
    let options = {
      config: {
        directories: {
          output: path.join(process.cwd(), "release"),
          app: path.join(process.cwd(), "dist"),
        },
        files: ["**"],
        extends: null,
        productName: "testApp",
        appId: "com.juejin.desktop",
        asar: true,
        nsis: {
          oneClick: true,
          perMachine: true,
          allowToChangeInstallationDirectory: false,
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: "juejinDesktop",
        },
        publish: [{ provider: "generic", url: "http://localhost:5500/" }],
      },
      project: process.cwd(),
    };
    return require("electron-builder").build(options);
  }
}

/**
 * 在 Vite 编译完代码之后 这个钩子会被调用 我们在这个钩子中完成了安装包的制作过程
 */
export let buildPlugin = () => {
    return {
      name: "build-plugin",
      closeBundle: () => {
        let buildObj = new BuildObj();
        buildObj.buildMain();
        buildObj.preparePackageJson();
        buildObj.buildInstaller();
      },
    };
};
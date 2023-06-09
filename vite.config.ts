import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { 
  devPlugin,
  getReplacer // 为 vite-plugin-optimizer 插件提供的内置模块列表
} from "./src/plugins/dev-plugin";
import optimizer from "vite-plugin-optimizer"; 
import { buildPlugin } from './src/plugins/build-plugin';
/**
 * 创建一个临时目录：node_modules.vite-plugin-optimizer。
 * 
 * 渲染进程执行到：import fs from "fs" 时，就会请求这个目录下的 fs.js 文件，这样就达到了在渲染进程中引入 Node 内置模块的目的。
 */


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [optimizer(getReplacer()), devPlugin(), vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'), // 相对路径别名配置，使用 @ 代替 src
    },
  },
  build: {
    rollupOptions: {
        plugins: [buildPlugin()],
    },
},
})

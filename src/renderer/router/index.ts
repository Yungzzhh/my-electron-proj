import * as VueRouter from "vue-router";
//路由规则描述数组
const routes = [
  { path: "/", redirect: "/WindowMain/Chat" },
  {
    path: "/WindowMain",
    component: () => import("@/renderer/Window/WindowMain.vue"),
    children: [
      { path: "Chat", component: () => import("@/renderer/Window/WindowMain/Chat.vue") },
      // { path: "Contact", component: () => import("./Window/WindowMain/Contact.vue") },
      // { path: "Collection", component: () => import("./Window/WindowMain/Collection.vue") },
    ],
  },
  {
    path: "/WindowSetting",
    component: () => import("@/renderer/Window/WindowSetting.vue"),
    // children: [{ path: "AccountSetting", component: () => import("./Window/WindowSetting/AccountSetting.vue") }],
  },
  {
    path: "/WindowUserInfo",
    component: () => import("@/renderer/Window/WindowUserInfo.vue"),
  },
];
//导出路由对象
export let router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

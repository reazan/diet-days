import { type RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "home",
		component: () => import("@/pages/Home.vue"),
	},
	{
		path: "/settings",
		name: "settings",
		component: () => import("@/pages/Settings.vue"),
	},
	{
		path: "/about",
		name: "about",
		component: () => import("@/pages/About.vue"),
	},
];

// https://vitejs.dev/guide/env-and-mode.html
const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;

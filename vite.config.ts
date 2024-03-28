import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import Markdown from "unplugin-vue-markdown/vite";

// https://vitejs.dev/config/
export default defineConfig({
	base: "",
	server: {
		fs: {
			strict: false, // Prevent "unrestricted file system access" warnings logs
			allow: ["*"],
		},
	},
	resolve: {
		alias: [{ find: "@", replacement: "/src" }],
	},
	plugins: [
		Vue({
			include: [/\.vue$/, /\.md$/],
		}),
		// https://github.com/antfu/unplugin-vue-components
		Components({
			dts: "src/components.d.ts",
		}),

		// https://github.com/antfu/unplugin-auto-import
		AutoImport({
			imports: ["vue", "vue/macros", "@vueuse/core", "vue-i18n", "vue-router"],
			vueTemplate: true,
			dirs: ["src/composables", "src/stores", "src/lib"],
			dts: "src/auto-imports.d.ts",
		}),
		Markdown({ /* options */ }),
	],
	css: {
		postcss: {
			plugins: [tailwind(), autoprefixer()],
		},
	},
});

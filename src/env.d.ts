/// <reference types="vite/client" />

declare module "*.vue" {
	import type { DefineComponent } from "vue";

	// eslint-disable-next-line ts/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

declare module "*.md" {
	import type { ComponentOptions } from "vue";

	const Component: ComponentOptions;
	export default Component;
}

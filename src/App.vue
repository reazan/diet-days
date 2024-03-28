<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { useDark, useToggle } from "@vueuse/core";
import TooltipContent from "./components/ui/tooltip/TooltipContent.vue";

const attrs = useAttrs();

const navMenuItems = [
	{
		name: "Overview",
		path: "/",
	},
	{
		name: "Settings",
		path: "/settings",
	},
];

const route = useRoute();
const router = useRouter();
const isDark = useDark();
const toggleDark = useToggle(isDark);

function goToSettings() {
	router.push({ path: "/settings" });
}
</script>

<template lang="pug">
header.sticky.z-40.top-0.backdrop-blur-lg.border-b.border-border(class="bg-background/80")
	.container.flex.h-14.max-w-screen-2xl.items-center
		.mr-4(class="md:mr-1 hidden md:flex")
			RouterLink(to="/" :class="cn('mr-4 md:mr-2 lg:mr-6 flex items-center lg:space-x1 xl:space-x-2')")
				span.font-bold DietTracker
			//- nav(:class="cn('flex items-center space-x-4 lg:space-x-6', attrs.class ?? '')")
			//- 	RouterLink(
			//- 		v-for="item in navMenuItems"
			//- 		:to="item.path"
			//- 		:class="cn('text-sm font-medium transition-colors hover:text-primary', route.path === item.path ? '' : 'text-muted-foreground')"
			//- 	) {{ item.name }}
		div(:class="cn('flex flex-1 items-center justify-between space-x-2 md:justify-end')")
			div(:class="cn('w-full flex-1 md:w-auto md:flex-none')")
				.relative(class="mt-0.5")
					Icon(icon="material-symbols:search" class="absolute left-2 top-1.5 w-5 h-5 text-muted-foreground")
					Input(class="h-8 pl-8")
			nav.flex.items-center
				TooltipProvider
					Tooltip
						TooltipTrigger(as-child)
							Button(@click="goToSettings()" variant="link" size="icon")
								Icon(icon="material-symbols:settings" class="w-5 h-5")
						TooltipContent
							p Settings
				TooltipProvider
					Tooltip
						TooltipTrigger(as-child)
							Button(@click="toggleDark()" variant="link" size="icon")
								Icon(icon="material-symbols:light-mode-outline-rounded" v-if="isDark" class="w-5 h-5")
								Icon(icon="material-symbols:dark-mode-outline-rounded" v-else class="w-5 h-5")
						TooltipContent
							p {{ isDark ? 'Light mode' : 'Dark mode' }}

.flex-1.bg-background
	.container.relative
		RouterView
</template>

<style>
</style>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import { useDark, useToggle } from "@vueuse/core";
import TooltipContent from "./components/ui/tooltip/TooltipContent.vue";

const router = useRouter();
const route = useRoute();
const isDark = useDark();
const toggleDark = useToggle(isDark);

function goto(path: string) {
	router.push({ path });
}
</script>

<template lang="pug">
header.sticky.z-40.top-0.backdrop-blur-lg.border-b.border-border(class="bg-background/80")
	.container.flex.h-14.max-w-screen-2xl.items-center
		.mr-4(class="md:mr-1 md:flex")
			RouterLink(to="/" :class="cn('mr-4 md:mr-2 lg:mr-6 flex items-center lg:space-x1 xl:space-x-2')")
				span.font-bold DietDays
		div(:class="cn('flex flex-1 items-center justify-between space-x-2 md:justify-end')")
			nav.flex.items-center
				TooltipProvider
					Tooltip
						TooltipTrigger(as-child)
							Button(@click="goto('/')" variant="link" size="icon")
								Icon(:icon="route.name !== 'home' ? 'material-symbols:home-outline' : 'material-symbols:home'" class="w-5 h-5")
						TooltipContent
							p Home
				TooltipProvider
					Tooltip
						TooltipTrigger(as-child)
							Button(@click="goto('/settings')" variant="link" size="icon")
								Icon(:icon="route.name !== 'settings' ? 'material-symbols:settings-outline' : 'material-symbols:settings'" class="w-5 h-5")
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
				TooltipProvider
					Tooltip
						TooltipTrigger(as-child)
							Button(@click="goto('/about')" variant="link" size="icon")
								Icon(:icon="route.name !== 'about' ? 'material-symbols:info-outline' : 'material-symbols:info'" class="w-5 h-5")
						TooltipContent
							p About

.flex-1.bg-background
	.container.relative
		RouterView
</template>

<style>
</style>

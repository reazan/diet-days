<script setup lang="ts">
import Icon from "@/assets/icon.png";

const store = useMainStore();
</script>

<template lang="pug">
.w-full(v-if="store.settings.username === undefined").mt-10
	h1(:class="cn('text-center mb-2 text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]')") Setup your diet tracker!
	div.flex.w-full.items-center.justify-center
		span(:class="cn('text-center text-lg text-muted-foreground sm:text-xl')" style="display: inline-block; vertical-align: top; text-decoration: inherit; text-wrap: initial; max-width: 568px;") A way to simplify your meal routine!
	section(:class="cn('flex w-full items-center justify-center space-x-4 py-4 md:pb-10')")
		RouterLink(to="/settings" :class="cn('inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-[6px]')") Get started!

	div.flex.w-full.items-center.justify-center
		img(:src="Icon")
</template>

<style>
</style>

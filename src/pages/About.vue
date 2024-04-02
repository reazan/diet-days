<script setup lang="ts">
import { Icon } from "@iconify/vue";
import IconImg from "@/assets/icon.png";
</script>

<template lang="pug">
div.flex.w-full.items-center.justify-center
	img(:src="IconImg")
section(:class="cn('flex w-full items-center justify-center space-x-4 py-4 md:pb-10')")
	a(href="https://github.com/theramenboy/diet-days" target="_blank" :class="cn('inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-[6px]')")
		Icon(icon="mdi:github" class="w-5 h-5 m-1")
		span Repository
</template>

<style>
</style>

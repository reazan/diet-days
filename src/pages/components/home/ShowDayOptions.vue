<script setup lang="ts">
import type { DietDay } from "@/stores/main";

defineProps<{ day: DietDay }>();

const store = useMainStore();

const settings = computed(() => store.settings ?? {});
</script>

<template lang="pug">
.w-full
	.mb-3(v-if="settings.dietDays?.filter(a => a.day === 'all')[0]?.options.some(a => a.tag === 'breakfast')")
		h1.text-1xl.font-semibold Breakfast
		hr.my-2
		.mb-1(v-for="o in settings.dietDays?.filter(a => a.day === 'all')[0]?.options.filter(a => a.tag === 'breakfast')")
			span -&nbsp;
			span {{ o.element }}
	.mb-3(v-else-if="day.options.some(a => a.tag === 'breakfast')")
		h1.text-1xl.font-semibold Breakfast
		hr.my-2
		.mb-1(v-for="o in day.options.filter(a => a.tag === 'breakfast')")
			span -&nbsp;
			span {{ o.element }}
	.mb-3(v-if="day.options.some(a => a.tag === 'lunch')")
		h1.text-1xl.font-semibold Lunch
		hr.my-2
		.mb-1(v-for="o in day.options.filter(a => a.tag === 'lunch')")
			span -&nbsp;
			span {{ o.element }}
	.mb-3(v-if="settings.dietDays?.filter(a => a.day === 'all')[0]?.options.some(a => a.tag === 'snack')")
		h1.text-1xl.font-semibold Snacks
		hr.my-2
		.mb-1(v-for="o in settings.dietDays?.filter(a => a.day === 'all')[0]?.options.filter(a => a.tag === 'snack')")
			span -&nbsp;
			span {{ o.element }}
	.mb-3(v-else-if="day.options.some(a => a.tag === 'snack')")
		h1.text-1xl.font-semibold Snacks
		hr.my-2
		.mb-1(v-for="o in day.options.filter(a => a.tag === 'snack')")
			span -&nbsp;
			span {{ o.element }}
	.mb-3(v-if="day.options.some(a => a.tag === 'dinner')")
		h1.text-1xl.font-semibold Dinner
		hr.my-2
		.mb-1(v-for="o in day.options.filter(a => a.tag === 'dinner')")
			span -&nbsp;
			span {{ o.element }}
</template>

<style>
</style>

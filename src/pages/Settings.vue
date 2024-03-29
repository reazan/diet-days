<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Label } from "radix-vue";
import { RouterLink } from "vue-router";
import DayDrawer from "./components/settings/DayDrawer.vue";
import type { DietDay, DietDayType } from "@/stores/main";
import CardFooter from "@/components/ui/card/CardFooter.vue";

const store = useMainStore();
const username = ref("");

type stepTypes = "username" | "diet-days" | "review";

const currentStep = ref<stepTypes>("username");

const defaultDietDays = ref<Array<DietDay>>([
	{
		day: "day1",
		name: "Day 1",
		options: [],
	},
	{
		day: "day2",
		name: "Day 2",
		options: [],
	},
	{
		day: "day3",
		name: "Day 3",
		options: [],
	},
	{
		day: "day4",
		name: "Day 4",
		options: [],
	},
	{
		day: "day5",
		name: "Day 5",
		options: [],
	},
	{
		day: "day6",
		name: "Day 6",
		options: [],
	},
	{
		day: "day7",
		name: "Day 7",
		options: [],
	},
]);

const breakfastForAllWeek = ref(false);
const breakfastWeek = ref<DietDay>({
	day: "all",
	options: [],
	name: "Breakfast",
});
const snackForAllWeek = ref(false);
const snackWeek = ref<DietDay>({
	day: "all",
	options: [],
	name: "Snacks",
});

const router = useRouter();
function save() {
	if (breakfastForAllWeek.value)
		defaultDietDays.value.push(breakfastWeek.value);

	if (snackForAllWeek.value)
		defaultDietDays.value.push(snackWeek.value);

	store.setupUsername(username.value);
	store.setupDietDays(defaultDietDays.value);

	router.push({ path: "/" });
}

const getNormalDayOptions = computed(() => {
	const options = new Array<DietDayType>();

	if (!breakfastForAllWeek.value)
		options.push("breakfast");

	options.push("lunch");

	if (!snackForAllWeek.value)
		options.push("snack");

	options.push("dinner");

	return options;
});
</script>

<template lang="pug">
.w-full(v-if="store.settings.username === undefined").mt-10
	.container.mb-2
		Breadcrumb
			BreadcrumbList
				BreadcrumbItem
					RouterLink(to="/") Home
					BreadcrumbSeparator
					RouterLink(to="/settings") Settings
					BreadcrumbSeparator
					BreadcrumbLink(href="javascript:void(0)") Init
	.flex.justify-center(v-if="currentStep === 'username'")
		Card(style="width: 500px;")
			CardHeader
				CardTitle Create routine
				CardDescription Define your diet days starting with your name!
			CardContent
				div(class="grid items-center w-full gap-4")
					div(class="flex flex-col space-y-1.5")
						Label(for="name") Name
						Input(id="name" placeholder="Your name" type="text" v-model="username")
			CardFooter(class="flex justify-end px-6 pb-6")
				Button.h-9(@click="currentStep = 'diet-days'" :disabled="username.trim() === ''" variant="outline")
					.flex.gap-2.items-center
						div Next
						div: Icon(icon="material-symbols:chevron-right-rounded" class="w-5 h-5")
	.flex.justify-center(v-else-if="currentStep === 'diet-days'")
		.flex.flex-col.gap-2
			Card(style="width: 500px;")
				CardHeader
					CardTitle Planner
					CardDescription Define your meals of the week
				CardContent
					.flex.justify-between
						div Define breakfast rules only once?
						div: Switch(v-model:checked="breakfastForAllWeek")
					.flex.justify-between.mb-2
						div Define snack rules only once?
						div: Switch(v-model:checked="snackForAllWeek")

					.flex.gap-2.flex-wrap.mb-2
						.grow(v-if="breakfastForAllWeek")
							DayDrawer(:day="breakfastWeek" :options="['breakfast']")
						.grow(v-if="snackForAllWeek")
							DayDrawer(:day="snackWeek" :options="['snack']")

					hr.mb-2
					.flex.gap-2.flex-wrap
						.grow.w-60(v-for="d in defaultDietDays")
							DayDrawer(:day="d" :options="getNormalDayOptions")
				CardFooter(class="flex justify-end px-6 pb-6")
					div.flex.gap-2
						Button.h-9(@click="currentStep = 'username'" variant="outline")
							.flex.gap-2.items-center
								div: Icon(icon="material-symbols:chevron-left-rounded" class="w-5 h-5")
								div Back

						Button.h-9(@click="currentStep = 'review'" variant="outline")
							.flex.gap-2.items-center
								div Next
								div: Icon(icon="material-symbols:chevron-right-rounded" class="w-5 h-5")
	.flex.justify-center.w-100(v-else)
		Card(style="width: 500px;")
			CardHeader
				CardTitle Review
				CardDescription Check if it is all good
			CardContent
				Accordion(type="single" class="w-full" collapsible)
					AccordionItem(v-if="breakfastForAllWeek" value="breakfast" key="breakfast")
						AccordionTrigger Breakfast
						AccordionContent
							.mb-1(v-for="o in breakfastWeek.options")
								span -&nbsp;
								span {{ o.element }}
					AccordionItem(v-if="snackForAllWeek" value="snack" key="snack")
						AccordionTrigger Snacks
						AccordionContent
							div(v-for="o in snackWeek.options")
								span -&nbsp;
								span {{ o.element }}
					AccordionItem(v-for="day in defaultDietDays.filter(a => a.day !== 'all')" :key="day.day" :value="day.day")
						AccordionTrigger {{ day.name }}
						AccordionContent
							.mb-1(v-if="day.options.some(a => a.tag === 'breakfast')")
								h1.text-1xl.font-semibold Breakfast
								.mb-1(v-for="o in day.options.filter(a => a.tag === 'breakfast')")
									span -&nbsp;
									span {{ o.element }}
							.mb-1(v-if="day.options.some(a => a.tag === 'lunch')")
								h1.text-1xl.font-semibold Lunch
								.mb-1(v-for="o in day.options.filter(a => a.tag === 'lunch')")
									span -&nbsp;
									span {{ o.element }}
							.mb-1(v-if="day.options.some(a => a.tag === 'snack')")
								h1.text-1xl.font-semibold Snacks
								.mb-1(v-for="o in day.options.filter(a => a.tag === 'snack')")
									span -&nbsp;
									span {{ o.element }}
							.mb-1(v-if="day.options.some(a => a.tag === 'dinner')")
								h1.text-1xl.font-semibold Dinner
								.mb-1(v-for="o in day.options.filter(a => a.tag === 'dinner')")
									span -&nbsp;
									span {{ o.element }}

			CardFooter(class="flex justify-end px-6 pb-6")
				div.flex.gap-2.mt-2
					Button.h-9(@click="currentStep = 'diet-days'" variant="outline")
						.flex.gap-2.items-center
							div: Icon(icon="material-symbols:chevron-left-rounded" class="w-5 h-5")
							div Back

					Button.h-9(@click="save()")
						.flex.gap-2.items-center
							div Save
							div: Icon(icon="material-symbols:save" class="w-5 h-5")

div(v-else)
	div {{ store.settings }}
</template>

<style>
</style>

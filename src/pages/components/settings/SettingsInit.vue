<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Label } from "radix-vue";
import DayDrawer from "./DayDrawer.vue";
import type { DietDay, DietDayType } from "@/stores/main";

const props = defineProps<{
	state?: string
	username?: string
	default?: Array<DietDay>
	breakfast?: DietDay
	snacks?: DietDay
}>();

const emit = defineEmits<{
	close: [void]
}>();

const store = useMainStore();

const username = ref("");
type StepTypes = "username" | "diet-days" | "review";

const breakfastForAllWeek = ref(false);
const breakfastWeek = ref<DietDay>({
	day: "all-breakfast",
	options: [],
	name: "Breakfast",
});
const snackForAllWeek = ref(false);
const snackWeek = ref<DietDay>({
	day: "all-snack",
	options: [],
	name: "Snacks",
});

const isChangeSettings = ref(false);

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

onMounted(() => {
	if (props.username != null) {
		isChangeSettings.value = true;
		username.value = props.username;
	}

	if (props.breakfast != null) {
		breakfastForAllWeek.value = props.breakfast.options.length > 0;
		breakfastWeek.value = props.breakfast;
	}

	if (props.snacks != null) {
		snackForAllWeek.value = props.snacks.options.length > 0;
		snackWeek.value = props.snacks;
	}

	if (props.default != null)
		defaultDietDays.value = props.default;

	save(false);
});

onUnmounted(() => {
	if (store.settings.state === "completed")
		return;

	save(false);
});

const currentStep = ref<StepTypes>("username");
const router = useRouter();

function save(completed: boolean) {
	if (breakfastForAllWeek.value && defaultDietDays.value.every(a => a.day !== "all-breakfast"))
		defaultDietDays.value.push(breakfastWeek.value);

	if (snackForAllWeek.value && defaultDietDays.value.every(a => a.day !== "all-snack"))
		defaultDietDays.value.push(snackWeek.value);

	store.setupDietDays(defaultDietDays.value);
	store.setupUsername(username.value);

	store.setupState(completed ? "completed" : "editing");

	if (store.settings.state === "completed")
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

function changeStep(type: StepTypes, completed: boolean) {
	currentStep.value = type;
	save(completed);
}
</script>

<template lang="pug">
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
				Label(v-if="!isChangeSettings")
					i.text-sm This is just for welcoming purpose.
					i.text-sm All data is stored in your browser's local storage.
			CardFooter(class="flex justify-end gap-1 px-6 pb-6")
				Button.h-9(v-if="isChangeSettings" @click="emit('close')" variant="ghost")
					.flex.gap-2.items-center
						div: Icon(icon="material-symbols:arrow-back" class="w-5 h-5")
						div Exit
				Button.h-9(@click="changeStep('diet-days', false)" :disabled="username.trim() === ''" variant="outline")
					.flex.gap-2.items-center
						div Next
						div: Icon(icon="material-symbols:chevron-right-rounded" class="w-5 h-5")
.flex.justify-center(v-else-if="currentStep === 'diet-days'")
	.flex.flex-col.gap-2
		Card(class="md:w-[500px]")
			CardHeader
				CardTitle Planner
				CardDescription Define your meals of the week
			CardContent
				.flex.justify-between
					div Define breakfast only once?
					div: Switch(v-model:checked="breakfastForAllWeek")
				.flex.justify-between.mb-2
					div Define snack only once?
					div: Switch(v-model:checked="snackForAllWeek")

				.flex.gap-2.flex-wrap.mb-2
					.grow(v-if="breakfastForAllWeek")
						DayDrawer(:day="breakfastWeek" :options="['breakfast']" @submit="save(false)")
					.grow(v-if="snackForAllWeek")
						DayDrawer(:day="snackWeek" :options="['snack']" @submit="save(false)")

				hr.mb-2
				.flex.gap-2.flex-wrap
					.grow.w-60(v-for="d in defaultDietDays.filter(a => a.day != 'all-snack' && a.day != 'all-breakfast')")
						DayDrawer(:day="d" :options="getNormalDayOptions" @submit="save(false)")
			CardFooter(class="flex justify-end gap-1 px-6 pb-6")
				Button.h-9(v-if="isChangeSettings" @click="emit('close')" variant="ghost")
					.flex.gap-2.items-center
						div: Icon(icon="material-symbols:arrow-back" class="w-5 h-5")
						div Exit
				Button.h-9(@click="changeStep('username', false)" variant="outline")
					.flex.gap-2.items-center
						div: Icon(icon="material-symbols:chevron-left-rounded" class="w-5 h-5")
						div Back

				Button.h-9(@click="changeStep('review', false)" variant="outline")
					.flex.gap-2.items-center
						div Next
						div: Icon(icon="material-symbols:chevron-right-rounded" class="w-5 h-5" @submit="save(false)")
.flex.justify-center.w-100(v-else)
	Card(style="width: 500px;")
		CardHeader
			CardTitle Review
			CardDescription Check if it is all good
		CardContent
			Accordion(type="single" class="w-full" collapsible)
				AccordionItem(v-if="breakfastForAllWeek && breakfastWeek.options.length > 0" value="breakfast" key="breakfast")
					AccordionTrigger Breakfast
					AccordionContent
						.mb-1(v-for="o in breakfastWeek.options")
							span -&nbsp;
							span {{ o.element }}
				AccordionItem(v-if="snackForAllWeek && snackWeek.options.length > 0" value="snack" key="snack")
					AccordionTrigger Snacks
					AccordionContent
						.mb-1(v-for="o in snackWeek.options")
							span -&nbsp;
							span {{ o.element }}
				template(v-for="day in defaultDietDays.filter(a => a.day != 'all-snack' && a.day != 'all-breakfast')")
					AccordionItem(:value="day.day" v-if="day.options.length > 0")
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

		CardFooter(class="flex justify-end gap-1 px-6 pb-6")
			Button.h-9(v-if="isChangeSettings" @click="emit('close')" variant="ghost")
				.flex.gap-2.items-center
					div: Icon(icon="material-symbols:arrow-back" class="w-5 h-5")
					div Exit
			Button.h-9(@click="changeStep('diet-days', false)" variant="outline")
				.flex.gap-2.items-center
					div: Icon(icon="material-symbols:chevron-left-rounded" class="w-5 h-5")
					div Back

			Button.h-9(@click="save(true)")
				.flex.gap-2.items-center
					div Save
					div: Icon(icon="material-symbols:save" class="w-5 h-5")
</template>

<style>
</style>

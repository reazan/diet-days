<script setup lang="ts">
import { DateTime } from "luxon";
import { formatTimeAgo } from "@vueuse/core";
import ShowDayOptions from "./components/home/ShowDayOptions.vue";
import Icon from "@/assets/icon.png";
import type { DietDay } from "@/stores/main";

const store = useMainStore();

const settings = computed(() => store.settings ?? {});

onMounted(() => updateNow());

const nextDayPlan = computed(() => {
	const dd = settings.value.dietDays;
	if (dd == null)
		return undefined;

	return dd.filter(a => !a.completed && settings.value.currentDietDay?.name !== a.name)[0];
});

function markCurrentDayAsComplete(setNextDay: boolean) {
	if (settings.value.currentDietDay == null)
		return;

	settings.value.currentDietDay.completed = true;
	settings.value.currentDietDay.completedWhen = DateTime.now().toString();

	settings.value.currentDietDay = setNextDay ? settings.value.dietDays?.filter(a => a.name === nextDayPlan.value?.name)[0] : undefined;

	if (settings.value.dietDays?.every(a => a.completed)) {
		settings.value.dietDays?.forEach((a) => {
			a.completed = false;
			a.completed = undefined;
		});
	}
}

function markAsNotCompleted(day: DietDay) {
	day.completed = false;
	day.completedWhen = undefined;
}

const now = ref("");

let nowTimeout: ReturnType<typeof setTimeout>;
function updateNow() {
	clearTimeout(nowTimeout);

	setTimeout(() => {
		now.value = DateTime.now().toFormat("dd/MMM/yyyy HH:mm:ss");
		updateNow();
	}, 1000);
}
</script>

<template lang="pug">
.w-full(v-if="store.settings.username === undefined").mt-10
	h1(:class="cn('text-center mb-2 text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]')") Setup your diet plan!
	div.flex.w-full.items-center.justify-center
		span(:class="cn('text-center text-lg text-muted-foreground sm:text-xl')" style="display: inline-block; vertical-align: top; text-decoration: inherit; text-wrap: initial; max-width: 568px;") Simplify your meal routine!
	section(:class="cn('flex w-full items-center justify-center space-x-4 py-4 md:pb-10')")
		RouterLink(to="/settings" :class="cn('inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-[6px]')") Get started!

	div.flex.w-full.items-center.justify-center
		img(:src="Icon")
div.mt-4(v-else)
	div(v-if="settings.currentDietDay == null")
		h1.text-2xl.font-semibold Select day plan
		h2.text-1xl Select the starting point of your days. You can change whenever you want.
		hr.my-2
		.flex.gap-2.flex-wrap.justify-center
			template(v-for="day in settings.dietDays?.filter(a => a.day !== 'all' && a.options.length > 0)")
				Card(:class="!day.completed ? 'hover:bg-accent cursor-pointer' : 'bg-accent'" @click="store.setupCurrentDay(day)" class="w-full md:w-[500px]")
					CardHeader
						CardTitle {{ day.name }}
						CardDescription(v-if="day.completed && day.completedWhen != null") {{ formatTimeAgo(DateTime.fromISO(day.completedWhen).toJSDate()) }}
					CardContent(class="md:w-[500px]")
						ShowDayOptions(:day="day")
					CardFooter(v-if="day.completed" class="flex justify-end")
						Button(variant="destructive" @click="markAsNotCompleted(day)") Reset
	div(v-else)
		.flex.justify-center
			.flex.flex-col.mb-4.items-center
				h1(:class="cn('text-4xl text-center font-bold leading-tight tracking-tighter lg:leading-[1.1]')") {{ settings.username }}
				h1(:class="cn('text-1xl text-center  leading-tight tracking-tighter lg:leading-[1.1]')") {{ now }}
		Tabs(default-value="current" class="w-full")
				TabsList(class="grid w-full grid-cols-2")
					TabsTrigger(value="current") Current
					TabsTrigger(value="next") Next
				TabsContent(value="current")

					h1(:class="cn('mb-4 text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1]')") {{ settings.currentDietDay.name }}
					ShowDayOptions(:day="settings.currentDietDay")

					.flex.justify-center.gap-2.mt-2(class="md:justify-end")
						Button(@click="store.setupCurrentDay()" variant="ghost") Change
						Button(@click="markCurrentDayAsComplete(false)" variant="outline") Complete
						Button(@click="markCurrentDayAsComplete(true)") Start next
				TabsContent(value="next")
					div(v-if="nextDayPlan == null")
						i Restart week meal plan!
					div(v-else)
						h1(:class="cn('mb-4 text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1]')") {{ nextDayPlan.name }}
						ShowDayOptions(:day="nextDayPlan")
</template>

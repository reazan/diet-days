<script setup lang="ts">
import { DateTime } from "luxon";
import { formatTimeAgo } from "@vueuse/core";
import ShowDayOptions from "./components/home/ShowDayOptions.vue";
import Icon from "@/assets/icon.png";
import type { DietDay } from "@/stores/main";
import Badge from "@/components/ui/badge/Badge.vue";

const store = useMainStore();

const settings = computed(() => store.settings ?? {});

onMounted(() => updateNow());

const currentTab = ref("current");

function markCurrentDayAsComplete() {
	if (settings.value.currentDietDay == null)
		return;

	settings.value.currentDietDay.completed = true;
	settings.value.currentDietDay.completedWhen = DateTime.now().toString();

	const day = settings.value.dietDays?.filter(a => a.name === settings.value.currentDietDay?.name)[0];

	if (day == null)
		return;

	day.completed = true;
	day.completedWhen = DateTime.now().toString();

	store.setupCurrentDay(undefined);

	nextTick(() => {
		currentTab.value = "options";
	});
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

function resetAll() {
	settings.value.dietDays?.forEach(markAsNotCompleted);
}

function selectDay(day: DietDay) {
	store.setupCurrentDay(day);
	currentTab.value = "current";
}
</script>

<template lang="pug">
.w-full(v-if="store.settings.state !== 'completed'").mt-10
	h1(:class="cn('text-center mb-2 text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]')") Setup your diet plan!
	div.flex.w-full.items-center.justify-center
		span(:class="cn('text-center text-lg text-muted-foreground sm:text-xl')" style="display: inline-block; vertical-align: top; text-decoration: inherit; text-wrap: initial; max-width: 568px;") Simplify your meal routine!
	section(:class="cn('flex w-full items-center justify-center space-x-4 py-4 md:pb-10')")
		RouterLink(to="/settings" :class="cn('inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-[6px]')") Get started!

	div.flex.w-full.items-center.justify-center
		img(:src="Icon")
div.mt-4(v-else)
	.flex.justify-center
		.flex.flex-col.mb-4.items-center.gap-2
			h1(:class="cn('text-4xl text-center font-bold leading-tight tracking-tighter lg:leading-[1.1]')") {{ settings.username }}
			h1(:class="cn('text-1xl text-center  leading-tight tracking-tighter lg:leading-[1.1]')") {{ now }}
	Tabs(class="w-full" v-model="currentTab")
		TabsList(class="grid w-full grid-cols-2")
			TabsTrigger(value="current") Current
			TabsTrigger(value="options") Options
		TabsContent(value="current")
			.flex.justify-center.mt-4(v-if="settings.currentDietDay == null")
				Button(size="sm" @click="currentTab = 'options'" variant="outline") Go to options
			div(v-else)
				h1(:class="cn('mb-4 text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1]')") {{ settings.currentDietDay.name }}
				ShowDayOptions(:day="settings.currentDietDay")

				.w-full.mt-2(class="md:justify-end")
					Button.w-full(@click="markCurrentDayAsComplete()" variant="default" size="sm") Complete
		TabsContent(value="options")
			Accordion(type="single" class="w-full" collapsible)
				template(v-for="day in settings.dietDays?.filter(a => a.day != 'all-snack' && a.day != 'all-breakfast')")
					AccordionItem(:value="day.day" v-if="day.options.length > 0")
						AccordionTrigger
							.flex.gap-2
								div {{ day.name }}
								div
									Badge(variant="outline" v-if="settings.currentDietDay?.name === day.name") Current
									Badge(variant="default" v-else-if="day.completed") Done
									Badge(variant="secondary" v-else) TODO

						AccordionContent
							ShowDayOptions(:day="day")
							.w-full(v-if="day.completed")
								Button.w-full(variant="secondary" @click="markAsNotCompleted(day)" size="sm") TODO
							.w-full(v-if="!day.completed && settings.currentDietDay?.name != day.name")
								Button.w-full(variant="default" @click="selectDay(day)" size="sm") Select
			hr
			Dialog
				DialogTrigger(as-child).w-full.mt-4
					Button.w-full(variant="destructive") Reset
				DialogContent
					DialogHeader
						DialogTitle Are you sure?
						DialogDescription This operation will mark all days as not completed.
					DialogFooter
						DialogClose(as-child)
							Button.h-8(variant="outline") Cancel
						DialogClose(as-child)
							Button.h-8(variant="destructive" @click="resetAll()") Proceed
</template>

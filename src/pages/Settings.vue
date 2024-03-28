<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { Label } from "radix-vue";
import type { DietDay } from "@/stores/main";
import { buttonVariants } from "@/components/ui/button";
import CardHeader from "@/components/ui/card/CardHeader.vue";
import CardTitle from "@/components/ui/card/CardTitle.vue";

import CardContent from "@/components/ui/card/CardContent.vue";
import Input from "@/components/ui/input/Input.vue";

const store = useMainStore();
const username = ref("");

type stepTypes = "username" | "diet-days" | "review";

const currentStep = ref<stepTypes>("username");

const defaultDietDays = ref<Array<DietDay>>([
	{
		day: "Day 1",
		options: [],
	},
	{
		day: "Day 2",
		options: [],
	},
	{
		day: "Day 3",
		options: [],
	},
	{
		day: "Day 4",
		options: [],
	},
	{
		day: "Day 5",
		options: [],
	},
	{
		day: "Day 6",
		options: [],
	},
	{
		day: "Day 7",
		options: [],
	},
]);
const selectedDietDay = ref<DietDay>();

const router = useRouter();
function save() {
	store.setupUsername(username.value);
	store.setupDietDays(defaultDietDays.value);

	router.push({ path: "/" });
}
</script>

<template lang="pug">
.w-full(v-if="store.settings.username === undefined").mt-10
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
			CardFooter(class="flex justify-between px-6 pb-6")
				hr
				Button.h-9(@click="currentStep = 'diet-days'" :disabled="username.trim() === ''" variant="outline")
					.flex.gap-2.items-center
						div Next
						div: Icon(icon="material-symbols:chevron-right-rounded" class="w-5 h-5")
	.flex.justify-center.gap-2(v-else-if="currentStep === 'diet-days'")
		div(class="rounded-lg border p-3 text-left text-sm transition-all")
			nav(class="grid gap-1 px-2 " style="min-width: 150px;")
				template(v-for="(day, i) in defaultDietDays")
					a(
						href="javascript:void(0)"
						:class="cn(buttonVariants({ variant: selectedDietDay == day ? 'default' : 'outline', size: 'icon', class: 'text-left' }), 'px-2 h-9 w-100')"
						@click="selectedDietDay = day"

					)
						.flex.items-center.gap-2.justify-start
							Icon(:icon="`material-symbols:counter-${i + 1}-outline`" class="h-5 w-5")
							span {{ day.day }}
		div(style="width: 450px;")
			Card
				CardHeader
					CardTitle(v-if="selectedDietDay == null")
						Label Select a day...
					CardTitle(v-else) {{ selectedDietDay.day }}
				CardContent(v-if="selectedDietDay != null")
					div.w-full
						div.flex.justify-between.items-center
							div LUNCH
							div
								Button(variant="link" @click="selectedDietDay.options.push({ tag: 'lunch', element: '', quantity: 0 })")
									Icon(icon="material-symbols:add-box-rounded" class="w-5 h-5")
						hr.mb-2
						div(v-for="options in selectedDietDay.options.filter(a => a.tag == 'lunch')" class="rounded-lg border mb-2 p-3")
							Textarea(v-model="options.element").mb-2
							div.flex.justify-between.items-center.text-sm
								div.flex.items-center.gap-2
									div Quantity
									div: Input(type="number" v-model="options.quantity" class="h-7 w-20")
									div g
								div
									Button(variant="destructive" class="h-7" @click="selectedDietDay.options.splice(selectedDietDay.options.indexOf(options), 1)")
										Icon(icon="material-symbols:delete-rounded" class="w-5 h-5")

						div.flex.justify-between.items-center.mt-4
							div DINNER
							div
								Button(variant="link" @click="selectedDietDay.options.push({ tag: 'dinner', element: '', quantity: 0 })")
									Icon(icon="material-symbols:add-box-rounded" class="w-5 h-5")
						hr.mb-2
						div(v-for="options in selectedDietDay.options.filter(a => a.tag == 'dinner')" class="rounded-lg border mb-2 p-3")
							Textarea(v-model="options.element").mb-2
							div.flex.justify-between.items-center.text-sm
								div.flex.items-center.gap-2
									div Quantity
									div: Input(type="number" v-model="options.quantity" class="h-7 w-20")
									div g
								div
									Button(variant="destructive" class="h-7" @click="selectedDietDay.options.splice(selectedDietDay.options.indexOf(options), 1)")
										Icon(icon="material-symbols:delete-rounded" class="w-5 h-5")

			div.flex.justify-end.gap-2.mt-2
				Button.h-9(@click="currentStep = 'username'" variant="outline")
					.flex.gap-2.items-center
						div: Icon(icon="material-symbols:chevron-left-rounded" class="w-5 h-5")
						div Back

				Button.h-9(@click="currentStep = 'review'" variant="outline")
					.flex.gap-2.items-center
						div Next
						div: Icon(icon="material-symbols:chevron-right-rounded" class="w-5 h-5")
	.flex.justify-center.w-100(v-else)
		Table
			TableHeader
				TableRow
					TableHead(class="w-[100px]") Day
					TableHead Lunch
					TableHead Dinner
					TableHead(class="text-right") Amount
			TableBody
				TableRow(v-for="day in defaultDietDays" :key="day.day")
					TableCell(class="font-medium") {{ day.day }}
					TableCell
						div(v-for="l in day.options.filter(a => a.tag == 'lunch')")
							span -&nbsp;
							Label {{ l.element }} ({{ l.quantity }}) g
					TableCell
						div(v-for="l in day.options.filter(a => a.tag == 'dinner')")
							span -&nbsp;
							Label {{ l.element }} ({{ l.quantity }}) g
					TableCell(class="text-right") {{ day.options.reduce((sum, current) => sum + current.quantity, 0) }}

			div.flex.justify-end.gap-2.mt-2
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

<script setup lang="ts">
import { DrawerTrigger } from "vaul-vue";
import { Icon } from "@iconify/vue";
import type { DietDay, DietDayType } from "@/stores/main";

const props = defineProps<{
	day: DietDay
	options: DietDayType[]
}>();

const getDayNumber = computed(() => {
	if (props.day.day === "all")
		return 0;

	return Number.parseInt(props.day.day.replace("day", ""));
});

const colsClass = computed(() => `grid-cols-${props.options.length}`);
</script>

<template lang="pug">
Drawer
	DrawerTrigger(as-child)
		Button(variant="outline").w-full
			.flex.items-center.gap-1.justify-between.w-full
				div {{ day.name }}

				div
					Badge(variant="secondary") {{ day.options.length }}
	DrawerContent
		div(class="mx-auto w-full max-w-sm px-1")
			DrawerHeader
				DrawerTitle {{ day.name }}
				DrawerDescription Set your meal plan for {{ day.name }}

			Tabs(default-value="lunch" class="w-full")
				TabsList(:class="`grid w-full ${colsClass}`")
					TabsTrigger(v-for="o in options" :value="o") {{ o }}
				ScrollArea(class="h-96 w-full")
					TabsContent(v-for="o in options" :value="o")
						div.w-full
							.text-center
								Button(variant="link" @click="day.options.push({ tag: o, element: '', quantity: 0 })")
									Icon(icon="material-symbols:note-stack-add-rounded" class="w-10 h-10")
							.text-center(v-if="day.options.length === 0")
								Label: i Add meal options for {{ o }}
							div(v-for="options in day.options.filter(a => a.tag == o)" class="rounded-lg border mb-2 p-3")
								Textarea(v-model="options.element" :placeholder="`Insert ${o} meal option...`").mb-2
								div.flex.justify-between.items-center.text-sm
									div.flex.items-center.gap-2
										div Quantity
										div: Input(type="number" v-model="options.quantity" class="h-7 w-20")
										div g
									div
										Button(variant="destructive" class="h-7" @click="day.options.splice(day.options.indexOf(options), 1)")
											Icon(icon="material-symbols:delete-rounded" class="w-5 h-5")
</template>

<style>
</style>

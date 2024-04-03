<script setup lang="ts">
import { DrawerClose, DrawerTrigger } from "vaul-vue";
import { Icon } from "@iconify/vue";
import type { DietDay, DietDayType } from "@/stores/main";

const props = defineProps<{
	day: DietDay
	options: DietDayType[]
}>();

const defaultValue = computed(() => props.options.includes("breakfast") ? "breakfast" : "lunch");

const oldDay = ref<DietDay>();
onMounted(() => {
	submit();
});

function restore() {
	if (oldDay.value == null)
		return;

	props.day.completed = oldDay.value.completed;
	props.day.completedWhen = oldDay.value.completedWhen;
	props.day.day = oldDay.value.day;
	props.day.name = oldDay.value.name;
	props.day.options = JSON.parse(JSON.stringify(oldDay.value.options ?? []));
}

function submit() {
	oldDay.value = JSON.parse(JSON.stringify(props.day));
}
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

			Tabs(:default-value="defaultValue" class="w-full")
				TabsList(class="grid w-full" :class="{'grid-cols-2': options.length === 2, 'grid-cols-3': options.length === 3, 'grid-cols-4': options.length === 4 }")
					TabsTrigger(v-for="o in options" :value="o") {{ o }}
				TabsContent(v-for="o in options" :value="o")
					div.w-full
						.text-center
							Button(variant="link" @click="day.options.push({ tag: o, element: '', quantity: 0 })")
								Icon(icon="material-symbols:note-stack-add-rounded" class="w-10 h-10")
						ScrollArea(class="h-96 w-full")
							.text-center(v-if="day.options.length === 0")
								Label: i Add meal options for {{ o }}
							div(v-for="options in day.options.filter(a => a.tag == o)" class="rounded-lg border mb-2 p-3")
								Textarea(v-model="options.element" :placeholder="`Insert ${o} meal option...`").mb-2

								div.w-full
									Button.w-full(variant="destructive" class="h-7" @click="day.options.splice(day.options.indexOf(options), 1)")
										Icon(icon="material-symbols:delete-rounded" class="w-5 h-5")
		DrawerFooter
			DrawerClose(as-child @click="submit()")
				Button Submit
			DrawerClose(as-child)
				Button(variant="outline" @click="restore()") Cancel
</template>

<style>
</style>

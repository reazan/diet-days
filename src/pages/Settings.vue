<script setup lang="ts">
import SettingsInit from "./components/settings/SettingsInit.vue";
import SettingsImport from "./components/settings/SettingsImport.vue";
import DialogClose from "@/components/ui/dialog/DialogClose.vue";
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import type { DietDay } from "@/stores/main";

const store = useMainStore();
const changeSettings = ref(false);

const defaultDays = ref<Array<DietDay>>();
const username = ref<string>();
const breakfast = ref<DietDay>();
const snacks = ref<DietDay>();

onMounted(() => {
	if (store.settings.state === "completed")
		return;

	startReset();
});

function startReset() {
	username.value = store.settings.username;
	const days = store.settings.dietDays?.filter(a => a.day !== "all-snack" && a.day !== "all-breakfast");
	defaultDays.value = days != null ? JSON.parse(JSON.stringify(days)) : undefined;

	const bfs = store.settings.dietDays?.filter(a => a.day === "all-breakfast")[0];
	breakfast.value = bfs != null ? JSON.parse(JSON.stringify(bfs)) : undefined;

	const snk = store.settings.dietDays?.filter(a => a.day === "all-snack")[0];
	snacks.value = snk != null ? JSON.parse(JSON.stringify(snk)) : undefined;

	changeSettings.value = true;
}

function close() {
	username.value = undefined;
	defaultDays.value = undefined;
	breakfast.value = undefined;
	snacks.value = undefined;

	changeSettings.value = false;
}

function reset() {
	store.setupCurrentDay(undefined);
	store.setupDietDays(undefined);
	store.setupUsername(undefined);
}
</script>

<template lang="pug">
.w-full.mt-4(v-if="changeSettings")
	SettingsInit(
		@close="close()"
		:username="username"
		:default="defaultDays"
		:breakfast="breakfast"
		:snacks="snacks"
	)
.flex.flex-col.gap-2.justify-center.mt-4(v-else)
	Button(variant="outline" @click="startReset") Change Settings
	SettingsImport
	Dialog
		DialogTrigger(as-child)
			Button(variant="destructive") Reset
		DialogContent
			DialogHeader
				DialogTitle Are you sure?
				DialogDescription This operation will clear all your settings and cannot be reverted.
			DialogFooter
				DialogClose(as-child)
					Button.h-8(variant="outline") Cancel
				DialogClose(as-child)
					Button.h-8(variant="destructive" @click="reset()") Proceed
</template>

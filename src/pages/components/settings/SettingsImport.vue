<script setup lang="ts">
import { useClipboard, useClipboardItems } from "@vueuse/core";
import type { Settings } from "@/stores/main";

withDefaults(
	defineProps<{
		showCopyButton?: boolean
	}>(),
	{
		showCopyButton: true,
	},
);

const showImportSettings = ref(false);
const { copied, text, copy } = useClipboard({ legacy: true });
const { content } = useClipboardItems();

const store = useMainStore();
const source = ref("");
onMounted(() => {
	setTimeout(() => {
		navigator.clipboard
			.readText()
			.then((clipText) => {
				source.value = clipText;
			});
	}, 2000);

	showImportSettings.value = areClipboardSettingsValid(text.value ?? "");
});

function importSettings() {
	try {
		const sett = JSON.parse(text.value) as Settings;
		if (sett == null || sett.dietDays == null)
			return;

		store.setupCurrentDay(undefined);
		store.setupDietDays(sett.dietDays);
		store.setupUsername(sett.username);
	}
	catch {
		// ignored
	}
}

function copySettings() {
	if (!areClipboardSettingsValid(text.value ?? ""))
		return;
	copy(JSON.stringify(store.settings));
}

function areClipboardSettingsValid(val: string) {
	try {
		const sett = JSON.parse(val) as Settings;
		return sett.dietDays != null;
	}
	catch {
		return false;
	}
}

watch(text, (val) => {
	showImportSettings.value = areClipboardSettingsValid(val);
}, { immediate: true, deep: true });
</script>

<template lang="pug">
div {{ showImportSettings }}
Button(@click="importSettings" :variant="showCopyButton ? 'default' : 'outline'") Import Settings
Button(@click="copySettings" v-if="showCopyButton")
	span(v-if="!copied") Copy Settings
	span(v-else) Copied!
</template>

<style>
</style>

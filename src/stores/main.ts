import { defineStore } from "pinia";

const localStorageSettings = useLocalStorage<Settings>(
	"diet-track-settings",
	{},
);

export const useMainStore = defineStore("main", () => {
	const settings = localStorageSettings;

	function setupUsername(username?: string) {
		settings.value.username = username;
	}

	function setupCurrentDay(day?: DietDay) {
		settings.value.currentDietDay = day;
	}

	function setupDietDays(dietDays?: Array<DietDay>) {
		settings.value.dietDays = dietDays;
	}

	return {
		settings: readonly(settings),
		setupUsername,
		setupCurrentDay,
		setupDietDays,
	};
});

export interface DietDay {
	day: string
	customName?: string
	options: Array<DietDayOptions>
	completed?: boolean
}

export interface DietDayOptions {
	tag: "lunch" | "dinner"
	element: string
	quantity: number
}

export interface Settings {
	username?: string
	currentDietDay?: DietDay
	dietDays?: Array<DietDay>
}

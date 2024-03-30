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
		settings,
		setupUsername,
		setupCurrentDay,
		setupDietDays,
	};
});

export interface DietDay {
	day: "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7" | "all"
	name?: string
	options: Array<DietDayOptions>
	completed?: boolean
	completedWhen?: string
}

export type DietDayType = "lunch" | "dinner" | "breakfast" | "snack";

export interface DietDayOptions {
	tag: DietDayType
	element: string
	quantity: number
}

export interface Settings {
	username?: string
	currentDietDay?: DietDay
	dietDays?: Array<DietDay>
}

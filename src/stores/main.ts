import { set } from "@vueuse/core";
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
		if (day?.completed)
			return;
		settings.value.currentDietDay = day;
	}

	function setupDietDays(dietDays?: Array<DietDay>) {
		settings.value.dietDays = dietDays;
	}

	function setupState(state: SettingsStateType) {
		settings.value.state = state;
	}

	return {
		settings,
		setupUsername,
		setupCurrentDay,
		setupDietDays,
		setupState,
	};
});

export interface DietDay {
	day: "day1" | "day2" | "day3" | "day4" | "day5" | "day6" | "day7" | "all-breakfast" | "all-snack"
	name?: string
	options: Array<DietDayOptions>
	completed?: boolean
	completedWhen?: string
}

export type DietDayType = "lunch" | "dinner" | "breakfast" | "snack";
export type SettingsStateType = "completed" | "editing";

export interface DietDayOptions {
	tag: DietDayType
	element: string
	quantity: number
}

export interface Settings {
	username?: string
	currentDietDay?: DietDay
	dietDays?: Array<DietDay>
	state?: SettingsStateType
}

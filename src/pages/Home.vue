<script setup lang="ts">
import Icon from "@/assets/icon.png";

const store = useMainStore();
</script>

<template lang="pug">
.w-full(v-if="store.settings.username === undefined").mt-10
	h1(:class="cn('text-center mb-2 text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]')") Setup your diet tracker!
	div.flex.w-full.items-center.justify-center
		span(:class="cn('text-center text-lg text-muted-foreground sm:text-xl')" style="display: inline-block; vertical-align: top; text-decoration: inherit; text-wrap: initial; max-width: 568px;") A way to simplify your meal routine!
	section(:class="cn('flex w-full items-center justify-center space-x-4 py-4 md:pb-10')")
		RouterLink(to="/settings" :class="cn('inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-[6px]')") Get started!

	div.flex.w-full.items-center.justify-center
		img(:src="Icon")
div.mt-4(v-else)
	div(v-if="store.settings.currentDietDay == null")
		h1.text-2xl.font-semibold Select day plan
		h2.text-1xl Select the starting point of your days. You can change whenever you want.
		hr.my-2
		.flex.gap-2.flex-wrap
			TransitionGroup(name="list" appear)
				template(v-for="day in store.settings.dietDays?.filter(a => a.day !== 'all' && a.options.length > 0)")
					Card(class="hover:bg-accent cursor-pointer" @click="store.setupCurrentDay(day)")
						CardHeader
							CardTitle {{ day.name }}
						CardContent(class="md:w-[500px]")
							.mb-1(v-if="day.options.some(a => a.tag === 'breakfast')")
								h1.text-1xl.font-semibold Breakfast
								.mb-1(v-for="o in day.options.filter(a => a.tag === 'breakfast')")
									span -&nbsp;
									span {{ o.element }}
							.mb-1(v-if="day.options.some(a => a.tag === 'lunch')")
								h1.text-1xl.font-semibold Lunch
								.mb-1(v-for="o in day.options.filter(a => a.tag === 'lunch')")
									span -&nbsp;
									span {{ o.element }}
							.mb-1(v-if="day.options.some(a => a.tag === 'snack')")
								h1.text-1xl.font-semibold Snacks
								.mb-1(v-for="o in day.options.filter(a => a.tag === 'snack')")
									span -&nbsp;
									span {{ o.element }}
							.mb-1(v-if="day.options.some(a => a.tag === 'dinner')")
								h1.text-1xl.font-semibold Dinner
								.mb-1(v-for="o in day.options.filter(a => a.tag === 'dinner')")
									span -&nbsp;
									span {{ o.element }}
	div(v-else)
		Button(variant="outline" @click="store.setupCurrentDay()") Change current day
		div {{ store.settings.currentDietDay.name }}
		div(v-for="a in store.settings.currentDietDay.options")
			span - {{ a.element }}
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.list-leave-active {
  position: absolute;
}
</style>

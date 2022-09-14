<template>
  <div id="circle-meter-container">
    <radial-progress-bar
      :diameter="165"
      :completed-steps="Math.floor(progress * 100)"
      :total-steps="100"
      :strokeWidth="15"
      :innerStrokeWidth="14"
      :strokeLinecap="'flat'"
      :startColor="'#f3822f'"
      :stopColor="'#f3822f'"
      :innerStrokeColor="gateReviewTransitionClassAdded ? '#fff' : '#d2d2d2'"
    >
      <h2 class="meter-headline bold-headline">Progress</h2>
      <h1 class="bold-headline">{{ Math.floor(progress * 100) }}%</h1>
    </radial-progress-bar>

    <radial-progress-bar
      :diameter="165"
      :completed-steps="Math.floor(success * 100)"
      :total-steps="100"
      :strokeWidth="15"
      :innerStrokeWidth="14"
      :strokeLinecap="'flat'"
      :startColor="'#1ab23b'"
      :stopColor="'#1ab23b'"
      :innerStrokeColor="gateReviewTransitionClassAdded ? '#fff' : '#d2d2d2'"
    >
      <h2 class="meter-headline bold-headline">Success</h2>
      <h1 class="bold-headline">{{ Math.floor(success * 100) }}%</h1>
    </radial-progress-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import RadialProgressBar from "vue-radial-progress"
// import { TEnter, TExit, TTimes } from "@/types"
// import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "CircleMeterContainer",
  components: { RadialProgressBar },
  methods: {},
  props: ["progress", "gateReviewTransitionClassAdded", "success"],
})
</script>

<style scoped lang="scss">
#circle-meter-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 2em;
  font-size: 0.85em;
  .radial-progress-container {
    margin-left: 0.4em;
    margin-right: 0.4em;
  }
  .radial-progress-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1em;
    margin-right: 1em;
    h1,
    h2 {
      margin: 0;
      padding: 0;
      line-height: 1.1em;
    }
    h1 {
      font-size: 2em;
      margin-top: 0.1em;
    }
  }
}
</style>

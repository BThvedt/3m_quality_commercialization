<template>
  <img
    id="the-coach"
    :src="require(`@/assets/images/shared/coach-circle.png`).default"
  />
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  name: "CoachImg",
  props: [],
})
</script>

<style scoped lang="scss">
#the-coach {
  transform: scale(0.8);
}
</style>

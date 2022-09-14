<template>
  <div>
    <div id="overlay"></div>

    <div id="text-container">
      <E t="h1" class="bold-headline" :h="title" />
      <E t="div" :h="text" />

      <div class="blue-button med-button" @click="completeAndExit">
        <E :h="exitButtonText" t="span" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "ConclusionPage",
  components: { E },
  data() {
    return {}
  },
  methods: {
    completeAndExit() {
      this.$emit("completeAndExit")
    },
  },
  props: ["title", "text", "exitButtonText"],
})
</script>

<style scoped lang="scss">
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
::v-deep #text-container {
  width: 38%;
  position: absolute;
  right: 9em;
  top: 8em;
  h1 {
    color: white;
  }
  p {
    font-family: $noto;
    color: $darkGray;
    color: white;
  }
}
.med-button {
  margin-top: 2em;
}
</style>

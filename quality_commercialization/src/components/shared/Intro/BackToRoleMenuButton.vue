<template>
  <div @click="goBackToRole" class="med-button orange-button">
    <font-awesome-icon icon="chevron-left" />
    &nbsp;&nbsp;&nbsp; <E :h="buttonText" t="p" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "BackToRoleMenuButton",
  components: { E },
  data() {
    return {}
  },
  methods: {
    goBackToRole() {
      this.$store.commit("meta/setRole", "")
      this.$store.dispatch("meta/goBackToRole")
    },
  },
  props: ["buttonText"],
})
</script>

<style scoped lang="scss">
.med-button {
  cursor: pointer;
  position: absolute;
  bottom: 2em;
}
</style>

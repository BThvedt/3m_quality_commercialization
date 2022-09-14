<template>
  <div id="continue-container-two">
    <div class="continue-button small-button pdf-button" @click="downloadPDF">
      <E :h="buttonText.e_download" t="span" />
    </div>
    <div class="continue-button small-button" @click="finish">
      <E :h="buttonText.e_continue" t="span" />
    </div>
  </div>
</template>

<script lang="ts">
import E from "@/components/editable/E.vue"
import Vue from "vue"
import { TEnter, TExit } from "@/types"
import axios from "axios"

export default Vue.extend({
  name: "SecondPageContinueButtons",
  data() {
    return {
      TEnter,
      TExit,
    }
  },
  methods: {
    finish() {
      this.$emit("finish")
    },
    downloadPDF() {
      axios
        .get("downloads/pdf/Quality at a Glance.pdf", { responseType: "blob" })
        .then((response) => {
          const blob = new Blob([response.data], { type: "application/pdf" })
          const link = document.createElement("a")
          link.href = URL.createObjectURL(blob)
          link.download = "Quality at a Glance"
          link.click()
          URL.revokeObjectURL(link.href)
        })
        .catch(console.error)
    },
  },
  props: ["buttonText"],
  components: { E },
})
</script>

<style scoped lang="scss">
#continue-container-two {
  position: absolute;
  bottom: 3%;
  right: 3%;
  display: flex;
  .pdf-button {
    width: 175px;
    margin-right: 30px;
  }
}
</style>

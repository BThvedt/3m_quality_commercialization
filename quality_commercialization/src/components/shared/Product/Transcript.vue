<template>
  <div class="transcript" v-if="transcriptShowing && theTranscript">
    <div class="transcript-container">
      <font-awesome-icon
        class="times-icon"
        icon="times"
        @click="hideTranscript"
      />
      <perfect-scrollbar :suppressScrollX="true">
        <!-- {{ theTranscript }}
        <E class="transcript-inner" :h="theTranscript" t="div" /> -->
        <div class="transcript-inner" v-html="theTranscript" />
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
// import { TEnter, TExit, TTimes } from "@/types"
import { PerfectScrollbar } from "vue2-perfect-scrollbar"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "Transcript",
  data() {
    return { theTranscript: null as string | null }
  },
  components: {
    PerfectScrollbar,
    // E,
  },
  methods: {
    hideTranscript() {
      this.$emit("hideTranscript")
    },
  },
  watch: {
    currentActiveAreaInfo(nv) {
      this.theTranscript = ""
      console.log("WE HAVE A NEW VALUE")
      console.log(nv)
      this.theTranscript = nv.e_transcript
    },
  },
  props: ["transcriptShowing", "currentActiveAreaInfo"],
})
</script>

<style scoped lang="scss">
.transcript {
  .ps {
    height: 185px;
    padding-right: 5%;
    box-sizing: border-box;
    .ps__rail-x {
      display: none;
    }
  }
  padding: 1em 2em 0em 3em;
  .transcript-container {
    padding: 1em;
    padding-top: 2em;
    padding-right: 2.5 em;
    border: 1px solid $lightGray;
    box-shadow: $box-shadow;
    position: relative;
    color: $lightGray;

    .times-icon {
      position: absolute;
      right: 12px;
      top: 8px;
      font-size: 1.5em;
      &:hover {
        color: black;
        cursor: pointer;
      }
    }
    .transcript-inner {
      font-size: 1em;
      color: $darkGray;
      font-family: $noto;
      p:first-of-type {
        margin-top: 0;
      }
    }
  }
}
</style>

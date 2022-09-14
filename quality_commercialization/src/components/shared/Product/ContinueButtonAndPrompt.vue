<template>
  <div>
    <transition :enter-active-class="TEnter.FADE_IN_UP" mode="out-in">
      <div
        class="continue-button-container"
        v-if="audioDoneContinueButton.audioDone"
        :key="'one'"
        @click="moveOntoQuestions"
      >
        <E
          class="continue-button small-button"
          :h="audioDoneContinueButton.e_text"
          t="div"
        />
      </div>
    </transition>
    <transition :enter-active-class="TEnter.FADE_IN_UP" mode="out-in">
      <div
        class="audio-prompt-container"
        v-if="audioDoneContinueButton.allowRevisit"
        :key="'two'"
      >
        <E
          class="sub-headline listen-again-propt"
          v-if="!feedbackModeActivated"
          :h="listenAgainText"
          t="h2"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Icon from "@/components/Icon.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"

export default Vue.extend({
  name: "ContinueButtonAndPrompt",
  data() {
    return {
      TEnter,
      TExit,
    }
  },
  methods: {
    moveOntoQuestions() {
      this.$emit("moveOntoQuestions")
    },
  },
  props: [
    "audioDoneContinueButton",
    "feedbackModeActivated",
    "listenAgainText",
  ],
  components: { E },
})
</script>

<style scoped lang="scss">
.continue-button-container {
  width: 80%;
  display: flex;
  flex-direction: row-reverse;

  margin: auto;
  margin-top: 1em;
  .continue-button {
    // color: $darkGray;
    width: 175px;
    // &:hover {
    //   color: black;
    // }
  }
}
.audio-prompt-container {
  width: 100%;
  text-align: center;
  margin: auto;
  position: absolute;
  bottom: 4%;

  h2 {
    margin-top: 0.5em;
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .sub-headline {
  h2 {
    font-size: 1em;
  }
}
</style>

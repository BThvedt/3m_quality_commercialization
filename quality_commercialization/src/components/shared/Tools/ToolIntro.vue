<template>
  <div>
    <transition
      :enter-active-class="`${TEnter.FADE_IN_UP} ${TTimes.MEDIUM}`"
      :leave-active-class="`${TExit.FADE_OUT} ${TTimes.MEDIUM}`"
      mode="out-in"
    >
      <div
        key="question-text-wrapper-1"
        v-if="promptNum >= 0 && startShowingPrompts"
        class="question-text-wrapper"
      >
        <transition :enter-active-class="`${TEnter.FADE_IN} ${TTimes.MEDIUM}`">
          <template v-for="(prompt, i) in prompts">
            <div class="question-text" v-if="promptNum == i" :key="i">
              <font-awesome-icon
                class="word-bubble-x"
                icon="times"
                @click="goToNextPrompt"
              />
              <E :t="'p'" :h="prompt.e_prompt" />
            </div>
          </template>
        </transition>
      </div>
    </transition>

    <ToolScroller
      :fileArray="fileArray"
      :currFileArrayIndex="currFileArrayIndex"
      :role="role"
      :transitionTimes="TTimes.MEDIUM"
      :label="label"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit, TTimes, TAttnSeek } from "@/types"
import ToolScroller from "./ToolScroller.vue"
import { genericAwait } from "@/lib/randomFunctions"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "ToolIntro",
  components: { ToolScroller, E },
  data() {
    return {
      prompts: this.introData.prompts,
      promptNum: -1,
      fileArray: this.introData.images,
      label: this.introData.e_imageLabel,
      currFileArrayIndex: 0,
      startShowingPrompts: false,
      TEnter,
      TExit,
      TTimes,
    }
  },
  async mounted() {
    this.promptNum = 0
    await genericAwait(1000)
    this.startShowingPrompts = true
  },
  methods: {
    goToNextPrompt() {
      if (this.promptNum < this.prompts.length - 1) {
        this.promptNum++
        this.currFileArrayIndex = this.prompts[this.promptNum].imageIndex
      } else {
        this.$emit("moveOn")
      }
    },
  },
  props: ["introData", "role"],
})
</script>

<style scoped lang="scss">
.question-text-wrapper {
  position: absolute;
  left: 30px;
  top: 39px;
  z-index: 100;
  width: 38%;
}
.question-text {
  padding: 1em;
  padding-right: 2em;
  outline: 1px solid $lightGray;
  box-shadow: $box-shadow;
  box-sizing: border-box;
  background: white;
  &.feedback {
    .sub-headline {
      padding: 0;
      margin: 0;
    }
    &.correct {
      .sub-headline {
        color: $correct;
      }
    }
    &.incorrect {
      .sub-headline {
        color: $incorrect;
      }
    }
  }
  p {
    font-family: $noto;
    text-align: left;
    margin: 0;
    padding: 0;
  }
  &::after {
    content: "";
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 20px solid white;
    display: block;
    position: absolute;
    top: -20px;
    left: 75px;
    transform: skewX(20deg);
  }
  &::before {
    content: "";
    border-left: 17px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 23px solid #e2e2e2;
    display: block;
    position: absolute;
    top: -23px;
    left: 73px;
    transform: skewX(20deg);
  }
  .word-bubble-x {
    position: absolute;
    right: 0.5em;
    top: 0.5em;
    cursor: pointer;
    color: $mediumGray;
    transition: $very-fast-transition;
    &:hover {
      color: black;
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .question-text p {
  font-family: $noto;
  font-size: 1em;
  margin: 0;
  padding: 0;
}
</style>

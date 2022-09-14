<template>
  <div>
    <transition
      :enter-active-class="`${TEnter.FADE_IN_UP}`"
      :leave-active-class="`${TExit.FADE_OUT}`"
      mode="out-in"
    >
      <div
        v-if="showPrompt || showFeedback"
        key="question-text-wrapper"
        class="question-text-wrapper"
      >
        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
          mode="out-in"
        >
          <div class="question-text" v-if="showPrompt" key="1">
            <!-- <p>{{ prompt }}</p> -->
            <E :h="prompt" t="p" />
          </div>
          <div class="question-text" v-else-if="showFeedback" key="2">
            <font-awesome-icon
              class="word-bubble-x"
              icon="times"
              @click="resetOrFinish"
            />
            <E :h="feedback" t="p" />
            <!-- <p>{{ feedback }}</p> -->
          </div>
        </transition>
      </div>
    </transition>

    <ToolScroller
      ref="toolScroller"
      :fileArray="fileArray"
      :currFileArrayIndex="currFileArrayIndex"
      :role="role"
      :hotspots="this.hotspotData.areas"
      @hotSpotSelected="handleHotSpotSelected"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit, TTimes, TAttnSeek } from "@/types"
import ToolScroller from "./ToolScroller.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "HotSpotSelect",
  components: { ToolScroller, E },
  data() {
    return {
      prompt: this.hotspotData.e_questionText,
      showPrompt: false,
      showFeedback: false,
      feedback: "",
      fileArray: this.hotspotData.images,
      currFileArrayIndex: 0,
      correct: false,
      TEnter,
      TExit,
      TTimes,
    }
  },
  mounted() {
    this.showPrompt = true
  },
  methods: {
    resetOrFinish() {
      if (this.correct) {
        this.$emit("moveOn")
      } else {
        this.showFeedback = false
        this.showPrompt = true
        ;(this.$refs["toolScroller"] as any).resetHotSpots()
      }
    },
    handleHotSpotSelected(payload: any) {
      let { correct } = payload
      this.correct = correct
      if (correct) {
        this.currFileArrayIndex = this.hotspotData.correctImageIndex
        this.feedback = this.hotspotData.feedback.e_correct
      } else {
        this.feedback = this.hotspotData.feedback.e_incorrect
      }

      this.showPrompt = false
      this.showFeedback = true
    },
    goToNextPrompt() {
      // if (this.promptNum < this.prompts.length - 1) {
      //   this.promptNum++
      //   this.currFileArrayIndex = this.prompts[this.promptNum].imageIndex
      // } else {
      //   this.$emit("moveOn")
      // }
    },
  },
  props: ["hotspotData", "role"],
})
</script>

<style scoped lang="scss">
.question-text-wrapper {
  position: absolute;
  left: 30px;
  top: 39px;
  z-index: 100;
  width: 37%;
}
.question-text {
  padding: 1em;
  outline: 1px solid $lightGray;
  box-shadow: $box-shadow;
  box-sizing: border-box;
  background: white;
  &.feedback {
    // padding-bottom: 3.5em;
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
::v-deep .question-text p {
  font-family: $noto;
  font-size: 1em;
  margin: 0;
  padding: 0;
}
</style>

<template>
  <div>
    <!-- The prompts -->
    <transition
      :enter-active-class="`${TEnter.FADE_IN} ${TTimes.MEDIUM}`"
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
                v-if="prompt.closeable"
              />
              <E :t="'p'" :h="prompt.e_prompt" />
            </div>
          </template>
        </transition>
      </div>
    </transition>
    <!-- End the promptsprompts -->

    <!-- The click/reveal popups -->
    <transition
      :enter-active-class="`${TEnter.FADE_IN} ${TTimes.MEDIUM}`"
      :leave-active-class="`${TExit.FADE_OUT} ${TTimes.MEDIUM}`"
      mode="out-in"
    >
      <div
        key="the-click-reveal-popups"
        v-if="revealPopupNum >= 0 && !showPopupPrompt"
        class="question-text-wrapper"
      >
        <transition
          :enter-active-class="`${TEnter.FADE_IN} ${TTimes.MEDIUM}`"
          :leave-active-class="`${TExit.FADE_OUT} ${TTimes.MEDIUM}`"
          mode="out-in"
        >
          <template v-for="(popup, i) in revealPopups">
            <div class="question-text" v-if="revealPopupNum == i" :key="i">
              <font-awesome-icon
                class="word-bubble-x"
                icon="times"
                @click="goToNextPopup"
              />
              <E :t="'p'" :h="popup" />
            </div>
          </template>
        </transition>
      </div>
      <div
        key="click-reveal-prompt"
        v-if="revealPopupNum < 0 && showPopupPrompt"
        class="question-text-wrapper"
      >
        <div class="question-text">
          <E t="p" :h="questionData.e_clickRevealPrompt" />
        </div>
      </div>
    </transition>
    <!-- End the popups -->

    <transition
      :enter-active-class="`${TEnter.FADE_IN_UP}`"
      :leave-active-class="`${TExit.FADE_OUT}`"
      mode="out-in"
    >
      <div
        v-if="showQuestion || showFeedback"
        key="question-text-wrapper"
        class="question-text-wrapper"
      >
        <transition
          :enter-active-class="`${TEnter.FADE_IN} ${TTimes.MEDIUM}`"
          :leave-active-class="`${TExit.FADE_OUT} ${TTimes.MEDIUM}`"
          mode="out-in"
        >
          <div class="question-text" v-if="showQuestion" key="1">
            <E :t="'p'" :h="questionText" />
          </div>
          <div class="question-text" v-else-if="showFeedback" key="2">
            <font-awesome-icon
              class="word-bubble-x"
              icon="times"
              @click="resetOrFinish"
            />
            <E :t="'p'" :h="feedback" />
          </div>
        </transition>
      </div>
    </transition>

    <transition
      :enter-active-class="`${TEnter.FADE_IN}`"
      :leave-active-class="`${TExit.FADE_OUT}`"
      mode="out-in"
    >
      <div id="question-section" v-if="showChoices">
        <div>
          <E
            :h="questionData.e_instructions"
            t="h4"
            class="question-instructions sub-headline"
          />
          <div class="choices-container">
            <div
              v-for="(choice, i) in questionData.choices"
              class="question-choice text-box"
              @click="select(i)"
              :key="i"
              :class="{
                selected: selected === i,
                correct:
                  answered &&
                  (selected === i || attemptNum > 1) &&
                  choice.correct,
                incorrect: selected === i && !choice.correct,
                answered: answered && selected !== i,
                medium: choice.e_text.length > 105,
              }"
            >
              <div
                class="question-feedback-icon"
                v-if="selected === i && !choice.correct"
              >
                <font-awesome-icon icon="times" />
              </div>
              <div
                class="question-feedback-icon"
                v-if="answered && choice.correct"
              >
                <Icon iconName="check" />
              </div>
              <E :h="choice.e_text" t="h4" class="question-choice-text" />
            </div>
          </div>
        </div>
      </div>
    </transition>

    <ToolScroller
      ref="toolScroller"
      :fileArray="fileArray"
      :currFileArrayIndex="currFileArrayIndex"
      :role="role"
      :hotspots="questionData.clickRevealAreas"
      :revealHotSpots="revealHotSpots"
      :alreadySelectedHotSpots="hotSpotsFinished"
      @hotSpotSelected="handleHotSpotSelected"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"
import ToolScroller from "./ToolScroller.vue"
import Icon from "@/components/Icon.vue"
import { genericAwait } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "MultiChoice",
  data() {
    return {
      prompts: this.questionData.prompts,
      promptNum: -1,
      startShowingPrompts: false,
      attemptNum: 0,

      revealHotSpots: false,
      revealPopups: [],
      revealPopupNum: -1,
      hotSpotIndexSelected: -1,
      hotSpotsFinished: [] as boolean[],

      showPopupPrompt: false,

      showQuestion: false,
      showFeedback: false,
      showChoices: false,
      questionText: this.questionData.e_questionText,
      feedback: "",
      fileArray: this.questionData.images,
      currFileArrayIndex: 0,
      answered: false,
      selected: -1,
      correct: false,
      TEnter,
      TExit,
      TTimes,
    }
  },
  async mounted() {
    this.promptNum = 0
    await genericAwait(1000)
    this.startShowingPrompts = true
    // this.showQuestion = true
    // await genericAwait(1000)
    // this.showChoices = true

    // do we hve hotspots? If so..
    if (this.questionData.clickRevealAreas) {
      this.hotSpotsFinished = new Array(
        this.questionData.clickRevealAreas.length
      ).fill(false)
    }
  },
  methods: {
    async goToNextPrompt() {
      // if (this.promptNum === this.prompts.length - 1) {
      //   // if we're not revealing hot spots then just go straight to the question

      //   if (!this.prompts[this.promptNum].revealHotSpots) {
      //     this.promptNum = -1
      //     await genericAwait(1000)
      //     this.showQuestion = true
      //     await genericAwait(1000)
      //     this.showChoices = true
      //   }
      // }

      if (this.promptNum < this.prompts.length - 1) {
        this.promptNum++
        this.currFileArrayIndex = this.prompts[this.promptNum].imageIndex
      } else {
        // if we're not revealing hot spots then just go straight to the question

        if (!this.prompts[this.promptNum].revealHotSpots) {
          this.promptNum = -1
          await genericAwait(1000)
          this.showQuestion = true
          await genericAwait(1000)
          this.showChoices = true
        }
      }

      if (
        this.prompts[this.promptNum] &&
        this.prompts[this.promptNum].revealHotSpots
      ) {
        await genericAwait(1000)
        this.revealHotSpots = true
      }
    },
    async handleHotSpotSelected(payload: any) {
      this.revealPopupNum = 0
      this.showPopupPrompt = false

      this.hotSpotIndexSelected = payload.index
      if (this.startShowingPrompts) {
        this.startShowingPrompts = false
        await genericAwait(1000)
        this.revealPopups = payload.e_popups
      } else {
        this.revealPopups = payload.e_popups
      }
    },

    async goToNextPopup() {
      if (this.revealPopupNum < this.revealPopups.length - 1) {
        this.revealPopupNum++
      } else {
        // ok. So next:
        // 1) reactivate.
        // 2) already selected state
        // 3) When all the popups are clicked, instead of reactivated, show question
        // alert("reactivate popups!")
        ;(this.$refs["toolScroller"] as any).resetHotSpots()
        this.revealPopupNum = -1
        this.hotSpotsFinished.splice(this.hotSpotIndexSelected, 1, true)

        if (this.hotSpotsFinished.every((entry) => entry)) {
          this.revealHotSpots = false
          await genericAwait(1000)

          this.showQuestion = true
          await genericAwait(1000)
          this.showChoices = true
        } else {
          this.showPopupPrompt = true
        }
      }
    },
    resetOrFinish() {
      if (this.correct) {
        this.$emit("moveOn")
      } else {
        this.reset()
      }
    },
    reset() {
      this.selected = -1
      this.correct = false
      this.answered = false
      this.showQuestion = true
      this.showFeedback = false
      this.currFileArrayIndex = 0
    },
    select(choice: number) {
      if (!this.answered) {
        this.answered = true
        this.selected = choice
        this.attemptNum++

        this.correct = this.questionData.choices[this.selected].correct
        this.feedback = this.getFeedback()
        this.showQuestion = false
        this.showFeedback = true
        this.currFileArrayIndex =
          this.questionData.choices[this.selected].imageIndex
      }
    },
    getFeedback() {
      let correct = this.questionData.choices[this.selected].correct
      if (this.questionData.feedback) {
        if (correct) {
          return this.questionData.feedback.e_correct
        } else {
          return this.questionData.feedback.e_incorrect
        }
      } else {
        return this.questionData.choices[this.selected].e_feedback
      }
    },
  },
  components: { ToolScroller, E, Icon },
  props: ["questionData", "role"],
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
  outline: 1px solid $lightGray;
  box-shadow: $box-shadow;
  box-sizing: border-box;
  background: white;
  padding-right: 2em;
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
#question-section {
  width: 42%;
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  padding: 2em;
  padding-bottom: 3em;
  box-sizing: border-box;
  padding-top: 210px;
  display: flex;
  flex-direction: column;
  .sub-headline {
    margin: 0;
    padding: 0;
  }
}
.choices-container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .question-choice {
    margin: 0.5em 0 0 0;
    cursor: pointer;
    transition: $very-fast-transition;
    position: relative;
    font-size: 16px;
    font-weight: normal;
    padding-left: 3.1em;
    padding-right: 1.6em;
    box-sizing: border-box;
    &.text-box {
      justify-content: flex-start;
      &.medium {
        height: 5em;
      }
    }

    &.correct {
      background: $correct;
      color: white;
      border: 1px solid $correct;
      opacity: 0.5;
      &:hover {
        background: $correct;
        cursor: default;
      }
      &.answered {
        &:hover {
          background: $correct;
          cursor: default;
          color: white;
        }
      }
    }
    &.selected {
      &.correct {
        background: $correct;
        color: white;
        border: 1px solid $correct;
        opacity: 1;
        &:hover {
          background: $correct;
          cursor: default;
        }
      }
    }
    &.incorrect {
      background: $incorrect;
      color: white;
      border: 1px solid $incorrect;
      &:hover {
        background: orangered;
        cursor: default;
      }
    }
    &.answered {
      &:hover {
        background: white;
        cursor: default;
        color: $mediumGray;
        border-color: $mediumGray;
      }
    }

    ::v-deep .question-feedback-icon {
      position: absolute;
      left: 12px;
      font-size: 1.5em;
      svg {
        position: relative;
        font-size: 1.4em;
      }
      .icon-container {
        svg {
          width: 30px;
          height: 30px;
          fill: white;
          top: 0px;
        }
      }
    }
    .question-choice-text {
      padding: 0;
      margin: 0;
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
::v-deep .sub-headline h4 {
  margin: 0;
  padding: 0;
}
</style>

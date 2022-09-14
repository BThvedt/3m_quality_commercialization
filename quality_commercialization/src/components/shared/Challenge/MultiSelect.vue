<template>
  <div>
    <div id="circle-meter-container">
      <radial-progress-bar
        :diameter="140"
        :completed-steps="100 - elapsedTimeAsNumber"
        :total-steps="100"
        :strokeWidth="15"
        :innerStrokeWidth="14"
        :strokeLinecap="'flat'"
        :startColor="strokeColor"
        :stopColor="strokeColor"
        :innerStrokeColor="'#d2d2d2'"
      >
        <h2 class="meter-headline small-headline">Question</h2>
        <p>
          {{ questionNum + 1 }} of
          {{ totalQuestions }}
        </p>
      </radial-progress-bar>
    </div>
    <E
      :h="question.e_questionText"
      t="h3"
      class="question-text small-headline"
    />
    <E
      :h="question.e_instructions"
      t="h4"
      class="question-instructions sub-headline"
    />
    <div class="choices-container">
      <div
        v-for="(choice, i) in question.choices"
        class="question-choice text-box"
        @click="select(i)"
        :key="i"
        :class="{
          selected: !answered && selected.includes(i),
          correct: answered && choice.correct,
          wasNotSelected: answered && choice.correct && !selected.includes(i),
          incorrect: answered && selected.includes(i) && !choice.correct,
          answered: answered && !selected.includes(i) && !choice.correct,
          timesUp: timesUp,
          medium: choice.e_text.length > 105,
        }"
      >
        <div
          class="question-feedback-icon"
          v-if="answered && selected.includes(i) && !choice.correct"
        >
          <font-awesome-icon icon="times" />
        </div>
        <div class="question-feedback-icon" v-if="answered && choice.correct">
          <Icon iconName="check" />
        </div>
        <E :h="choice.e_text" t="p" class="question-choice-text" />
      </div>
    </div>
    <transition
      :enter-active-class="`${TEnter.FADE_IN_UP}`"
      :leave-active-class="`${TExit.FADE_OUT}`"
    >
      <div class="submit-container" v-if="!answered && !timesUp">
        <div
          class="continue-button small-button submit-button"
          @click="submit"
          :class="{ active: !answered }"
        >
          <E :h="question.e_submitText" t="p" class="submit-text" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"
import Icon from "@/components/Icon.vue"
import RadialProgressBar from "vue-radial-progress"
import rgbHex from "rgb-hex"

export default Vue.extend({
  name: "MultiSelect",
  components: { E, Icon, RadialProgressBar },
  data() {
    return {
      answered: false,
      selected: [] as number[],

      strokeColor: "#1ab23b",
      interval: null as any,
      elapsedTime: 0,
      elapsedTimeAsNumber: 0,
      totalTimeInMilleseconds: this.totalTime * 1000, // milliseconds

      currentPrompt: -1,
      timesUp: false,

      TEnter,
      TExit,
      TTimes,
    }
  },
  mounted() {
    this.startTimer()
  },
  methods: {
    select(choice: number) {
      if (!this.timesUp) {
        if (!this.answered && !this.selected.includes(choice)) {
          // this.answered = true
          this.selected.push(choice)
        } else if (!this.answered) {
          this.selected = this.selected.filter((entry) => entry !== choice)
        }
      }
    },
    startTimer() {
      this.interval = setInterval(async () => {
        this.elapsedTime += 100
        this.elapsedTimeAsNumber = Math.floor(
          (this.elapsedTime / this.totalTimeInMilleseconds) * 100
        )

        let redAdd = Math.floor(
          (this.elapsedTime / this.totalTimeInMilleseconds) * 229
        )
        let greenSubtract = Math.floor(
          (this.elapsedTime / this.totalTimeInMilleseconds) * 178
        )
        let blueSubtract = Math.floor(
          (this.elapsedTime / this.totalTimeInMilleseconds) * 59
        )

        this.strokeColor = `#${rgbHex(
          26 + redAdd < 255 ? 26 + redAdd : 255,
          178 - greenSubtract > 0 ? 178 - greenSubtract : 0,
          59 - blueSubtract > 0 ? 59 - blueSubtract : 0
        )}`

        if (this.question.prompts) {
          if (this.currentPrompt < this.question.prompts.length - 1) {
            if (
              this.elapsedTime >
              this.question.prompts[this.currentPrompt + 1].time * 1000
            ) {
              this.currentPrompt = this.currentPrompt + 1
            }
          }
        }

        if (this.elapsedTime >= this.totalTimeInMilleseconds) {
          clearInterval(this.interval)
          this.timesUp = true
          this.$emit("timesUp", this.question.e_timesUpMessage)
        }
      }, 100)
    },
    submit() {
      this.answered = true
      let correct = true
      let numberOfCorrect = 0
      clearInterval(this.interval)
      this.question.choices.forEach((choice: any) => {
        if (choice.correct) {
          numberOfCorrect++
        }
      })

      this.selected.forEach((choice: number) => {
        if (!this.question.choices[choice].correct) {
          correct = false
        }
      })

      // ok so if still correct now we know that none SELECTED were wrong..
      // but did we select ALL of the available choices? Let's look at how many selections were made ..

      if (correct) {
        if (this.selected.length !== numberOfCorrect) {
          correct = false
        }
      }

      let feedback: string

      if (correct) {
        feedback = this.question.feedback.e_correct
      } else {
        feedback = this.question.feedback.e_incorrect
      }

      this.$emit("answered", {
        correct,
        feedback,
      })
    },
  },
  watch: {
    currentPrompt(nv, ov) {
      if (!this.tryingAgain) {
        this.$emit("changePromptNumber", this.currentPrompt)
      } else if (!this.question.prompts[this.currentPrompt].hideOnTryAgain) {
        this.$emit("changePromptNumber", this.currentPrompt)
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  props: [
    "question",
    "questionNum",
    "totalQuestions",
    "totalTime",
    "tryingAgain",
  ],
})
</script>

<style scoped lang="scss">
#circle-meter-container {
  margin-top: 0.3em;
  margin-bottom: 0.3em;
  display: flex;
  justify-content: center;
  .small-headline,
  p {
    margin: 0;
    padding: 0;
    position: relative;
    top: 4px;
  }
  .small-headline {
    text-transform: uppercase;
  }
  font-family: $noto;
}
.question-text,
.question-instructions {
  text-align: center;
  margin: 0;
  padding: 0;
  margin-bottom: 0.3em;
}
.question-instructions {
  font-style: italic;
}
.submit-container {
  margin: 0.75em 0 0 0;

  display: flex;
  justify-content: center;
}
.choices-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .question-choice {
    width: 80%;
    // border: 1px solid black;
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
    &:hover {
      border: 2px solid #a8a8a8;
    }
    &.selected {
      background: $selected;
      border: 2px solid $selected;
      color: white;
      &:hover {
        background: $selected;
        cursor: default;
        border: 2px solid $selected;
      }
      &.timesUp {
        &:hover {
          color: white;
          border: 2px solid $selected;
        }
      }
    }
    &.correct {
      background: $correct;
      color: white;
      border: 1px solid $correct;
      &:hover {
        border: 2px solid $correct;
        background: $correct;
        cursor: default;
      }
      &.wasNotSelected {
        opacity: 0.5;
        border: 1px solid $correct;
      }
    }
    &.incorrect {
      background: $incorrect;
      color: white;
      border: 1px solid $incorrect;
      &:hover {
        background: $incorrect;
        cursor: default;
      }
    }
    &.answered {
      opacity: 0.5;
      &:hover {
        background: white;
        cursor: default;
        color: $mediumGray;
      }
    }
    &.timesUp {
      opacity: 0.5;
      &:hover {
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
        // bottom: 5px;
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
::v-deep .small-headline {
  h3 {
    text-align: center;
    margin: 0;
    padding: 0;
    margin-bottom: 0.3em;
    font-size: 1em;
  }
}
::v-deep .sub-headline {
  h4 {
    text-align: center;
    margin: 0;
    padding: 0;
    margin-bottom: 0.3em;
    font-size: 1em;
  }
}
</style>

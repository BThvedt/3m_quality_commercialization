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
          selected: selected === i,
          correct: answered && choice.correct,
          incorrect: selected === i && !choice.correct,
          answered: answered && selected !== i && !choice.correct,
          timesUp: timesUp,
          medium: choice.e_text.length > 105,
        }"
      >
        <div
          class="question-feedback-icon"
          v-if="selected === i && !choice.correct"
        >
          <font-awesome-icon icon="times" />
        </div>
        <div class="question-feedback-icon" v-if="answered && choice.correct">
          <Icon iconName="check" />
        </div>

        <E :h="choice.e_text" t="h4" class="question-choice-text" />
      </div>
    </div>
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
  name: "MultiChoice",
  components: { E, Icon, RadialProgressBar },
  data() {
    return {
      answered: false,
      selected: -1,

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
      if (!this.answered && !this.timesUp) {
        this.answered = true
        this.selected = choice
        clearInterval(this.interval)
        this.$emit("answered", {
          correct: this.question.choices[this.selected].correct,
          feedback: this.getFeedback(),
        })
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
    getFeedback() {
      let correct = this.question.choices[this.selected].correct
      if (this.question.feedback) {
        if (correct) {
          return this.question.feedback.e_correct
        } else {
          return this.question.feedback.e_incorrect
        }
      } else {
        return this.question.choices[this.selected].e_feedback
      }
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
    &.correct {
      background: $correct;
      color: white;
      border: 1px solid $correct;
      &:hover {
        background: $correct;
        cursor: default;
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
      opacity: 0.5;
      &:hover {
        background: white;
        cursor: default;
        color: $mediumGray;
        border-color: $mediumGray;
      }
    }
    &.timesUp {
      opacity: 0.5;
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

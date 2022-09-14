<template>
  <div id="question-wrapper" :class="question.specialClass">
    <div id="left">
      <E :h="question.e_prompt" t="h3" class="bold-headline question-prompt" />

      <E
        :h="question.e_instructions"
        t="h4"
        class="sub-headline question-instructions"
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
            medium: choice.e_text.length > 116,
          }"
        >
          <font-awesome-icon
            icon="times"
            class="question-feedback-icon"
            v-if="selected === i && !choice.correct"
          />
          <div class="question-feedback-icon" v-if="answered && choice.correct">
            <Icon iconName="check" />
          </div>

          <E :h="choice.e_text" t="h4" class="question-choice-text" />
        </div>
      </div>
    </div>
    <div id="right">
      <img
        :src="
          require(`@/assets/images/Quality/Product/questions/${question.questionImage}`)
            .default
        "
      />
    </div>
    <StandardModal
      ref="FeedbackModal"
      :titleAndText="feedback"
      @onClose="closeQuestion"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
// import { bigConsoleLog } from "@/lib/randomFunctions"
import { TEnter, TExit, TTimes } from "@/types"
import Icon from "@/components/Icon.vue"
import StandardModal from "@/components/modals/StandardModal.vue"
import { genericAwait } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "MultiChoice",
  components: { E, Icon, StandardModal },
  data() {
    return {
      answered: false,
      selected: -1,
      feedback: null as {
        title: string
        text: string
      } | null,
      correct: null as boolean | null,
      TEnter,
      TExit,
      TTimes,
    }
  },
  methods: {
    closeQuestion() {
      this.$emit("answered", { correct: this.correct, feedback: this.feedback })
    },
    async select(choice: number) {
      if (!this.answered) {
        this.answered = true
        this.selected = choice
        this.correct = this.question.choices[this.selected].correct
        this.feedback = this.getFeedback()

        await genericAwait(1000)
        ;(this.$refs["FeedbackModal"] as any).show()
      }
    },
    getFeedback() {
      let correct = this.question.choices[this.selected].correct
      if (this.question.feedback) {
        if (correct) {
          return this.question.feedback.correct
        } else {
          return this.question.feedback.incorrect
        }
      } else {
        return this.question.choices[this.selected].feedback
      }
    },
  },
  props: ["question"],
})
</script>

<style scoped lang="scss">
#question-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  #left {
    display: flex;
    // align-items: center;
    // justify-content: center;
    flex-direction: column;
    width: 50%;
    box-sizing: border-box;
    padding: 2em;

    .question-prompt {
      text-align: left;
    }
    .choices-container {
      width: 100%;
    }
    .bold-headline {
      font-size: 1em;
    }
  }
  #right {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 50%;
    img {
      width: 80%;
    }
  }
  &.big-image {
    #left {
      width: 35%;
      padding-right: 0;
    }
    #right {
      width: 65%;
      padding: 0;
      img {
        width: 95%;
      }
    }
    .bold-headline {
      font-size: 1.2em;
    }
  }
}
.question-title,
.question-prompt,
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
::v-deep .bold-headline {
  // font-size: 1.2em;
  h3 {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
}
::v-deep .sub-headline {
  h4 {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
}
</style>

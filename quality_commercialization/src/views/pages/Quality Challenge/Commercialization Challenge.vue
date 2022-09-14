<template>
  <PageBase>
    <transition
      :enter-active-class="TEnter.FADE_IN"
      :leave-active-class="TExit.FADE_OUT"
    >
      <div v-if="!resetting" id="page-c" class="module-page-container">
        <TitleAndSubTitle :title="json.e_title" :subTitle="json.e_subTitle" />

        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
        >
          <CoachImg id="the-coach" v-if="componentShowTracker.coach" />
        </transition>

        <transition
          :enter-active-class="`${TEnter.FADE_IN_UP}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
          mode="out-in"
        >
          <div
            key="question-text-wrapper-1"
            v-if="
              !questionFeedback &&
              ((activeQuestion >= 0 && questionPromptShowingIndex >= 0) ||
                specialPrompt)
            "
            class="question-text-wrapper"
          >
            <QuestionBubble
              v-if="specialPrompt"
              @close="closeSpecialPrompt"
              :prompt="specialPrompt"
              :closeable="true"
            />

            <template
              v-else-if="activeQuestion >= 0 && questionPromptShowingIndex >= 0"
            >
              <transition
                :enter-active-class="`${TEnter.FADE_IN}`"
                :leave-active-class="`${TExit.FADE_OUT}`"
                mode="out-in"
              >
                <template
                  v-for="(prompt, i) in questions[activeQuestion].prompts"
                >
                  <QuestionBubble
                    :key="i"
                    v-if="questionPromptShowingIndex == i"
                    :prompt="questions[activeQuestion].prompts[i].e_text"
                    :closeable="false"
                  />
                </template>
              </transition>
            </template>
          </div>
          <div
            key="question-text-wrapper-2"
            v-else-if="questionFeedback"
            class="question-text-wrapper"
          >
            <QuestionBubble
              :key="i"
              @close="goToNextQuestion"
              :prompt="questionFeedback"
              :closeable="true"
            />
          </div>
        </transition>

        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
        >
          <ScoreTracker
            :correctTracker="correctTracker"
            :tryAgainIndexes="tryAgainIndexes"
            :tryAgainQuestionNum="tryAgainQuestionNum"
          />
        </transition>

        <div id="main-area">
          <transition
            :enter-active-class="`${TEnter.FADE_IN}  `"
            :leave-active-class="`${TExit.FADE_OUT}  `"
          >
            <div
              id="question-area"
              key="question-area"
              v-if="activeQuestion >= 0"
            >
              <transition
                :enter-active-class="`${TEnter.FADE_IN}  `"
                :leave-active-class="`${TExit.FADE_OUT}  `"
                mode="out-in"
              >
                <template v-for="(question, i) in questions">
                  <div
                    class="question-container"
                    :key="i"
                    v-if="activeQuestion === i"
                    :class="`question-${i}-${tryAgain}`"
                  >
                    <transition
                      :enter-active-class="`${TEnter.FADE_IN}  `"
                      :leave-active-class="`${TExit.FADE_OUT}  `"
                    >
                      <MultiChoice
                        :question="question"
                        :questionNum="tryAgainMode ? tryAgainQuestionNum : i"
                        :totalQuestions="
                          tryAgainMode
                            ? tryAgainIndexes.length
                            : questions.length
                        "
                        :totalTime="question.time"
                        @changePromptNumber="handlePromptChange"
                        @answered="handleQuestionAnswer"
                        @timesUp="handleTimesUp"
                        :tryingAgain="tryAgainMode"
                        v-if="question.questionType === 'multiple-choice'"
                      />
                      <MultiSelect
                        :question="question"
                        :questionNum="tryAgainMode ? tryAgainQuestionNum : i"
                        :totalQuestions="
                          tryAgainMode
                            ? tryAgainIndexes.length
                            : questions.length
                        "
                        :totalTime="question.time"
                        @answered="handleQuestionAnswer"
                        @changePromptNumber="handlePromptChange"
                        @timesUp="handleTimesUp"
                        :tryingAgain="tryAgainMode"
                        v-if="question.questionType === 'multiple-select'"
                      />
                      <!-- {{ i }} -->
                    </transition>
                  </div>
                </template>
              </transition>
            </div>
          </transition>
        </div>

        <IntroConclusionModal
          ref="IntroModal"
          :titleAndText="introModal"
          @onClose="revealComponents"
          :coach="true"
        />

        <FeedbackModal
          ref="ResultsFeedbackModal"
          :feedBack="feedBack"
          :correctTracker="correctTracker"
          @onClose="goBackHome"
          @tryAgain="tryAgain"
        />
      </div>
    </transition>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit, TTimes, TAttnSeek } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import IntroConclusionModal from "@/components/modals/IntroConclusionModal.vue"
import FeedbackModal from "@/components/modals/FeedbackModal.vue"
import TitleAndSubTitle from "@/components/TitleAndSubtitle.vue"
import MultiChoice from "@/components/shared/Challenge/MultiChoice.vue"
import MultiSelect from "@/components/shared/Challenge/MultiSelect.vue"
import CoachImg from "@/components/shared/CoachImg.vue"
import QuestionBubble from "@/components/shared/Challenge/QuestionBubble.vue"
import ScoreTracker from "@/components/shared/Challenge/ScoreTracker.vue"

export default Vue.extend({
  name: "Menu",
  components: {
    TitleAndSubTitle,
    PageBase,
    IntroConclusionModal,
    MultiChoice,
    MultiSelect,
    CoachImg,
    FeedbackModal,
    QuestionBubble,
    ScoreTracker,
  },
  data() {
    return {
      introModal: this.json.introModal,
      questions: this.json.questions,
      feedBack: this.json.feedBack,
      // correctTracker: [] as (boolean | null)[],
      correctTracker: [] as (boolean | null)[],
      activeQuestion: -1,
      questionPromptShowingIndex: -1,
      specialPrompt: "",
      questionFeedback: "",
      componentShowTracker: {
        coach: false,
        score: false,
      },
      TEnter,
      TExit,
      TTimes,
      TAttnSeek,
      tryAgainMode: false,
      resetting: false,
      tryAgainIndexes: [] as number[],
      tryAgainQuestionNum: 0,
    }
  },
  async mounted() {
    // alert("todo: change json to have the e_ tages. Finish Feedback modal.")
    // ;(this.$refs["ResultsFeedbackModal"] as any).show()
    await genericAwait(1000)
    ;(this.$refs["IntroModal"] as any).show()

    this.correctTracker = new Array(this.questions.length).fill(null)
  },

  methods: {
    async revealComponents() {
      await genericAwait(500)
      this.componentShowTracker.coach = true
      await genericAwait(500)
      this.componentShowTracker.score = true
      await genericAwait(500)
      this.showFirstPrompt()
    },
    goBackHome() {
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/markSectionComplete", currSection)
      this.$store.dispatch("meta/goHome") // goes to the home of the current role
    },
    finish() {
      ;(this.$refs["ResultsFeedbackModal"] as any).show()
    },
    async tryAgain() {
      this.resetting = true
      this.tryAgainMode = true
      this.activeQuestion = -1
      this.tryAgainQuestionNum = 0
      this.specialPrompt = this.json.tryAgainPrompt
      this.tryAgainIndexes = []

      this.correctTracker.forEach((entry: boolean | null, i: number) => {
        if (!this.correctTracker[i]) {
          this.tryAgainIndexes.push(i)
        }
      })

      await genericAwait(1000)
      this.resetting = false
      await genericAwait(1000)
    },
    goToNextQuestion() {
      this.specialPrompt = ""
      this.questionFeedback = ""
      this.questionPromptShowingIndex = -1
      if (!this.tryAgainMode) {
        if (this.activeQuestion < this.questions.length - 1) {
          this.activeQuestion++
        } else {
          this.specialPrompt = this.json.e_specialPrompts[1]
        }
      } else {
        // this is a little convoluted but oh well
        if (this.tryAgainQuestionNum < this.tryAgainIndexes.length - 1) {
          this.tryAgainQuestionNum++
          this.activeQuestion = this.tryAgainIndexes[this.tryAgainQuestionNum]
        } else {
          this.specialPrompt = this.json.e_specialPrompts[1]
        }
      }
    },
    handlePromptChange(newPromptNumber: number) {
      this.questionPromptShowingIndex = newPromptNumber
    },
    async closeSpecialPrompt() {
      // this happens right at the start and right at the end
      if (this.activeQuestion === -1) {
        this.specialPrompt = ""
        await genericAwait(1000)

        if (!this.tryAgainMode) {
          this.activeQuestion = 0
        } else {
          this.activeQuestion = this.tryAgainIndexes[this.tryAgainQuestionNum]
        }
      } else {
        // if we're we must be finishing. Convoluted logic I guess haha
        this.specialPrompt = ""
        this.finish()
      }
    },

    async showFirstPrompt() {
      this.specialPrompt = this.json.e_specialPrompts[0]
    },
    handleQuestionAnswer(payload: { correct: boolean; feedback: string }) {
      let { correct: correctOrNot, feedback } = payload
      this.questionFeedback = feedback
      this.correctTracker.splice(this.activeQuestion, 1, correctOrNot)
    },
    handleTimesUp(timesUpMessage: string) {
      this.questionFeedback = timesUpMessage
      this.correctTracker.splice(this.activeQuestion, 1, false)
    },
  },
  // beforeDestroy() {
  //   console.log("before destroy")
  // },
  // watch: {},
  props: ["json"],
})
</script>

<style scoped lang="scss">
#the-coach {
  position: absolute;
  top: 15px;
  left: 17px;
}
#main-area {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
#question-area {
  width: 50%;
}
.question-text-wrapper {
  position: absolute;
  left: 30px;
  top: 150px;
  z-index: 100;
  width: 30%;
}
</style>

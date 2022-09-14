<template>
  <PageBase>
    <div id="build-business-case" class="module-page-container">
      <!-- <div id="top">
        <E class="bold-headline" t="h1" :h="json.e_title" />
      </div> -->

      <HeadlineAndResults
        :activityPhases="activityPhases"
        :questionResults="questionResults"
        :feedbackModeActivated="feedbackModeActivated"
        :activityPhase="activityPhase"
        @feedbackIconClicked="showRevisitModal"
      />

      <div id="top">
        <E class="sub-headline" t="h1" :h="json.e_title" />
      </div>

      <div id="bottom-section">
        <div id="left-bottom-section">
          <img
            id="contenents-bg"
            :src="
              require('@/assets/images/Quality/Product/comm-product-map.jpg')
                .default
            "
          />

          <div id="icon-container">
            <div
              v-for="(icon, index) in questions"
              class="question-icon"
              :class="`icon-${icon.id} ${
                questionsDone[index] ? 'question-done' : ''
              }`"
              :key="icon.id"
              @click="askQuestion(index)"
            >
              <Icon
                v-if="questionsDone[index]"
                class="done-icon"
                iconName="check"
              />
              <img
                :src="
                  require(`@/assets/images/Quality/Product/questions/${icon.image}`)
                    .default
                "
              />
            </div>
          </div>
        </div>
        <div
          id="right-bottom-section"
          :class="{ 'gate-review-modal': gateReviewTransitionClassAdded }"
        >
          <CircleMeterContainer
            :progress="progress"
            :gateReviewTransitionClassAdded="gateReviewTransitionClassAdded"
            :success="success"
          />

          <Badges
            :currBadgeIndex="currBadgeIndex"
            :badges="badges"
            :showBadgesArr="showBadgesArr"
          />
        </div>
      </div>

      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="TExit.FADE_OUT"
      >
        <PopupMessage
          :showBadgePopup="showBadgePopup"
          :gateReviewTransitionClassAdded="gateReviewTransitionClassAdded"
          :badges="badges"
          v-show="showBadgePopup"
          :currBadgeIndex="currBadgeIndex"
          @closeBadgePopup="closeBadgePopup"
        />
      </transition>

      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="TExit.FADE_OUT"
      >
        <template v-for="(question, index) in questions">
          <div
            class="question-overlay"
            :key="index"
            v-if="selectedQuestion === index"
          >
            <MultiChoice
              :question="questions[index]"
              @answered="handleQuestionAnswer"
              v-if="question.questionType === 'multiple-choice'"
            />
            <MultiSelect
              :question="questions[index]"
              @answered="handleQuestionAnswer"
              v-if="question.questionType === 'multiple-select'"
            />
            <ToolSelect
              :question="questions[index]"
              @answered="handleQuestionAnswer"
              v-if="question.questionType === 'area-select'"
            />
          </div>
        </template>
      </transition>

      <IntroConclusionModal
        ref="businessCaseIntro"
        :titleAndText="businessCaseIntro"
      />

      <IntroConclusionModal
        ref="businessCaseConclusion"
        :titleAndText="businessCaseConclusion"
        @onClose="goBackToCommercialize"
      />

      <StandardModal
        ref="QuestionFeedbackModal"
        :titleAndText="selectedQuestionFeedback"
        @onClose="hideFeedback"
      />
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"
import Icon from "@/components/Icon.vue"
import MultiChoice from "@/components/shared/Product/MultiChoice.vue"
import MultiSelect from "@/components/shared/Product/MultiSelect.vue"
import ToolSelect from "@/components/shared/Product/ToolSelect.vue"
import { genericAwait } from "@/lib/randomFunctions"
import IntroConclusionModal from "@/components/modals/IntroConclusionModal.vue"
import StandardModal from "@/components/modals/StandardModal.vue"
import HeadlineAndResults from "@/components/shared/Product/HeadlineAndResults.vue"
import CircleMeterContainer from "@/components/shared/Product/CircleMeterContainer.vue"
import PopupMessage from "@/components/shared/Product/PopupMessage.vue"
import Badges from "@/components/shared/Product/Badges.vue"

const TOTAL_QUESTIONS = 16
const TOTAL_POINTS = 16

export default Vue.extend({
  name: "BuildBusinesCase",
  components: {
    PageBase,
    E,
    Icon,
    MultiChoice,
    MultiSelect,
    ToolSelect,
    IntroConclusionModal,
    StandardModal,
    HeadlineAndResults,
    CircleMeterContainer,
    PopupMessage,
    Badges,
  },
  data() {
    return {
      activityPhases: this.json.activityPhases,
      // questionResults: [[], [], [], [], []] as any, // arrays are filled with {correct: boolean,
      questions: this.json.questions,
      icons: [],
      activityPhase: 0,
      feedbackModeActivated: false,
      badges: this.json.badges,
      TEnter,
      TExit,
      TTimes,
      gateReviewTransitionClassAdded: false,
      questionsAnswered: 4,
      successPoints: 4,
      selectedQuestion: -1,
      TOTAL_QUESTIONS,
      TOTAL_POINTS,
      //questionsDone: [false, false, false, false],
      selectedQuestionFeedback: {} as any, //should have a title and text
      businessCaseIntro: this.json.businessCaseIntro,
      businessCaseConclusion: this.json.businessCaseConclusion,
      showBadgePopup: false,
      currBadgeIndex: null as number | null,
      // fakeShowBadgesArr: [true, true, true, true, true],
    }
  },
  async mounted() {
    await genericAwait(1000)
    ;(this.$refs["businessCaseIntro"] as any).show()
  },
  methods: {
    showRevisitModal(feedback: { e_title: string; e_text: string }) {
      this.selectedQuestionFeedback = feedback
      this.$nextTick(() => {
        ;(this.$refs["QuestionFeedbackModal"] as any).show()
      })
    },
    hideFeedback() {
      console.log("feedback hidden")
    },
    goBackToCommercialize() {
      this.$store.dispatch("meta/returnFromHiddenPage")
    },
    async closeBadgePopup() {
      this.showBadgePopup = false
      await genericAwait(1000)
      this.$store.commit("showABadge")
      await genericAwait(1000)
      this.checkIfDone()
    },
    async handleQuestionAnswer(payload: any) {
      this.$store.dispatch("setCommercializationQuestionResult", {
        area: "quality",
        phaseIndex: this.activityPhase,
        questionNum: this.selectedQuestion,
        result: payload,
      })

      let theFormerallySelectedQuestion = this.selectedQuestion
      this.selectedQuestion = -1

      if (this.questions[theFormerallySelectedQuestion].showBadge) {
        await genericAwait(1000)

        // eh shoot. Which badge are we showing again
        this.currBadgeIndex = this.showBadgesArr.findIndex(
          (entry: boolean) => !entry
        )

        this.showBadgePopup = true
      } else {
        this.checkIfDone()
      }
    },
    async checkIfDone() {
      if (!this.questionsDone.includes(false)) {
        await genericAwait(1000)
        ;(this.$refs["businessCaseConclusion"] as any).show()
      }
    },
    askQuestion(index: number) {
      if (!this.questionsDone[index]) {
        this.selectedQuestion = index
      }
    },
  },
  computed: {
    questionResults(): (boolean | null)[][] {
      return this.$store.getters["getCommercializationQuestionResults"](
        "quality"
      )
    },
    questionsDone(): boolean[] {
      let thisPhaseResults =
        this.$store.getters["getCommercializationQuestionResults"]("quality")[0]

      return thisPhaseResults.map((result: any) => !!result)
    },
    success(): number {
      let totalSuccessPoints = this.questionResults.flat().length
      let earnedSuccessPoints = this.questionResults
        .flat()
        .reduce((acc, curr: any) => {
          return acc + (curr && curr.correct ? 1 : 0)
        }, 0)

      return earnedSuccessPoints / totalSuccessPoints
    },
    progress(): number {
      let progressPoints = this.questionResults.flat().length
      let earnedProgreesPoints = this.questionResults
        .flat()
        .reduce((acc, curr: any) => {
          return acc + (curr ? 1 : 0)
        }, 0)

      return earnedProgreesPoints / progressPoints
    },
    showBadgesArr(): boolean[] {
      return this.$store.getters["getBadgesShowing"]
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#top {
  text-align: center;
}
.question-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: white;
  z-index: 100;
}
.question-icon {
  img {
    width: 142px;
    opacity: 0.7;
    transition: $very-fast-transition;
    cursor: pointer;
    &:hover {
      opacity: 1;
      filter: drop-shadow(0px 0px 7px #f8c231);
    }
  }
  &.question-done {
    img {
      opacity: 1;
      cursor: default;
      &:hover {
        filter: none;
      }
    }
  }
  position: absolute;
  .done-icon {
    position: absolute;
    fill: green;
    width: 30px;
  }
  &.icon-1 {
    top: 290px;
    left: 267px;
    img {
      width: 70px;
    }

    .done-icon {
      left: -30px;
      top: -13px;
    }
  }
  &.icon-2 {
    top: 194px;
    left: 417px;

    img {
      width: 153px;
    }
    .done-icon {
      left: 125px;
      top: 11px;
    }
  }
  &.icon-3 {
    top: 53px;
    left: 118px;
    .done-icon {
      left: -26px;
      top: 15px;
    }
  }
  &.icon-4 {
    top: 85px;
    left: 380px;

    img {
      width: 110px;
    }
    .done-icon {
      left: -27px;
      top: 5px;
    }
  }
}

#bottom-section {
  display: flex;
  height: 74%;
  ::v-deep #right-bottom-section {
    width: 45%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    position: relative;
    padding-bottom: 20px;
    position: relative;

    // transition: color 1s;
    right: 3em;
    top: 1em;

    // &.gate-review-modal {
    //   z-index: 100000;
    //   color: #fff;
    //   h1 {
    //     color: #fff;
    //   }
    //   h2 {
    //     color: #fff;
    //   }
    // }
  }
  #left-bottom-section {
    width: 55%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    #contenents-bg {
      width: 625px;
      position: relative;
      right: 10px;
      top: 10px;
    }
  }
  #right-bottom-section {
    margin-bottom: 2.5em;
  }
}
// #top {
//   width: 93%;
//   height: 14%;
//   text-align: center;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   padding-top: 1.4%;
//   margin: auto;
//   .bold-headline,
//   .sub-headline p {
//     margin: 0;
//     padding: 0;
//   }
//   .bold-headline {
//     padding-bottom: 0.3em;
//   }
//   .sub-headline {
//     font-weight: bold;
//     height: 22px;
//     width: 100%;
//     position: relative;
//     p {
//       width: 100%;
//       position: absolute;
//       text-align: center;
//     }
//   }
// }
// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline {
  h1 {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
}
::v-deep .small-headline {
  h2 {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
}
</style>

<template>
  <PageBase>
    <div id="build-business-case" class="module-page-container">
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
              v-for="(subActivity, index) in subActivities"
              class="subactivity-icon"
              :class="`icon-${subActivity.id} ${
                subActivitiesDone[index] ? 'subactivity-done' : ''
              }`"
              :key="subActivity.id"
              @click="selectSubActivity(index)"
            >
              <Icon
                v-if="subActivitiesDone[index]"
                class="done-icon"
                iconName="check"
              />
              <img
                :src="
                  require(`@/assets/images/Quality/Product/questions/${subActivity.image}`)
                    .default
                "
              />
            </div>
          </div>
        </div>
        <div id="right-bottom-section">
          <CircleMeterContainer
            :progress="progress"
            :gateReviewTransitionClassAdded="false"
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
          :gateReviewTransitionClassAdded="false"
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
        <div
          class="subactivity-overlay"
          v-if="selectedSubActivity !== -1"
          key="sub-activity-overlay"
        >
          <transition
            :enter-active-class="`${TEnter.FADE_IN}`"
            :leave-active-class="TExit.FADE_OUT"
          >
            <template
              v-for="questionId in subActivities[selectedSubActivity]
                .questionIds"
            >
              <div
                class="question-overlay"
                :key="questionId"
                v-if="currQuestion.id === questionId"
              >
                <MultiChoice
                  :question="currQuestion"
                  @answered="handleQuestionAnswer"
                  v-if="currQuestion.questionType === 'multiple-choice'"
                />
                <MultiSelect
                  :question="currQuestion"
                  @answered="handleQuestionAnswer"
                  v-if="currQuestion.questionType === 'multiple-select'"
                />
                <ToolSelect
                  :question="currQuestion"
                  @answered="handleQuestionAnswer"
                  v-if="currQuestion.questionType === 'area-select'"
                />
              </div>
            </template>
          </transition>
        </div>
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

      <StandardModalWithImage
        ref="ActivityConclusionModal"
        :contents="activityConclusion"
        @onClose="finishActivity"
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
import StandardModalWithImage from "@/components/modals/StandardModalWithImage.vue"
import HeadlineAndResults from "@/components/shared/Product/HeadlineAndResults.vue"
import CircleMeterContainer from "@/components/shared/Product/CircleMeterContainer.vue"
import PopupMessage from "@/components/shared/Product/PopupMessage.vue"
import Badges from "@/components/shared/Product/Badges.vue"

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
    StandardModalWithImage,
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

      selectedQuestion: -1,

      //questionsDone: [false, false, false, false],
      selectedQuestionFeedback: {} as any, //should have a title and text
      businessCaseIntro: this.json.businessCaseIntro,
      businessCaseConclusion: this.json.businessCaseConclusion,
      showBadgePopup: false,
      currBadgeIndex: null as number | null,
      // fakeShowBadgesArr: [true, true, true, true, true],
      subActivities: this.json.subActivities,
      selectedSubActivity: -1,
      subActivityQuestionNum: 0,
      activityConclusion: {} as any,
    }
  },
  async mounted() {
    // console.log("build business case")
    // this.$store.dispatch("initilizeCommercializationQuestionResults", {
    //   area: "quality",
    //   questionArray: [
    //     [null, null, null, null, null],
    //     [null, null, null, null, null, null, null],
    //     [null, null],
    //     [null, null, null, null],
    //   ],
    //   activitesArray: [
    //     [null, null, null, null], // null for each activity
    //     [null, null, null, null],
    //     [null, null],
    //     [null, null, null],
    //   ],
    // })
    await genericAwait(1000)
    ;(this.$refs["businessCaseIntro"] as any).show()
    // this.activityConclusion = this.subActivities[0].conclusion
    // console.log(this.activityConclusion)
    // this.$nextTick(() => {
    //   ;(this.$refs["ActivityConclusionModal"] as any).show()
    // })
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
      await genericAwait(300)
      this.$store.commit("showABadge")
      await genericAwait(1000)
      this.checkIfDone()
    },
    async handleQuestionAnswer(payload: any) {
      // console.log("payload is")
      // console.log(payload)
      const currQuestionId =
        this.subActivities[this.selectedSubActivity].questionIds[
          this.subActivityQuestionNum
        ]

      const questionNum = this.questions.findIndex((question: any) => {
        return question.id === currQuestionId
      })

      const { showBadge } = this.questions[questionNum]

      this.$store.dispatch("setCommercializationQuestionResult", {
        area: "quality",
        id: currQuestionId,
        phaseIndex: this.activityPhase,
        questionNum,
        showBadge,
        result: payload,
      })

      if (
        this.subActivityQuestionNum <
        this.subActivities[this.selectedSubActivity].questionIds.length - 1
      ) {
        this.subActivityQuestionNum++
      } else {
        this.$store.dispatch("setCommercializationSubactivityDone", {
          area: "quality",
          phaseIndex: this.activityPhase,
          subAreaNum: this.selectedSubActivity,
        })

        if (this.subActivities[this.selectedSubActivity].conclusion) {
          this.activityConclusion =
            this.subActivities[this.selectedSubActivity].conclusion
          // console.log("conclusion is")
          // console.log(this.activityConclusion)
          // await genericAwait(1000)
          this.$nextTick(() => {
            ;(this.$refs["ActivityConclusionModal"] as any).show()
          })
        } else {
          this.finishActivity()
        }
      }
    },
    async finishActivity() {
      let formerlySelectedSubActivity = this.selectedSubActivity
      this.selectedSubActivity = -1
      this.subActivityQuestionNum = 0
      //if (this.subActivities[formerlySelectedSubActivity].showBadge) {
      await genericAwait(1000)

      // only show badges if every question in the activity is correct
      // ok .. if EVERYTHING Is correct.. let's show a badge
      let { questionIds } = this.subActivities[formerlySelectedSubActivity]
      let shouldWeShowBadge = false

      let correctResults = this.questionResults[this.activityPhase].filter(
        (result: any) => {
          return result?.correct
        }
      )

      questionIds.forEach((id: number) => {
        if (
          correctResults.find(
            (result: any) => result.id === id && result.showBadge
          )
        ) {
          shouldWeShowBadge = true
        }
      })

      // if (
      //   // correctResults.find((result: any) => {
      //   //   console.log(result)
      //   //   return result.showBadge
      //   // })
      //   // questionIds.find(())
      //   questionIds.every((id: number) => {
      //     return correctResults.find((result: any) => {
      //       return result?.id === id
      //     })
      //   })
      // ) {
      //   shouldWeShowBadge = true
      // } else {
      //   shouldWeShowBadge = false
      // }

      if (shouldWeShowBadge) {
        // eh shoot. Which badge are we showing again
        this.currBadgeIndex = this.showBadgesArr.findIndex(
          (entry: boolean) => !entry
        )

        this.showBadgePopup = true
      } else {
        this.checkIfDone()
      }
      //} else {
      //  this.checkIfDone()
      //}
    },
    async checkIfDone() {
      if (!this.subActivitiesDone.includes(false)) {
        await genericAwait(1000)
        ;(this.$refs["businessCaseConclusion"] as any).show()
      }
    },
    selectSubActivity(index: number) {
      this.selectedSubActivity = index
    },
  },
  computed: {
    currQuestion(): any | null {
      if (this.selectedSubActivity !== -1) {
        const currentQuestionId =
          this.subActivities[this.selectedSubActivity].questionIds[
            this.subActivityQuestionNum
          ]

        const question = this.questions.find((question: any) => {
          return question.id === currentQuestionId
        })

        if (!question) {
          return null
        } else {
          return question
        }
      } else {
        return null
      }
    },
    questionResults(): (boolean | null)[][] {
      return this.$store.getters["getCommercializationQuestionResults"](
        "quality"
      )
    },
    subActivitiesDone(): boolean[] {
      let thisPhaseAreaResults =
        this.$store.getters["getCommercializationAreaResults"]("quality")[
          this.activityPhase
        ]

      return thisPhaseAreaResults.map((result: any) => !!result)
    },
    questionsDone(): boolean[] {
      let thisPhaseResults =
        this.$store.getters["getCommercializationQuestionResults"]("quality")[
          this.activityPhase
        ]

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
::v-deep #build-business-case {
  .top-sub-bar-inner {
    padding-top: 8px;
  }
}
#top {
  text-align: center;
}
.question-overlay,
.subactivity-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: white;
  z-index: 100;
}
.subactivity-icon {
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
  &.subactivity-done {
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
    // laptop
    top: 53px;
    left: 118px;
    img {
      width: 130px;
    }

    .done-icon {
      left: -26px;
      top: 15px;
    }
  }

  &.icon-2 {
    // house building
    top: 28px;
    left: 525px;

    img {
      width: 95px;
    }
    .done-icon {
      left: -27px;
      top: 5px;
    }
  }
  &.icon-3 {
    // text conversatoin
    top: 189px;
    left: 464px;

    img {
      width: 120px;
    }
    .done-icon {
      left: 125px;
      top: 11px;
    }
  }
  &.icon-4 {
    // clipboard
    top: 321px;
    left: 212px;

    img {
      width: 70px;
    }

    .done-icon {
      left: -30px;
      top: -13px;
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

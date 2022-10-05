<template>
  <PageBase>
    <transition
      :enter-active-class="TEnter.FADE_IN"
      :leave-active-class="TExit.FADE_OUT"
    >
      <div
        id="commercialize-product"
        v-if="!resetting"
        class="module-page-container"
      >
        <div id="top">
          <E class="bold-headline" t="h1" :h="json.e_title" />

          <div class="sub-headline">
            <E class="sub-headline" t="p" :h="json.e_subtitle" />
          </div>
        </div>

        <HeadlineAndResults
          :activityPhases="activityPhases"
          :questionResults="questionResults"
          :feedbackModeActivated="feedbackModeActivated"
          :activityPhase="activityPhase"
          @feedbackIconClicked="showRevisitModal"
        />

        <div id="middle">
          <ActivityTeamMembers
            :activityTeamMembers="activityTeamMembers"
            :currentRoundAreas="currentRoundAreas"
            :allowAnyAreaToBeClicked="allowAnyAreaToBeClicked"
            :selectedAreaTracker="selectedAreaTracker"
            :addIWasClickedClass="addIWasClickedClass"
            :speakingEmotion="speakingEmotion"
            :currentActiveAreaInfo="currentActiveAreaInfo"
            :possibleEmotions="possibleEmotions"
            :addWasClickedClassIfJustClicked="addWasClickedClassIfJustClicked"
            :audioDoneContinueButton="audioDoneContinueButton"
            :feedbackModeActivated="feedbackModeActivated"
            @setAudio="setAudio"
          />

          <div id="middle-right">
            <div v-if="!feedbackModeActivated">
              <template v-for="{ area } in allRoundAreas">
                <AudioPlayer
                  v-if="currentActiveAreaInfo.area === area"
                  :key="area"
                  class="the-audio-player"
                  :file="currentActiveAreaInfo.file"
                  :title="currentActiveAreaInfo.e_title"
                  :id="currentActiveAreaInfo.area"
                  :emotionInfo="currentActiveAreaInfo.emotions"
                  @transcriptClicked="showTranscript"
                  @newEmotion="setSpeakingEmotion"
                  ref="AudioPlayer"
                />
              </template>

              <Transcript
                :transcriptShowing="transcriptShowing"
                :currentActiveAreaInfo="currentActiveAreaInfo"
                @hideTranscript="hideTranscript"
              />
            </div>

            <ContinueButtonAndPrompt
              :audioDoneContinueButton="audioDoneContinueButton"
              :feedbackModeActivated="feedbackModeActivated"
              :listenAgainText="listenAgainText"
              @moveOntoQuestions="moveOntoQuestions"
            />
          </div>
        </div>

        <IntroConclusionModal ref="IntroModal" :titleAndText="introModal" />
        <IntroConclusionModal
          ref="ConclusionModal"
          :titleAndText="conclusionModal"
          @onClose="goBackHome"
        />
        <StandardModal
          ref="QuestionFeedbackModal"
          :titleAndText="selectedQuestionFeedback"
          @onClose="hideFeedback"
        />
        <CTPFeedbackModal
          ref="CTPFeedbackModal"
          :feedBack="feedBack"
          :correctTracker="finalResultsForConclusionModal"
          :badges="badges"
          @onClose="goBackHome"
          @tryAgain="startOver"
        />
      </div>
    </transition>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import E from "@/components/editable/E.vue"
import IntroConclusionModal from "@/components/modals/IntroConclusionModal.vue"
import StandardModal from "@/components/modals/StandardModal.vue"
import CTPFeedbackModal from "@/components/modals/CTPFeedbackModal.vue"
import AudioPlayer from "@/components/shared/Product/AudioPlayer.vue"
import HeadlineAndResults from "@/components/shared/Product/HeadlineAndResults.vue"
import ActivityTeamMembers from "@/components/shared/Product/ActivityTeamMembers.vue"
import ContinueButtonAndPrompt from "@/components/shared/Product/ContinueButtonAndPrompt.vue"
import Transcript from "@/components/shared/Product/Transcript.vue"

export default Vue.extend({
  name: "Menu",
  components: {
    PageBase,
    E,
    IntroConclusionModal,
    AudioPlayer,
    StandardModal,
    CTPFeedbackModal,
    HeadlineAndResults,
    ActivityTeamMembers,
    ContinueButtonAndPrompt,
    Transcript,
  },
  data() {
    return {
      introModal: this.json.introModal,
      conclusionModal: this.json.conclusionModal,
      activityPhases: this.json.activityPhases,
      activityTeamMembers: this.json.activityTeamMembers,
      feedBack: this.json.feedBack,
      listenAgainText: this.json.e_listenAgainText,
      badges: this.json.badges,
      // dummyResults: [
      //   true,
      //   false,
      //   true,
      //   true,
      //   true,
      //   false,
      //   true,
      //   true,
      //   true,
      //   false,
      //   true,
      //   true,
      //   false,
      //   true,
      //   true,
      //   true,
      // ],
      phaseAudioRound: -1,
      feedbackModeActivated: false,
      currentRoundAreas: [] as string[],
      currentActiveAreaInfo: {} as any,
      transcriptShowing: false,
      allRoundAreas: [] as any,
      allowAnyAreaToBeClicked: false,
      addIWasClickedClass: [] as string[],
      selectedAreaTracker: [] as string[],
      possibleEmotions: this.json.possibleEmotions,
      conclusionData: {} as any,
      speakingEmotion: "",
      selectedQuestionFeedback: {} as any, //should have a title and text
      finalResultsForConclusionModal: [] as boolean[],
      audioDoneContinueButton: this.json.audioDoneContinueButton,
      TEnter,
      TExit,
      TTimes,
      resetting: false,
      duplicatedAreas: [] as {
        area: string
        currentNumber: number
      }[],
    }
  },
  async mounted() {
    // hmm.. maybe should stick to simple commits
    // anyway.. this only initializes if not initialized before

    if (this.activityPhase === -1) {
      this.$store.dispatch("initilizeCommercializationQuestionResults", {
        area: "quality",
        questionArray: [
          [null, null, null, null, null],
          [null, null, null, null, null, null, null],
          [null, null],
          [null, null, null, null],
        ],
        activitesArray: [
          [null, null, null, null], // null for each activity
          [null, null, null, null],
          [null, null],
          [null, null, null],
        ],
      })
      await genericAwait(1000)
      // ;(this.$refs["CTPFeedbackModal"] as any).show()
      ;(this.$refs["IntroModal"] as any).show()

      this.$store.dispatch("startCommercializationPhase", 0)
      // actually, this is kinda weird. I'm just gonna not show the continue button at all until
      // everything is clicked, every time. There is some logic to it, but in practice, feels like a bug
      this.audioDoneContinueButton.audioDone = false
      this.audioDoneContinueButton.allowRevisit = false
      this.feedbackModeActivated = false
    } else if (this.activityPhase < 3) {
      this.audioDoneContinueButton.audioDone = false
      this.feedbackModeActivated = false
      this.audioDoneContinueButton.allowRevisit = false

      this.$store.dispatch(
        "startCommercializationPhase",
        this.activityPhase + 1
      )
    } else {
      this.audioDoneContinueButton.audioDone = false
      this.feedbackModeActivated = false
      this.audioDoneContinueButton.allowRevisit = false

      this.finalResultsForConclusionModal = this.questionResults
        .flat()
        .map((result) => result && result.correct)
      await genericAwait(1000)
      ;(this.$refs["CTPFeedbackModal"] as any).show()
    }

    // this.$store.dispatch("meta/goToHiddenPage", "Build Business Case")
  },
  methods: {
    async startOver() {
      this.resetting = true
      this.resetMostOfTheStuff()
      this.$store.dispatch("initilizeCommercializationQuestionResults", {
        area: "quality",
        questionArray: [
          [null, null, null, null, null], // null for each question
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
        activitesArray: [
          [null, null, null, null], // null for each activity
          [null, null, null, null],
          [null, null, null, null],
          [null, null, null, null],
        ],
      })

      this.audioDoneContinueButton = {
        audioDone: false,
        text: "Continue",
        allowRevisit: false,
      }
      this.feedbackModeActivated = false

      this.$store.dispatch("startCommercializationPhase", 0)

      await genericAwait(1000)
      this.resetting = false
    },
    // for clicking on the circles or x's
    showRevisitModal(feedback: { title: string; text: string }) {
      this.selectedQuestionFeedback = feedback
      this.$nextTick(() => {
        ;(this.$refs["QuestionFeedbackModal"] as any).show()
      })
    },
    hideFeedback() {
      // close individual question feedback
      console.log("feedback hidden")
    },
    moveOntoQuestions() {
      // ok . First goal.. go to next round
      // next goal.. new pages

      switch (this.activityPhase) {
        case 0:
          this.$store.dispatch("meta/goToHiddenPage", "Build Business Case")
          break
        case 1:
          // ;(this.$refs["ConcludsionFeedbackModal"] as any).show()
          this.$store.dispatch("meta/goToHiddenPage", "Development")
          break
        case 2:
          this.$store.dispatch("meta/goToHiddenPage", "Scale Up")
          break
        case 3:
          this.$store.dispatch("meta/goToHiddenPage", "Launch")
          break
      }
    },
    resetMostOfTheStuff() {
      this.phaseAudioRound = -1

      this.audioDoneContinueButton = {
        audioDone: false,
        text: "Continue",
        allowRevisit: false,
      }

      this.currentRoundAreas = []
      this.currentActiveAreaInfo = {}
      this.selectedAreaTracker = []
      this.addIWasClickedClass = []

      this.allowAnyAreaToBeClicked = false

      this.speakingEmotion = ""
    },
    showTranscript() {
      this.transcriptShowing = true
    },
    hideTranscript() {
      this.transcriptShowing = false
    },
    setSpeakingEmotion(newEmotion: string) {
      this.speakingEmotion = newEmotion
    },
    goBackHome() {
      // essentially, go to the last page of the intro section
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/markSectionComplete", currSection)
      this.$store.dispatch("meta/goHome")
    },
    addWasClickedClassIfJustClicked(area: string) {
      if (
        this.selectedAreaTracker.indexOf(area) !== -1 &&
        this.addIWasClickedClass.indexOf(area) === -1
      ) {
        this.addIWasClickedClass.push(area)
      }
    },

    setAudio(area: string) {
      if (this.currentActiveAreaInfo.area !== area) {
        this.speakingEmotion = ""

        if (!this.allowAnyAreaToBeClicked) {
          this.currentActiveAreaInfo = this.activityPhases[
            this.activityPhase
          ].audioRounds[this.phaseAudioRound].areas.find((roundArea: any) => {
            return roundArea.area === area
          })

          this.addIWasClickedClass.push(area)
        } else {
          // have to be able to click ANY person ..
          this.activityPhases[this.activityPhase].audioRounds[
            this.phaseAudioRound
          ].areas.find((roundArea: any) => roundArea.area === area)

          const allTheStuff = (this.allRoundAreas = this.activityPhases[
            this.activityPhase
          ].audioRounds.reduce((acc: any, round: any) => {
            return [...acc, ...round.areas]
          }, []))

          this.currentActiveAreaInfo = allTheStuff.find(
            (roundArea: any) => roundArea.area === area
          )

          this.addIWasClickedClass.push(area)
        }
      }
    },
    async goToNextRound() {
      if (
        this.phaseAudioRound <
        this.activityPhases[this.activityPhase].audioRounds.length - 1
      ) {
        this.phaseAudioRound++
      } else {
        await genericAwait(1000)

        this.audioDoneContinueButton.audioDone = true
        this.audioDoneContinueButton.allowRevisit = true
        this.allowAnyAreaToBeClicked = true
      }
    },
  },
  watch: {
    async activityPhase() {
      this.phaseAudioRound = 0
    },
    async currentActiveAreaInfo(nv, ov) {
      if (nv && Object.keys(nv).length) {
        if (this.selectedAreaTracker.indexOf(nv) === -1) {
          this.selectedAreaTracker.push(nv.area)
        }

        let roundDone = true
        this.currentRoundAreas.forEach((area) => {
          if (this.selectedAreaTracker.indexOf(area) === -1) {
            roundDone = false
          }
        })

        if (roundDone) {
          this.goToNextRound()
        }
      }
    },

    async phaseAudioRound(nv, ov) {
      // a little hacky code to prevent errors in the case of one step with only one round
      // going to the next round (if I reset it to zero, and hte previous value is zero, this will never fire)
      // so I reset it to -1, and then to 0 here

      if (nv !== -1) {
        // get current audio areas.. Wait a sec or two, if it's not the first round
        if (nv !== 0) {
          await genericAwait(1500)
        }

        this.currentRoundAreas = this.activityPhases[
          this.activityPhase
        ].audioRounds[nv].areas.map((area: any) => area.area)

        // let's try this here

        this.allRoundAreas = this.activityPhases[
          this.activityPhase
        ].audioRounds.reduce((acc: any, round: any) => {
          return [...acc, ...round.areas]
        }, [])
      } else {
        this.phaseAudioRound = 0
      }
    },
  },
  computed: {
    questionResults(): (any | null)[][] {
      return this.$store.getters["getCommercializationQuestionResults"](
        "quality"
      )
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

    activityPhase(): number {
      return this.$store.getters["getCommercializationPhaseIndex"]
    },

    // showBadgesArr(): boolean[] {
    //   return this.$store.getters["getBadgesShowing"]
    // },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#top {
  width: 93%;
  height: 14%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 1.4%;
  margin: auto;
  .bold-headline,
  .sub-headline p {
    margin: 0;
    padding: 0;
  }
  .bold-headline {
    padding-bottom: 0.3em;
  }
  .sub-headline {
    font-weight: bold;
    height: 22px;
    width: 100%;
    position: relative;
    p {
      width: 100%;
      position: absolute;
      text-align: center;
    }
  }
}

#middle {
  width: 100%;
  height: 75%;
  display: flex;

  #middle-right {
    position: relative;

    width: 50%;
    ::v-deep .the-audio-player {
      width: 80%;
      font-family: $roboto;
      margin: auto;
      margin-top: 2em;
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline {
  h1 {
    font-size: 1em; // it's already 1.7 from the outer class, so make sure it stays
    margin: 0;
    padding: 0;
    padding-bottom: 0.3em;
  }
}
::v-deep .sub-headline {
  p {
    font-family: "Noto Sans";
    margin: 0;
    padding: 0;
  }
}
::v-deep .member-container {
  p {
    margin: 0;
    padding: 0;
  }
}
::v-deep .small-headline h2 {
  font-size: 1em;
  margin: 0;
  padding: 0;
}
</style>

<template>
  <PageBase>
    <div id="role-section" class="module-page-container disable-user-select">
      <div
        id="top-section"
        :class="{
          onSecondPage: !showFirstPage,
        }"
      >
        <E t="h2" class="bold-headline" :h="json.e_title" />
        <transition
          :enter-active-class="TEnter.FADE_IN_RIGHT"
          :leave-active-class="TExit.FADE_OUT"
          mode="out-in"
        >
          <E
            t="h2"
            class="sub-headline"
            :h="topSubTitle"
            :key="topSubtitleKey"
          />
        </transition>
      </div>

      <transition
        :enter-active-class="TEnter.FADE_IN"
        :leave-active-class="TExit.FADE_OUT"
        mode="out-in"
      >
        <div id="first-page-wrapper" v-if="showFirstPage" key="first-page">
          <TopRuleIcons
            :activities="activities"
            :selectedActivityIndex="selectedActivityIndex"
            :sectionsDone="sectionsDone"
            @click="setActivityIndex"
          />

          <RoleInfoTable
            :activities="activities"
            :selectedActivityIndex="selectedActivityIndex"
          />
        </div>

        <SecondPage v-if="!showFirstPage" :activities="activities" />
      </transition>

      <transition
        :enter-active-class="TEnter.FADE_IN_UP"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div
          @click="goToNextSection"
          id="continue-container"
          v-if="showContinue"
        >
          <div class="continue-button small-button">
            <strong>Continue</strong>
          </div>
        </div>
      </transition>
    </div>

    <transition
      :enter-active-class="TEnter.FADE_IN_UP"
      :leave-active-class="TExit.FADE_OUT"
    >
      <SecondPageContinueButtons
        v-if="showContinueTwo"
        @finish="finish"
        :buttonText="json.secondPageButtons"
      />
    </transition>

    <IntroConclusionModal ref="IntroModal" :titleAndText="introModal" />

    <IntroConclusionModal
      ref="ConclusionModal"
      :titleAndText="conclusionModal"
      :specialClass="'tasks-conclusion-modal'"
      @onClose="goBackHome"
    />
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit } from "@/types"
import IntroConclusionModal from "@/components/modals/IntroConclusionModal.vue"
import { genericAwait } from "@/lib/randomFunctions"
import E from "@/components/editable/E.vue"
import TopRuleIcons from "@/components/shared/Role/TopRoleIcons.vue"
import RoleInfoTable from "@/components/shared/Role/RoleInfoTable.vue"
import SecondPage from "@/components/shared/Role/SecondPage.vue"
import SecondPageContinueButtons from "@/components/shared/Role/SecondPageContinueButtons.vue"

const ATTN_INTERVAL = 4000

export default Vue.extend({
  name: "QualityRole",
  components: {
    PageBase,
    IntroConclusionModal,
    E,
    TopRuleIcons,
    RoleInfoTable,
    SecondPage,
    SecondPageContinueButtons,
  },
  data() {
    return {
      title: "WhatIsRole",
      instructions: this.json.instructions,
      transitionModal: this.json.transitionModal,
      activities: this.json.activities,
      selectedActivityIndex: -1,
      TEnter,
      TExit,
      showContinue: false,
      sectionsDone: [false, false, false, false],
      introModal: this.json.introModal,
      conclusionModal: this.json.conclusionModal,
      infoModalShowing: false,
      highlightIndex: -1,
      showFirstPage: true,
      showContinueTwo: false,
      topSubTitle: this.json.e_instructions,
      topSubtitleKey: 0,
    }
  },
  async mounted() {
    await genericAwait(1000)
    ;(this.$refs["IntroModal"] as any).show()
  },
  methods: {
    finish() {
      ;(this.$refs["ConclusionModal"] as any).show()
    },
    async goToNextSection() {
      this.showContinue = false
      this.showFirstPage = false
      this.topSubTitle = this.json.e_instructionsTwo
      this.topSubtitleKey = 1
      await genericAwait(2000)
      this.showContinueTwo = true
    },
    highlightTitle(index: number, highlighted: boolean) {
      if (highlighted) {
        this.highlightIndex = index
      } else {
        this.highlightIndex = -1
      }
    },
    goBackHome() {
      // everything unlocked
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/markSectionComplete", currSection)
      this.$store.dispatch("meta/goHome") // goes to the home of the current role
    },
    goToTheConclusionPage() {
      this.$store.dispatch("meta/goToNextSection")
    },
    showContinueButton() {
      this.showContinue = true
    },
    async setActivityIndex(index: number) {
      this.selectedActivityIndex = index
      this.sectionsDone[index] = true

      if (!this.sectionsDone.includes(false)) {
        await genericAwait(1000)
        this.showContinue = true
      }
    },
  },
  watch: {},
  props: ["json"],
})
</script>

<style scoped lang="scss">
#second-page-wrapper {
  width: 98%;
}
#first-page-wrapper {
  width: 100%;
  height: 84%;
}

#continue-container {
  position: absolute;
  bottom: 3%;
  right: 2%;
}

#role-section {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: $color;
  font-family: $font;
  padding-left: 2%;
  padding-right: 2%;
  box-sizing: border-box;

  #top-section {
    width: 100%;
    height: 12%;
    padding-bottom: 5px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-bottom: 1px dotted $darkGray;
    padding-top: 1%;
    flex-shrink: 0; // margin: auto;
    .bold-headline,
    .sub-headline {
      margin: 0;
      padding: 0;
    }
    .sub-headline {
      font-weight: bold;
    }
    .bold-headline {
      padding-bottom: 0.1em;
    }
    &.onSecondPage {
      border-bottom: none;
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep #top-section .bold-headline h2 {
  font-size: 1em;
  padding-bottom: 0.3em;
  margin: 0;
}
::v-deep #top-section .sub-headline h2 {
  font-size: 1em;
  margin-bottom: 0.3em;
  margin-top: 0;
}
</style>

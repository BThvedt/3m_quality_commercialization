<template>
  <PageBase>
    <div id="intro-page" class="module-page-container" :class="background">
      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="`${TExit.FADE_OUT}`"
      >
        <div id="page-overlay">
          <!-- <SpeechBubble
            :pages="pages"
            @onLastPage="showContinueButton"
            @endReached="endReached"
            ref="speechBubble"
          /> -->
          <SpeechBubble
            :pages="pages"
            @endReached="endReached"
            @changeBackground="changeBackground"
            ref="speechBubble"
            @showBack="showBack"
            @hideBack="hideBack"
          />
        </div>
      </transition>

      <transition
        :enter-active-class="TEnter.FADE_IN_UP"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div
          @click="continueClicked"
          id="continue-container"
          v-if="showContinue"
        >
          <div class="continue-button small-button">
            <strong><E :h="json.e_continueButton" :t="'p'" /></strong>
          </div>
        </div>
      </transition>

      <transition
        :enter-active-class="`${TEnter.FADE_IN} `"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div @click="backClicked" id="back-container" v-if="showBackButton">
          <div class="back-button small-button">
            <strong>Back</strong>
          </div>
        </div>
      </transition>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit, TTimes } from "@/types"
import E from "@/components/editable/E.vue"
import SpeechBubble from "@/components/shared/Intro/SpeechBubble.vue"

const forwardTransition = {
  enter: TEnter.SLIDE_IN_RIGHT,
  leave: TExit.SLIDE_OUT_LEFT,
}

const backWardTransition = {
  enter: TEnter.SLIDE_IN_LEFT,
  leave: TExit.SLIDE_OUT_RIGHT,
}

export default Vue.extend({
  name: "IntroductionPage",
  components: { PageBase, SpeechBubble, E },
  data() {
    return {
      TEnter,
      TExit,
      pages: this.json.pages,
      showContinue: false,
      showBackButton: false,
      endOfSpeechBubbleReached: false,
      currentTransitons: forwardTransition,

      background: "team",
    }
  },
  mounted() {
    this.showContinue = true
  },
  methods: {
    showBack() {
      this.showBackButton = true
    },
    hideBack() {
      this.showBackButton = false
    },
    changeBackground(background: string) {
      this.background = background
    },
    // showContinueButton() {
    //   this.showContinue = true
    // },

    // goToNextPage() {
    //   this.$store.dispatch("meta/goForward")
    // },
    endReached() {
      this.endOfSpeechBubbleReached = true
    },
    continueClicked() {
      if (!this.endOfSpeechBubbleReached) {
        ;(this.$refs["speechBubble"] as any).goForward()
      } else {
        let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
        this.$store.dispatch("meta/markSectionComplete", currSection)
        this.$store.dispatch("meta/goHome") // goes to the home of the current role
      }
    },
    backClicked() {
      this.endOfSpeechBubbleReached = false
      ;(this.$refs["speechBubble"] as any).goBackward()
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#intro-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  // background-image: url("../../../assets/images/Quality/Intro/bg-lifestyle_v1.jpg");
  background-size: cover;
  transition: 1s all;
  &.team {
    background-image: url("../../../assets/images/Quality/Intro/bg-precoach-intro.jpg");
  }
  &.happy-coach {
    background-image: url("../../../assets/images/Quality/Intro/bg-coach-intro.jpg");
  }
}
#page-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
}
#continue-container {
  z-index: 0;
  position: absolute;
  right: 2em;
  bottom: 0.7em;
}

#back-container {
  z-index: 0;
  position: absolute;
  left: 29.3em;
  bottom: 0.7em;
}
</style>

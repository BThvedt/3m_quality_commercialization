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
        key="question-text-wrapper-1"
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
          <E t="p" :h="hotspotData.e_clickRevealPrompt" />
        </div>
      </div>
    </transition>
    <!-- End the popups -->

    <ToolScroller
      ref="toolScroller"
      :fileArray="fileArray"
      :currFileArrayIndex="currFileArrayIndex"
      :role="role"
      :hotspots="hotspotData.clickRevealAreas"
      :revealHotSpots="revealHotSpots"
      :alreadySelectedHotSpots="hotSpotsFinished"
      @hotSpotSelected="handleHotSpotSelected"
      :label="label"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"
import ToolScroller from "./ToolScroller.vue"
// import Icon from "@/components/Icon.vue"
import { genericAwait } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "HotSpotClickResponse",
  data() {
    return {
      prompts: this.hotspotData.prompts,
      promptNum: -1,
      startShowingPrompts: false,

      revealHotSpots: false,
      revealPopups: [],
      revealPopupNum: -1,
      hotSpotIndexSelected: -1,
      hotSpotsFinished: [] as boolean[],

      showPopupPrompt: false,

      fileArray: this.hotspotData.images,
      label: this.hotspotData.e_imageLabel,
      currFileArrayIndex: 0,

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
    this.hotSpotsFinished = new Array(
      this.hotspotData.clickRevealAreas.length
    ).fill(false)
  },
  methods: {
    async goToNextPrompt() {
      if (this.promptNum < this.prompts.length - 1) {
        this.promptNum++
        this.currFileArrayIndex = this.prompts[this.promptNum].imageIndex
      } else {
        // in every instance the last prompt goes before a click/reveal
        // so instead of doing anything, I just reveal hotspots
        console.log("gotta handle this part.. if needed")
        if (!this.prompts[this.promptNum].revealHotSpots) {
          // we just go to the eend in this case
          this.startShowingPrompts = false
          await genericAwait(1000)

          this.$emit("moveOn")
        }
      }

      if (this.prompts[this.promptNum].revealHotSpots) {
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

          this.$emit("moveOn")
        } else {
          this.showPopupPrompt = true
        }
      }
    },
  },
  components: { ToolScroller, E },
  props: ["hotspotData", "role"],
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

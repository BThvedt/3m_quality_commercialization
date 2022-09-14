<template>
  <div id="question-wrapper">
    <!-- <E :h="question.e_title" t="h2" class="question-title" /> -->
    <div id="top">
      <E
        :h="question.e_questionText"
        t="h3"
        class="bold-headline question-prompt"
      />

      <div class="sub-headline">
        <E
          :h="question.e_instructions"
          t="p"
          lass="sub-headline question-instructions"
        />
      </div>
    </div>

    <div id="tool-container">
      <div class="image-wrapper">
        <svg name="image-map" v-if="hotspots && hotspots.length">
          <Hotspot
            v-for="(item, index) in hotspots"
            :key="index"
            :points="item.coords"
            @clicked="setClicked"
            :index="index"
            :typeOfShape="item.shape"
            :ref="'hotspot-' + index"
            :hotSpotQuestionAnswered="hotSpotQuestionAnswered"
          />
        </svg>
        <img
          class="badge-image-image"
          :src="
            require(`@/assets/images/Quality/Product/questions/${question.questionImage}`)
              .default
          "
        />
      </div>
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
import StandardModal from "@/components/modals/StandardModal.vue"
import Hotspot from "./Hotspot.vue"
import { genericAwait } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "ToolSelect",
  components: { E, StandardModal, Hotspot },
  data() {
    return {
      answered: false,
      feedback: null as {
        title: string
        text: string
      } | null,
      correct: null as boolean | null,
      hotspots: this.question.areas,
      hotSpotQuestionAnswered: false,
      TEnter,
      TExit,
      TTimes,
    }
  },
  methods: {
    closeQuestion() {
      this.$emit("answered", { correct: this.correct, feedback: this.feedback })
    },
    async setClicked(payload: any) {
      this.hotSpotQuestionAnswered = true

      const correct = this.hotspots[payload.index].correct

      this.correct = correct

      // if (correct) {
      //   this.feedback = this.question.feedback.correct
      // } else {
      //   this.feedback = this.question.feedback.incorrect
      // }

      this.feedback = this.hotspots[payload.index].feedback

      await genericAwait(1000)
      ;(this.$refs["FeedbackModal"] as any).show()
    },
    async select(choice: number) {
      console.log("thing")
    },
  },
  props: ["question"],
})
</script>

<style scoped lang="scss">
::v-deep #top {
  width: 93%;
  min-height: 14%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 1.4%;
  margin: auto;
  .bold-headline,
  .sub-headline {
    max-width: 83%;
  }
  .bold-headline {
    font-size: 1.2em;
  }
  h3,
  p {
    margin: 0;
    padding: 0;
  }
  h3 {
    margin-bottom: 0.25em;
  }
  p {
    margin-bottom: 0.5em;
  }

  .sub-headline {
    font-weight: bold;
    width: 100%;
    position: relative;
  }
}
#question-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
#tool-container {
  width: 100%;
  height: 76%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  .image-wrapper {
    object-fit: contain;
    height: 100%;
    position: relative;
    svg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 10;
    }
    img {
      max-height: 100%;
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

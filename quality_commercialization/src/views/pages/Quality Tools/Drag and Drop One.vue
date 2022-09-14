<template>
  <PageBase>
    <div id="drag-and-drop-section" class="module-page-container">
      <TitleAndSubTitle :title="title" :subTitle="subTitle" />
      <DragAndDropTop
        :dropAreas="dropAreas"
        :areaDroppedOn="areaDroppedOn"
        :dropIsCorrect="dropIsCorrect"
        :clickRevealTracker="clickRevealTracker"
        :interactionPhase="interactionPhase"
        :grayOutAreasExceptThisOne="grayOutAreasExceptThisOne"
        :areaBeingRead="areaBeingRead"
        :areaDraggedOver="areaDraggedOver"
        :draggables="draggables"
        @drop="onDrop"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @click="handleClick"
      />
      <DragAndDropBottom
        :dropIsCorrect="dropIsCorrect"
        :draggables="draggables"
        :interactionPhase="interactionPhase"
        :draggableIndex="draggableIndex"
        :iconIdBeingDragged="iconIdBeingDragged"
        :clickRevealIndex="clickRevealIndex"
        :areaBeingRead="areaBeingRead"
        :incorrectText="incorrectText"
        :unShuffledDraggables="unShuffledDraggables"
        @dragstart="setDragging"
        @dragend="stopDragging"
        @prevClicked="prevClicked"
        @nextClicked="nextClicked"
        @tryAgain="tryAgain"
      />

      <transition
        :enter-active-class="TEnter.FADE_IN_UP"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div @click="finish" id="continue-container" v-if="showContinue">
          <div class="continue-button small-button">
            <strong>Continue</strong>
          </div>
        </div>
      </transition>

      <IntroConclusionModal
        ref="IntroModal"
        :titleAndText="introModal"
        @onClose="startLesson"
      />
      <IntroConclusionModal
        ref="ConclusionModal"
        :titleAndText="conclusionModal"
        @onClose="goBackHome"
      />
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import TitleAndSubTitle from "@/components/TitleAndSubtitle.vue"
import IntroConclusionModal from "@/components/modals/IntroConclusionModal.vue"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import DragAndDropTop from "@/components/shared/Tools/DragAndDropTop.vue"
import DragAndDropBottom from "@/components/shared/Tools/DragAndDropBottom.vue"

const shuffle = (array: any[]) => {
  for (var x = 0; x < array.length; x++) {
    const randIndex = Math.floor(Math.random() * array.length)
    const randItem = array[randIndex]
    const thisItem = array[x]

    array[x] = randItem
    array[randIndex] = thisItem
  }

  return array
}

export default Vue.extend({
  name: "DragAndDrop",
  data() {
    return {
      introModal: this.json.introModal,
      conclusionModal: this.json.conclusionModal,
      incorrectText: this.json.incorrectText,
      title: this.json.e_title,
      subTitle: this.json.e_subTitle,
      dropAreas: this.json.toolDropAreas as any[],
      draggables: shuffle([...this.json.toolDraggables]),
      unShuffledDraggables: this.json.toolDraggables,
      iconIdBeingDragged: null as number | null,
      areaDraggedOver: null as number | null,
      dropIsCorrect: null as boolean | null,
      areaDroppedOn: null as number | null,
      draggableIndex: -1,
      interactionPhase: "drag-and-drop",
      TTimes,
      TEnter,
      TExit,
      grayOutAreasExceptThisOne: null as number | null,
      areaBeingRead: null as number | null,
      clickRevealTracker: [] as (boolean | null)[],
      clickRevealIndex: 0,
      showContinue: false,
    }
  },
  async mounted() {
    let dropAreaCopy = structuredClone(this.dropAreas)

    console.log("TOOL DrAGGGABLES ARE")
    console.log(this.json.toolDraggables)

    dropAreaCopy.forEach((area: any) => {
      area.droppedItemId = null
    })

    this.dropAreas = dropAreaCopy

    this.clickRevealTracker = new Array(this.draggables.length).fill(null)

    await genericAwait(1000)
    ;(this.$refs["IntroModal"] as any).show()
  },
  methods: {
    async startLesson() {
      // await genericAwait(1000)
      this.draggableIndex = 0
    },
    goBackHome() {
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/markSectionComplete", currSection)
      this.$store.dispatch("meta/goHome") // goes to the home of the current role
    },
    finish() {
      ;(this.$refs["ConclusionModal"] as any).show()
    },
    prevClicked() {
      if (this.clickRevealIndex > 0) {
        this.clickRevealIndex--
      }
    },
    nextClicked() {
      if (
        this.clickRevealIndex <
        this.unShuffledDraggables[this.areaBeingRead!].e_clickRevealScreens
          .length -
          1
      ) {
        this.clickRevealIndex++

        if (
          this.clickRevealIndex ===
          this.unShuffledDraggables[this.areaBeingRead!].e_clickRevealScreens
            .length -
            1
        ) {
          this.grayOutAreasExceptThisOne = null

          if (this.clickRevealTracker.every((entry) => entry)) {
            this.showContinue = true
          }
        }
      }
    },
    handleClick(index: number) {
      if (
        this.interactionPhase === "click-reveal" &&
        this.grayOutAreasExceptThisOne === null
      ) {
        this.clickRevealIndex = 0
        this.areaBeingRead = this.dropAreas[index].accepts - 1
        console.log("AREA BEING READ IS")
        console.log(this.areaBeingRead)
        console.log(this.unShuffledDraggables)
        this.grayOutAreasExceptThisOne = index
        this.clickRevealTracker.splice(index, 1, true)
      }
    },
    onDrop(payload: { $event: any; index: number; accepts: number }) {
      let { $event, index, accepts } = payload

      console.log({ $event, index, accepts })

      this.areaDraggedOver = null

      this.areaDroppedOn = index
      this.dropAreas[index].droppedItemId = $event.data

      if ($event.data === accepts) {
        this.dropIsCorrect = true
        if (this.draggableIndex < this.draggables.length - 1) {
          this.draggableIndex++
        } else {
          this.subTitle = this.json.e_subTitle_2
          this.interactionPhase = "click-reveal"
        }
      } else {
        this.dropIsCorrect = false
        this.iconIdBeingDragged = null
      }
    },
    async tryAgain() {
      console.log("TRYING AGAIN")
      this.dropIsCorrect = null
      await genericAwait(1200)
      const index = this.areaDroppedOn as number
      this.areaDroppedOn = null
      this.dropAreas[index].droppedItemId = null
    },
    handleDragEnter(index: number) {
      this.areaDraggedOver = index
    },
    handleDragLeave() {
      this.areaDraggedOver = null
    },
    setDragging(data: number) {
      setTimeout(() => {
        this.iconIdBeingDragged = data
      }, 40)
    },
    stopDragging() {
      setTimeout(() => {
        this.iconIdBeingDragged = null
      }, 500) // oof
    },
  },
  components: {
    PageBase,
    TitleAndSubTitle,
    IntroConclusionModal,
    DragAndDropTop,
    DragAndDropBottom,
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#continue-container {
  position: absolute;
  right: 2em;
  bottom: 0.8em;
}
</style>

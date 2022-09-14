<template>
  <div id="tool-wrapper">
    <div id="tool-wrapper-inner">
      <perfect-scrollbar :suppressScrollX="true">
        <div id="img-container">
          <transition
            :enter-active-class="`${TEnter.FADE_IN} ${
              transitionTimes ? transitionTimes : ''
            }`"
            :leave-active-class="`${TExit.FADE_OUT} ${
              transitionTimes ? transitionTimes : ''
            }`"
            mode="out-in"
          >
            <div id="img-and-hotspots" :key="fileArray[currFileArrayIndex]">
              <svg
                name="image-map"
                v-if="
                  hotspots &&
                  hotspots.length &&
                  !hideHotSpots &&
                  revealTheHotSpots
                "
              >
                <Hotspot
                  v-for="(item, index) in hotspots"
                  :key="index"
                  :points="item.coords"
                  @clicked="setClicked"
                  :index="index"
                  :typeOfShape="item.shape"
                  :ref="'hotspot-' + index"
                  :hotSpotResetCounter="hotSpotResetCounter"
                  :hotSpotQuestionAnswered="hotSpotQuestionAnswered"
                  :alreadySelected="
                    alreadySelectedHotSpots && alreadySelectedHotSpots[index]
                  "
                />
              </svg>
              <img
                id="the-tool"
                :src="
                  require(`@/assets/images/${role}/Tools/ToolImgs/${fileArray[currFileArrayIndex]}`)
                    .default
                "
              />
            </div>
          </transition>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit } from "@/types"
import { PerfectScrollbar } from "vue2-perfect-scrollbar"
import Hotspot from "./Hotspot.vue"

export default Vue.extend({
  name: "ToolScroller",

  data() {
    return {
      TEnter,
      TExit,
      hotSpotResetCounter: 0,
      hotSpotQuestionAnswered: false,
      hideHotSpots: false,
      revealTheHotSpots:
        typeof this.revealHotSpots === "undefined" ? true : this.revealHotSpots,
      toolFiles: [],
    }
  },
  // async mounted() {
  //   console.log("mounted")
  //   console.log(this.revealHotSpots)
  // },

  methods: {
    resetHotSpots() {
      this.hotSpotQuestionAnswered = false
      this.hotSpotResetCounter++
    },
    setClicked(payload: any) {
      this.hotSpotQuestionAnswered = true
      const correct = this.hotspots[payload.index].correct
      const e_popups = this.hotspots[payload.index].e_popups
      this.$emit("hotSpotSelected", {
        index: payload.index,
        correct,
        e_popups,
      })
      if (correct) {
        this.hideHotSpots = true
      }
    },
  },

  watch: {
    revealHotSpots(nv, ov) {
      this.revealTheHotSpots = nv
    },
  },

  props: [
    "fileArray",
    "currFileArrayIndex",
    "role",
    "hotspots",
    "transitionTimes",
    "revealHotSpots",
    "alreadySelectedHotSpots",
  ],
  components: { PerfectScrollbar, Hotspot },
})
</script>

<style lang="scss">
#the-tool {
  max-width: 100%;
}
#tool-wrapper-inner {
  height: 508px;
  overflow: hidden;
}
.ps__rail-x,
.ps__rail-y {
  opacity: 0.6 !important;
}
.ps {
  height: 508px;
  padding-right: 3%;
  box-sizing: border-box;
  .ps__rail-x {
    display: none;
  }
}
#tool-wrapper {
  position: absolute;
  width: 55%;
  height: 100%;
  right: 3%;
  box-sizing: border-box;
  padding: 1em;
  outline: 1px solid $lightGray;
  box-shadow: $box-shadow;

  #img-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 652px;
    margin-right: 3%;
    #img-and-hotspots {
      max-width: 100%;
      position: relative;
      svg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 10;
      }
    }
  }
}
</style>

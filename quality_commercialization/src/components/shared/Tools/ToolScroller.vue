<template>
  <div id="tool-wrapper">
    <div id="tool-wrapper-inner">
      <E class="small-headline" t="h2" :h="label" />

      <perfect-scrollbar :suppressScrollX="true">
        <transition
          :enter-active-class="`${TEnter.FADE_IN} ${
            transitionTimes ? transitionTimes : ''
          }`"
          :leave-active-class="`${TExit.FADE_OUT} ${
            transitionTimes ? transitionTimes : ''
          }`"
          mode="out-in"
        >
          <div id="img-and-hotspots-wrapper">
            <div id="img-and-hotspots" :key="fileArray[currFileArrayIndex]">
              <template v-for="(item, index) in hotspots">
                <font-awesome-icon
                  v-if="
                    alreadySelectedHotSpots &&
                    alreadySelectedHotSpots[index] &&
                    revealTheHotSpots
                  "
                  class="menu-icon check"
                  :class="{ hidden: hotSpotQuestionAnswered }"
                  icon="check"
                  :key="index"
                  :style="{
                    top: getTop(item.coords),
                    left: getLeft(item.coords),
                    position: 'absolute',
                    zIndex: 100,
                  }"
                />
              </template>
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
          </div>
        </transition>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit } from "@/types"
import { PerfectScrollbar } from "vue2-perfect-scrollbar"
import Hotspot from "./Hotspot.vue"
import E from "@/components/editable/E.vue"

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
    getTop(coords: string) {
      let y = parseInt(coords.split(",")[1])

      return `${y + 10}px`
    },
    getLeft(coords: string) {
      let x = parseInt(coords.split(",")[0])

      return `${x + 10}px`
    },
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
    "label",
  ],
  components: { PerfectScrollbar, Hotspot, E },
})
</script>

<style lang="scss" scoped>
// .menu-icon.check {
//   color: $phaseGreen;
//   font-size: 24px;
//   &.hidden {
//     display: none;
//   }
// }
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
::v-deep .ps {
  height: 508px;
  padding-right: 3%;
  box-sizing: border-box;
  .ps__rail-x {
    display: none;
  }
  .ps__rail-y {
    opacity: 0.6 !important;
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

  ::v-deep #tool-wrapper-inner {
    .small-headline {
      margin-top: 0;
      text-align: center;
    }
    #img-and-hotspots-wrapper {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 652px;
      margin-right: 3%;
      position: relative;
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
        .menu-icon.check {
          color: $phaseGreen;
          font-size: 24px;
          width: 24px;
          height: 24px;
          &.hidden {
            display: none;
          }
        }
      }
    }
  }
}
</style>

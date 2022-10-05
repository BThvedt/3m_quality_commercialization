<template>
  <div id="tool-view-wrapper" key="tool-view-page">
    <img
      id="top-image"
      :src="require('@/assets/images/shared/gradient-bar.png').default"
    />

    <TitleAndSubTitle :title="title" :subTitle="subTitle" />

    <div id="tool-text">
      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="`${TExit.FADE_OUT}`"
        mode="out-in"
      >
        <template v-for="(image, i) in images">
          <div class="text-container" v-if="currentImage === i" :key="image.id">
            <E t="p" :h="image.e_text" />
          </div>
        </template>
      </transition>
    </div>

    <div class="tool-view-inner">
      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="`${TExit.FADE_OUT}`"
        mode="out-in"
      >
        <template v-for="(image, i) in images">
          <div
            class="scrollbar-container"
            v-if="currentImage === i"
            :key="image.id"
          >
            <PerfectScrollbar>
              <div class="scrollable-div">
                <img
                  id="the-tool"
                  :src="
                    require(`@/assets/images/${role}/Tools/FullToolDisplayImages/${image.image}`)
                      .default
                  "
                />
              </div>
            </PerfectScrollbar>
          </div>
        </template>
      </transition>
    </div>

    <div id="tabs-container">
      <div
        class="tab"
        v-for="(image, i) in images"
        :key="image.id"
        @click="setImage(i)"
        :class="{ active: currentImage === i }"
      >
        <E t="p" :h="image.e_tab" />
      </div>
    </div>

    <div id="continue-container">
      <button class="continue-button small-button" @click="close">Close</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { PerfectScrollbar } from "vue2-perfect-scrollbar"
import TitleAndSubTitle from "@/components/TitleAndSubtitle.vue"
import { TEnter, TExit } from "@/types"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "ToolsDisplay",
  components: {
    PerfectScrollbar,
    TitleAndSubTitle,
    E,
  },
  data() {
    return {
      currentImage: 0,
      amountScrolled: 0,
      TEnter,
      TExit,
    }
  },

  methods: {
    setImage(index: number) {
      this.currentImage = index
    },
    close() {
      this.$emit("close")
    },
  },
  props: ["title", "subTitle", "images", "role"],
})
</script>

<style scoped lang="scss">
::v-deep #tool-text {
  box-sizing: border-box;
  width: 94%;
  margin: 1em auto;
  height: 66px;
  p {
    font-family: "Noto Sans";
    font-size: 1em;
    margin: 0;
    padding: 0;
  }
}
::v-deep .ps__rail-x,
.ps__rail-y {
  opacity: 0.6 !important;
}
.ps {
  width: 100%;
}
.scrollable-div {
  //min-width: 2000px; // see if it works without this
  // background: green;
  height: 350px;
  img {
    // width: 2000px;
    max-height: 350px;
    padding-bottom: 20px;
  }
}
#tabs-container {
  box-sizing: border-box;
  width: 94%;
  margin: 1em auto;
  display: flex;
  .tab {
    color: #003ce6;
    &:hover {
      color: #1e1e96;
      text-decoration: underline;
    }
    &.active {
      color: $green;
      cursor: default;
      &:hover {
        color: $green;
        text-decoration: none;
      }
      p {
        cursor: default;
      }
    }
    p {
      cursor: pointer;
      font-family: "Noto Sans";
      font-weight: bold;
      font-size: 1em;
      margin: 0em 1em;
      &:first-of-type {
        margin-left: 0;
      }
    }
  }
}
.scrollbar-container {
  // width: 100%;
  overflow: hidden;
}
#tool-view-wrapper {
  #top-image {
    position: absolute;
    top: 0;
    left: 0;
  }
  margin-top: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 2000;
  background: white;
  .tool-view-inner {
    box-sizing: border-box;
    // padding-bottom: 0%;
    // min-height: 469px;
    // justify-content: flex-start;
    // background: green;
    display: flex;
    justify-content: center;
    width: 94%;
    margin: auto;
  }
}
::v-deep .top-text {
  font-size: 1em;
  font-family: $noto;
  color: $darkGray;
  // text-align: center;
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .small-headline {
  h2 {
    font-size: 1em;
    margin: 0;
    padding: 0;
  }
}
</style>

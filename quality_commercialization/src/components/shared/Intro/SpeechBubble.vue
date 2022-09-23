<template>
  <div id="speech-bubble">
    <div class="speech-bubble-inner">
      <div class="the-page">
        <div class="page-title">
          <transition
            :enter-active-class="TEnter.FADE_IN"
            :leave-active-class="TExit.FADE_OUT"
          >
            <E :h="topTitle" class="bold-headline" t="h1" :key="topTitleKey" />
          </transition>
        </div>
        <transition
          :enter-active-class="currentTransitons.enter"
          :leave-active-class="currentTransitons.leave"
        >
          <template v-for="(page, i) in pages">
            <div class="page-body" v-if="i === pageNum" :key="i">
              <div class="page-inner">
                <div
                  class="page-item"
                  v-for="(item, i) in page.content"
                  :key="i"
                >
                  <div v-if="item.type === 'text'">
                    <E :h="item.e_subTitle" class="small-headline" t="h2" />
                    <E
                      :h="item.e_subTitle_two"
                      v-if="item.e_subTitle_two"
                      class="small-headline"
                      t="h2"
                    />
                    <E :h="item.e_text" t="div" />
                  </div>
                  <div v-if="item.type === 'image'">
                    <img
                      class="page-image"
                      :src="
                        require(`@/assets/images/Quality/Intro/${item.file}`)
                          .default
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </transition>
      </div>
    </div>
    <transition
      :enter-active-class="TEnter.SLIDE_IN_RIGHT"
      :leave-active-class="TExit.FADE_OUT"
    >
      <div v-if="showCarat" id="carat"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit } from "@/types"
import E from "@/components/editable/E.vue"

const forwardTransition = {
  enter: TEnter.SLIDE_IN_RIGHT,
  leave: TExit.SLIDE_OUT_LEFT,
}

const backWardTransition = {
  enter: TEnter.SLIDE_IN_LEFT,
  leave: TExit.SLIDE_OUT_RIGHT,
}

export default Vue.extend({
  name: "SpeechBubble",
  components: { E },
  data() {
    return {
      TEnter,
      TExit,
      lastPage: this.pages.length - 1,
      pageNum: 0,
      currentTransitons: forwardTransition,
      topTitle: "",
      topTitleKey: null as number | null,
      showCarat: false,
      background: "team",
    }
  },
  mounted() {
    this.checkIfOnLastPage()

    this.topTitleKey = 0
    this.topTitle = this.pages[0].e_title
  },
  methods: {
    goForward() {
      this.currentTransitons = forwardTransition

      if (this.pageNum < this.pages.length - 1) {
        this.pageNum++
      }

      // console.log("GOING FORWARD")
      // console.log(this.pages[this.pageNum])
      if (this.pages[this.pageNum].content[0].background) {
        if (
          this.pages[this.pageNum].content[0].background !== this.background
        ) {
          this.background = this.pages[this.pageNum].content[0].background
          this.$emit(
            "changeBackground",
            this.pages[this.pageNum].content[0].background
          )
        }

        if (this.pages[this.pageNum].content[0].background === "happy-coach") {
          this.showCarat = true
        } else {
          this.showCarat = false
        }
      }

      this.$emit("showBack")

      this.checkIfOnLastPage()
    },
    goBackward() {
      this.currentTransitons = backWardTransition

      if (this.pageNum > 0) {
        this.pageNum--

        if (this.pages[this.pageNum].content[0].background) {
          if (
            this.pages[this.pageNum].content[0].background !== this.background
          ) {
            this.background = this.pages[this.pageNum].content[0].background
            this.$emit(
              "changeBackground",
              this.pages[this.pageNum].content[0].background
            )
          }

          if (
            this.pages[this.pageNum].content[0].background === "happy-coach"
          ) {
            this.showCarat = true
          } else {
            this.showCarat = false
          }
        }

        if (this.pageNum === 0) {
          this.$emit("hideBack")
        }
      } else {
        this.$emit("hideBack")
      }
    },
    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },
    checkIfOnLastPage() {
      // changed so that the continue button moves you forward. Has to emit event if on last page though
      if (this.pageNum === this.lastPage) {
        this.$emit("endReached")
      }
    },
  },
  watch: {
    pageNum(nv: number) {
      if (this.pages[nv]) {
        if (this.topTitle !== this.pages[nv].e_title) {
          this.topTitleKey = nv

          this.topTitle = this.pages[nv].e_title
        }
      }
    },
  },

  props: ["pages"],
})
</script>

<style scoped lang="scss">
.control-arrow {
  width: 50px;
  height: 50px;
  color: white;
  background: #ddd;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8em;
  transition: $very-fast-transition;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: $box-shadow;
  &:hover {
    background: #aaa;
  }
  &.disabled {
    svg {
      opacity: 0.5;
    }
    cursor: default;
    &:hover {
      background: #ddd;
    }
  }
}
#arrow-container {
  width: 100%;
  position: absolute;
  bottom: -25px;
  right: 0em;
  display: flex;
  justify-content: center;

  #left-arrow {
    position: relative;
    right: 30px;
    svg {
      position: relative;
      right: 2px;
    }
  }
  #right-arrow {
    svg {
      position: relative;
      left: 2px;
    }
  }
}
#speech-bubble {
  position: absolute;
  width: 61%;
  height: 82%;
  background: white;
  right: 2.5%;
  top: 9%;
  box-sizing: border-box;
  padding: 1.5em;
  box-shadow: $box-shadow;

  .speech-bubble-inner {
    position: absolute;
    width: calc(100% - 3.8em);
    height: calc(100% - 2.6em);
    top: 1.3em;
    left: 1.9em;
    overflow: hidden;
    .the-page {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      .page-title {
        border-bottom: 1px dotted;
        height: 50px;
        .bold-headline {
          position: absolute;
        }
        h1 {
          margin-top: 0;
        }
      }
      ::v-deep .page-item {
        // ul {
        //   padding-left: 0em;
        // }
        h2 {
          margin: 0.7em 0em;
        }
        padding-right: 2em;
        font-size: 0.93em;
        p {
          margin: 0.5em 0em;
        }
        ul {
          margin-top: 0.5em;
        }
        p,
        ul li {
          font-family: $noto;
          line-height: 19px;
          color: $darkGray;
        }
        ul li {
          margin-top: 0.4em;
          margin-bottom: 0.4em;
          p {
            margin: 0;
            padding: 0;
          }
        }
        .page-image {
          width: 100%;
          margin-top: 1em;
        }
      }
      .page-body {
        width: 100%;
        height: 86%;
        display: flex;
        position: absolute;
        .page-inner {
          width: 100%;
          // padding-left: 1em;
          // padding-right: 1em;
          box-sizing: border-box;
        }
      }
    }
  }
  // &::after {
  //   content: "";
  //   border-top: 20px solid transparent;
  //   border-bottom: 20px solid transparent;
  //   border-right: 30px solid white;
  //   display: block;
  //   position: absolute;
  //   left: -29px;
  //   top: 140px;
  // }
  #carat {
    content: "";
    border-top: 30px solid transparent;
    border-bottom: 30px solid transparent;
    border-right: 50px solid white;
    display: block;
    position: absolute;
    left: -39px;
    top: 209px;
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline h1 {
  font-size: 1em;
  margin-top: 0;
}
::v-deep .small-headline h2 {
  font-size: 1em;
}
</style>

<template>
  <div id="score-container">
    <div>
      <h2 class="small-headline">Score:</h2>
    </div>
    <div class="right-and-wrong">
      <div
        v-for="(result, i) in correctTracker"
        :key="i"
        class="right-and-wrong-container"
      >
        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
        >
          <span class="check-or-x" v-if="correctTracker[i] === null" key="1">
          </span>
          <span
            class="check-or-x"
            v-else-if="correctTracker[i] === true"
            key="2"
          >
            <img
              :src="
                require(`@/assets/images/Quality/Challenge/correct.png`).default
              "
            />
          </span>
          <span
            class="check-or-x"
            v-else-if="correctTracker[i] === false"
            key="3"
            :class="{
              highlight: tryAgainIndexes[tryAgainQuestionNum] === i,
            }"
          >
            <img
              :src="
                require(`@/assets/images/Quality/Challenge/incorrect.png`)
                  .default
              "
            />
          </span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import { TEnter, TExit, TTimes, TAttnSeek } from "@/types"
export default Vue.extend({
  name: "ScoreTracker",
  data() {
    return {
      TEnter,
      TExit,
    }
  },
  methods: {},
  props: ["correctTracker", "tryAgainIndexes", "tryAgainQuestionNum"],
})
</script>

<style lang="scss" scoped>
#score-container {
  display: flex;
  z-index: 100;
  position: absolute;
  right: 45px;
  text-transform: uppercase;
  .right-and-wrong {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 0.5em;
    position: relative;

    .right-and-wrong-container {
      position: relative;
      width: 15px;
      height: 15px;
      margin-right: 3px;
      .check-or-x {
        width: 15px;
        height: 15px;
        background: #d2d2d2;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        display: block;
        border-radius: 100%;
        img {
          width: 15px;
        }
        &.highlight {
          box-shadow: 0px 0px 3px 3px #f8c231;
        }
      }
    }
  }
}
</style>

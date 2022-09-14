<template>
  <div id="top-sub-bar">
    <div class="top-sub-bar-inner">
      <div
        class="icon-and-title"
        v-for="(phase, phaseIndex) in activityPhases"
        :key="phase.id"
        :class="`${activityPhase === phaseIndex ? 'active' : ''} ${
          activityPhase >= phaseIndex ? 'unlocked' : 'locked'
        } icon-${phaseIndex}`"
      >
        <transition
          :enter-active-class="TEnter.FADE_IN"
          :leave-active-class="TEnter.FADE_OUT"
        >
          <Icon
            class="sub-bar-icon"
            :iconName="phase.icon"
            v-if="activityPhase >= phaseIndex"
            :key="'unlocked'"
          />
          <Icon class="sub-bar-icon" :iconName="'lock'" :key="'lock'" v-else />
        </transition>

        <div class="headline-and-results-container">
          <E class="small-headline" :h="phase.e_title" t="h2" />
          <div class="right-and-wrong">
            <div v-for="(result, i) in questionResults[phaseIndex]" :key="i">
              <span class="check-or-x" v-if="result === null" key="1"> </span>
              <span
                class="check-or-x"
                v-else-if="result.correct"
                @click="showRevisitModal(result.feedback)"
              >
                <img
                  :src="
                    require(`@/assets/images/Quality/Product/feedback-correct.png`)
                      .default
                  "
                />
              </span>
              <span
                class="check-or-x"
                v-else
                @click="showRevisitModal(result.feedback)"
              >
                <img
                  :src="
                    require(`@/assets/images/Quality/Product/feedback-incorrect.png`)
                      .default
                  "
                />
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="!feedbackModeActivated"
          class="bottom-border"
          :class="{
            preActive: activityPhase < phaseIndex,
            active: activityPhase === phaseIndex,
            postActive: activityPhase > phaseIndex,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Icon from "@/components/Icon.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"

export default Vue.extend({
  name: "HeadlineAndResults",
  data() {
    return {
      TEnter,
      TExit,
    }
  },
  methods: {
    showRevisitModal(feedback: { e_title: string; e_text: string }) {
      this.$emit("feedbackIconClicked", feedback)
    },
  },
  props: [
    "activityPhases",

    "questionResults",
    "feedbackModeActivated",
    "activityPhase",
  ],
  components: { E, Icon },
})
</script>

<style scoped lang="scss">
#top-sub-bar {
  position: relative;
  width: 103%;
  right: 1.5%;
  box-shadow: inset $box-shadow, inset 0px -3px 5px rgba(0, 0, 0, 0.15);
  padding-top: 0.8em;
  .top-sub-bar-inner {
    display: flex;
    justify-content: center;

    width: 100%;
    ::v-deep .icon-and-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 65px;
      padding: 0px 20px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;

      &.locked {
        .sub-bar-icon {
          width: 31px;
          position: relative;
          bottom: 11px;
        }
      }

      &.unlocked {
        &.icon-0 {
          .sub-bar-icon {
            width: 37px;
            position: relative;
            bottom: 11px;
          }
        }
      }

      &.unlocked {
        &.icon-1 {
          .sub-bar-icon {
            width: 42px;
            position: relative;
            bottom: 11px;
          }
        }
      }

      &.unlocked {
        &.icon-2 {
          .sub-bar-icon {
            width: 45px;
            position: relative;
            bottom: 14px;
          }
        }
      }

      &.unlocked {
        &.icon-3 {
          .sub-bar-icon {
            width: 48px;
            position: relative;
            bottom: 13px;
          }
        }
      }

      &.unlocked {
        &.icon-4 {
          .sub-bar-icon {
            width: 44px;
            position: relative;
            bottom: 2px;
          }
        }
      }

      .headline-and-results-container {
        position: relative;
        bottom: 0.5em;
        .small-headline {
          color: $mediumGray;
          margin: 0;
          margin-bottom: 0.2em;
        }
        .right-and-wrong {
          // background: $lightGray;
          display: flex;
          // position: absolute;
          // bottom: 3px;
          // z-index: 100;
          .check-or-x {
            width: 15px;
            height: 15px;
            background: #d2d2d2;

            // position: absolute;
            // top: 0;
            // left: 0;
            // z-index: 100;
            display: block;
            border-radius: 100%;
            margin-right: 3px;
            img {
              cursor: pointer;
              width: 15px;
              cursor: pointer;
              // margin-right: 3px;
              position: relative;
              z-index: 100;
              transition: $very-fast-transition;
            }
          }
        }
      }

      .sub-bar-icon {
        width: 35px;
        height: 35px;
        margin-right: 15px;
        fill: $mediumGray;
      }
      .bottom-border {
        position: absolute;
        bottom: 0;
        left: -100%;
        width: 100%;
        height: 5px;
        background: transparent;
        transition: $normal-transition;
        &.preActive,
        &.active,
        &.postActive {
          background: $phaseOrange;
        }
        &.preActive {
          left: -100%;
        }
        &.active {
          left: 0%;
        }
        &.postActive {
          left: 100%;
        }
      }

      &.active {
        .small-headline {
          color: black;
        }
        .sub-bar-icon {
          fill: black;
        }
      }

      &.icon-0 {
        .bottom-border {
          &.preActive,
          &.active,
          &.postActive {
            background: $phaseOrange;
          }
        }
      }
      &.icon-1 {
        .bottom-border {
          &.preActive,
          &.active,
          &.postActive {
            background: $phaseRed;
          }
        }
      }
      &.icon-2 {
        .bottom-border {
          &.preActive,
          &.active,
          &.postActive {
            background: $phasePurple;
          }
        }
      }
      &.icon-3 {
        .bottom-border {
          &.preActive,
          &.active,
          &.postActive {
            background: $phaseGreen;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div id="middle-left">
    <div
      v-for="(member, i) in activityTeamMembers"
      :key="member.id"
      class="member-image"
      :class="`member-${i} ${
        !(
          currentRoundAreas.indexOf(member.area) !== -1 ||
          (allowAnyAreaToBeClicked &&
            selectedAreaTracker.indexOf(member.area) !== -1)
        ) || feedbackModeActivated
          ? 'container-inactive'
          : 'container-active'
      } ${
        currentActiveAreaInfo.area === member.area &&
        !audioDoneContinueButton.allowRevisit
          ? 'speaking'
          : 'not-speaking'
      }`"
    >
      <div
        class="member-container active"
        @click="setAudio(member.area)"
        @mouseleave="addWasClickedClassIfJustClicked(member.area)"
        :class="{
          'i-was-clicked-this-round':
            addIWasClickedClass.indexOf(member.area) !== -1,
        }"
      >
        <div class="img-and-icon">
          <template v-for="emotion in possibleEmotions">
            <img
              :src="
                require(`@/assets/images/Quality/Product/${member.emotions[speakingEmotion]}`)
                  .default
              "
              v-if="
                currentActiveAreaInfo.area === member.area &&
                emotion === speakingEmotion
              "
              :key="emotion"
            />
          </template>
          <img
            :src="
              require(`@/assets/images/Quality/Product/${member.image}`).default
            "
            v-if="
              currentActiveAreaInfo.area !== member.area || !speakingEmotion
            "
            :key="'default'"
          />

          <transition
            :enter-active-class="`${TEnter.FADE_IN} ${TTimes.FAST}`"
            :leave-active-class="`${TExit.FADE_OUT} ${TTimes.FAST}`"
          >
            <Icon
              :iconName="'audio'"
              class="audio-icon"
              v-if="currentActiveAreaInfo.area === member.area"
            />
          </transition>
        </div>
        <E class="small-headline" :h="member.e_title" t="p" />
      </div>

      <transition
        :enter-active-class="`${TEnter.FADE_IN} ${TTimes.SLOW}`"
        :leave-active-class="`${TExit.FADE_OUT} ${TTimes.SLOW}`"
      >
        <div
          class="member-container inactive"
          v-if="
            !(
              currentRoundAreas.indexOf(member.area) !== -1 ||
              (allowAnyAreaToBeClicked &&
                selectedAreaTracker.indexOf(member.area) !== -1)
            ) || feedbackModeActivated
          "
          :class="{
            speaking:
              currentActiveAreaInfo.area === member.area &&
              !audioDoneContinueButton.allowRevisit,
          }"
        >
          <div class="img-and-icon">
            <div class="img-and-icon-img">
              <template v-for="emotion in possibleEmotions">
                <img
                  :src="
                    require(`@/assets/images/Quality/Product/${member.emotions[speakingEmotion]}`)
                      .default
                  "
                  v-if="
                    currentActiveAreaInfo.area === member.area &&
                    emotion === speakingEmotion
                  "
                  :key="emotion"
                />
              </template>
              <img
                :src="
                  require(`@/assets/images/Quality/Product/${member.image}`)
                    .default
                "
                v-if="
                  currentActiveAreaInfo.area !== member.area || !speakingEmotion
                "
                :key="'default'"
              />
            </div>
          </div>
          <p class="small-headline" v-html="member.title" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Icon from "@/components/Icon.vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"

export default Vue.extend({
  name: "ActivityTeamMembers",
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
    }
  },
  methods: {
    setAudio(area: string) {
      this.$emit("setAudio", area)
    },
  },
  props: [
    "activityTeamMembers",
    "currentRoundAreas",
    "allowAnyAreaToBeClicked",
    "selectedAreaTracker",
    "addIWasClickedClass",
    "speakingEmotion",
    "currentActiveAreaInfo",
    "possibleEmotions",
    "addWasClickedClassIfJustClicked",
    "audioDoneContinueButton",
    "feedbackModeActivated",
  ],
  components: { E, Icon },
})
</script>

<style scoped lang="scss">
.member-image {
  transition: 1s all;
}
.container-active {
  transform: scale(1.05);
  img {
    border-radius: 100%;
    box-shadow: 0px 0px 7px 3px $phaseYellow;
  }
  .i-was-clicked-this-round {
    img {
      border-radius: 100%;
      box-shadow: 0px 0px 0px 2px $lightGray !important;
    }
  }
}
#middle-left {
  width: 52.5%;
  background-image: url("../../../assets/images/Quality/Product/networked-globe.png");
  background-repeat: no-repeat;
  background-position: center 50px;
  background-size: 50%;
  position: relative;
  bottom: 3%;
  left: 0.5%;
  .img-and-icon {
    position: relative;
    ::v-deep .audio-icon {
      width: 20px;
      height: 20px;
      position: absolute;
      display: inline-block;
      padding: 5px;
      outline: 1px solid $darkGray;
      box-shadow: $box-shadow;
      background: white;
      right: -10px;
      border-radius: 100%;
      display: none;
      svg {
        fill: $green;
      }
    }
  }
  .member-image {
    position: absolute;

    .member-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 165px;

      .small-headline {
        color: $mediumGray;
        font-family: $roboto;
        margin: 0;
        padding: 0;
        margin-top: 0;
        text-align: center;
      }
      img {
        width: 100px;
        height: 100px;
        transition: 3s all;
        filter: brightness(1.3) contrast(65%) grayscale(100%);
      }

      &.active {
        cursor: pointer;
        transition: $very-fast-transition;

        img {
          filter: none;
          transition: $very-fast-transition;
        }

        &:hover {
          .small-headline {
            color: black;
          }
        }
        .audio-icon {
          display: inline-block;
          z-index: 10;
        }
        &.iJustGotClicked {
          img {
            filter: brightness(1.3) contrast(65%) grayscale(100%);
          }
          .small-headline {
            color: $mediumGray;
          }
          ::v-deep .audio-icon {
            outline: 1px solid $lightGray;
            svg {
              fill: $mediumGray;
            }
          }
        }
        &.iWasClickedThisRound {
          img {
            filter: brightness(1.3) contrast(65%) grayscale(100%);
          }
          .small-headline {
            color: $mediumGray;
          }
          ::v-deep .audio-icon {
            outline: 1px solid $lightGray;
            transition: $very-fast-transition;
            svg {
              fill: $mediumGray;
            }
          }
          &:hover {
            img {
              filter: none;
            }
            ::v-deep .audio-icon {
              outline: 1px solid $darkGray;
              svg {
                fill: $green;
              }
            }
          }
        }
      }
    }

    &.member-0 {
      right: 570px;
      top: 47px;
    }
    &.member-1 {
      left: 48px;
      top: 198px;
    }
    &.member-2 {
      left: 160px;
      top: 316px;
    }
    &.member-3 {
      right: 322px;
      top: 311px;
    }
    &.member-4 {
      right: 218px;
      top: 200px;
    }
    &.member-5 {
      right: 245px;
      top: 53px;
    }
  }
}
</style>

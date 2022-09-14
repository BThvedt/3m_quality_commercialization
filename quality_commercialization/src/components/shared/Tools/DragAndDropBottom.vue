<template>
  <div id="bottom-part">
    <transition
      :enter-active-class="`${TEnter.FADE_IN}`"
      :leave-active-class="`${TExit.FADE_OUT}`"
      mode="out-in"
    >
      <div v-if="interactionPhase === 'drag-and-drop'" key="interaction-phase">
        <transition
          :enter-active-class="`${TEnter.FADE_IN_UP}`"
          :leave-active-class="`${TExit.FADE_OUT_DOWN}`"
          mode="out-in"
        >
          <div
            id="tool-and-text-outer-wrapper"
            v-if="dropIsCorrect !== false"
            key="a"
          >
            <transition
              :enter-active-class="`${TEnter.FADE_IN_RIGHT}`"
              :leave-active-class="`${TExit.FADE_OUT_LEFT}`"
              mode="out-in"
            >
              <template v-for="(draggable, i) in draggables">
                <div
                  class="tool-icon-and-text"
                  v-if="i === draggableIndex"
                  :key="i"
                >
                  <div class="left-half">
                    <Drag
                      class="drag-item-class"
                      go-back
                      :data="draggable.id"
                      @dragstart="setDragging(draggable.id)"
                      @dragend="stopDragging()"
                      :class="{
                        hidden: iconIdBeingDragged === draggable.id,
                      }"
                    >
                      <div class="drag-item-inner">
                        <img
                          :src="
                            require(`@/assets/images/Quality/Tools/DragDrop/${draggable.icon}`)
                              .default
                          "
                        />
                      </div>
                    </Drag>
                  </div>
                  <E class="right-half" :h="draggable.e_text" t="p" />
                </div>
              </template>
            </transition>
          </div>
          <div v-if="dropIsCorrect === false" key="b">
            <div id="incorrect-try-again">
              <E :h="incorrectText.e_prompt" t="h1" />
              <div @click="tryAgain" class="bAndWButton med-button">
                <E :h="incorrectText.e_tryAgain" t="p" />
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div
        v-else-if="interactionPhase === 'click-reveal'"
        key="click-reveal"
        id="click-reveal-phase-tool-and-text-outer-wrapper"
      >
        <div id="yet-another-wrapper-div">
          <transition
            :enter-active-class="`${TEnter.FADE_IN}`"
            :leave-active-class="`${TExit.FADE_OUT}`"
            mode="out-in"
          >
            <template v-for="(draggable, i) in unShuffledDraggables">
              <div
                class="click-reveal-tool-icon-and-text"
                :class="`draggable-${i}`"
                :key="i"
                v-if="i === areaBeingRead"
              >
                <div class="left-half">
                  <div class="drag-item-class">
                    <div class="drag-item-inner">
                      <img
                        :src="
                          require(`@/assets/images/Quality/Tools/DragDrop/${draggable.icon}`)
                            .default
                        "
                      />
                    </div>
                  </div>
                </div>
                <div class="right-half">
                  <transition
                    :enter-active-class="`${TEnter.FADE_IN} ${TTimes.FAST}`"
                    :leave-active-class="`${TExit.FADE_OUT} ${TTimes.FAST}`"
                    mode="out-in"
                  >
                    <template
                      v-for="(screen, i) in draggable.e_clickRevealScreens"
                    >
                      <E
                        :h="draggable.e_clickRevealScreens[clickRevealIndex]"
                        v-if="clickRevealIndex === i"
                        :key="i"
                        t="p"
                      />
                    </template>
                  </transition>
                </div>
              </div>
            </template>
          </transition>
        </div>
        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
        >
          <div
            id="arrows-container"
            v-if="areaBeingRead !== null"
            key="arrow-container"
          >
            <div
              class="click-reveal-prev-icon"
              :class="{ inactive: clickRevealIndex === 0 }"
              @click="prevClicked"
            >
              <font-awesome-icon :icon="'arrow-left'" />
            </div>
            <div class="slide-info">
              <p>
                {{ clickRevealIndex + 1 }} of
                {{
                  unShuffledDraggables[areaBeingRead].e_clickRevealScreens
                    .length
                }}
              </p>
            </div>
            <div
              class="click-reveal-next-icon"
              @click="nextClicked"
              :class="{
                inactive:
                  clickRevealIndex ===
                  unShuffledDraggables[areaBeingRead].e_clickRevealScreens
                    .length -
                    1,
              }"
            >
              <font-awesome-icon :icon="'arrow-right'" />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit, TTimes } from "@/types"
import { Drag } from "vue-easy-dnd"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "DragAndDropBottom",
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
    }
  },

  methods: {
    nextClicked() {
      this.$emit("nextClicked")
    },
    prevClicked() {
      this.$emit("prevClicked")
    },
    setDragging(id: number) {
      this.$emit("dragstart", id)
    },
    stopDragging() {
      this.$emit("dragend")
    },
    tryAgain() {
      this.$emit("tryAgain")
    },
  },
  components: { Drag, E },
  props: [
    "dropIsCorrect",
    "draggables",
    "interactionPhase",
    "draggableIndex",
    "iconIdBeingDragged",
    "clickRevealIndex",
    "areaBeingRead",
    "incorrectText",
    "unShuffledDraggables",
  ],
})
</script>

<style lang="scss">
#arrows-container {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: $very-fast-transition;
  bottom: 1em;
  .slide-info {
    font-family: $noto;
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      margin: 0;
      padding: 0;
      min-width: 70px;
      text-align: center;
      color: $darkGray;
    }
  }
  .click-reveal-prev-icon,
  .click-reveal-next-icon {
    font-size: 2em;
    color: $blue;
    cursor: pointer;
    margin: 0em 0.5em;
    &:hover {
      color: $darkBlue;
    }
    &.inactive {
      cursor: default;
      color: $lightGray;
      opacity: 0.5;
      &:hover {
        color: $lightGray;
      }
    }
  }
}

#bottom-part {
  height: 50%;
  position: relative;
  width: 93%;
  margin: auto;
  #click-reveal-phase-tool-and-text-outer-wrapper,
  #tool-and-text-outer-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #yet-another-wrapper-div {
    position: relative;
    width: 80%;
    height: 90%;
    display: flex;
    bottom: 0%;
    .click-reveal-tool-icon-and-text {
      display: flex;
      position: absolute;
      height: 85%;
      overflow: hidden;
      font-size: 0.95em;
      ul li p {
        margin: 0;
        padding: 0;
      }
    }
  }
  .tool-icon-and-text {
    position: relative;
    width: 80%;
    height: 60%;
    display: flex;
    bottom: 5%;
  }
  .left-half {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    .drag-item-class {
      display: block;
      color: white;
      background: white;
      font-size: 2em;
      border-radius: 100%;
      border: 1px solid #a8a8a8;
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
      width: 162px;
      height: 162px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.hidden {
        opacity: 0;
      }
      img {
        height: 75px;
        display: block;
        position: relative;
        bottom: 3%;
        left: 3%;
      }
    }
  }
  .right-half {
    width: 70%;
    color: #595959;
    text-align: left;
    align-items: center;
    display: flex;
    p {
      font-family: "Noto Sans";
      font-size: 1em;
      position: relative;
      bottom: 4%;
    }
  }
  p.right-half {
    font-family: "Noto Sans";
    font-size: 1em;
    position: relative;
    bottom: 4%;
  }
  #incorrect-try-again {
    text-align: center;
    color: #a8a8a8;
    padding-top: 1em;
    h1 {
      font-size: 1em;
      font-style: normal;
      font-family: "Noto Sans";
    }
    .med-button {
      margin: auto;
    }
  }
}
</style>

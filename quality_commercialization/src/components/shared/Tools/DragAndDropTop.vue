<template>
  <div id="top-part">
    <template v-for="(dropArea, i) in dropAreas">
      <Drop
        class="tool-drop-area"
        :class="{
          draggedOver:
            dropArea.droppedItemId !== dropArea.accepts &&
            areaDraggedOver === i,
          correct: dropArea.droppedItemId === dropArea.accepts,
          clickRevealPhase: interactionPhase === 'click-reveal',
          active: areaBeingRead === i,
          grayedOut:
            grayOutAreasExceptThisOne !== null &&
            grayOutAreasExceptThisOne !== i,
          selected: clickRevealTracker[i],
        }"
        :key="i"
        @drop="onDrop($event, i, dropArea.accepts)"
        @dragenter="handleDragEnter(i)"
        @dragleave="handleDragLeave(i)"
        @click="handleClick(i)"
      >
        <div
          class="drop-circle"
          :class="{ draggedOver: areaDraggedOver === i }"
          v-if="dropArea.droppedItemId === null && !clickRevealTracker[i]"
        />
        <img
          v-if="
            typeof dropArea.droppedItemId === 'number' && !clickRevealTracker[i]
          "
          :src="
            require(`@/assets/images/Quality/Tools/DragDrop/${getImage(
              dropArea.droppedItemId
            )}`).default
          "
        />
        <div class="selected-icon" v-if="clickRevealTracker[i]">
          <Icon :iconName="'check'" />
        </div>
        <div
          class="wrong-answer"
          v-if="areaDroppedOn === i && dropIsCorrect !== true"
        >
          <font-awesome-icon icon="times" />
        </div>
        <E class="drag-item-title" :h="dropArea.e_title" t="h2" />
      </Drop>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit, TTimes } from "@/types"
import { Drag, Drop } from "vue-easy-dnd"
import { genericAwait } from "@/lib/randomFunctions"
import Icon from "@/components/Icon.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "DragAndDropTop",
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
    }
  },

  methods: {
    handleDragEnter(index: number) {
      this.$emit("dragenter", index)
    },
    handleDragLeave() {
      this.$emit("dragleave")
    },
    onDrop($event: any, index: number, accepts: number) {
      this.$emit("drop", { $event, index, accepts })
    },
    handleClick(index: number) {
      this.$emit("click", index)
    },
    getImage(droppedItemId: number): string | null {
      let draggable = this.draggables.find((draggable: any) => {
        return draggable.id === droppedItemId
      })

      if (draggable) {
        return draggable.icon
      } else {
        return null
      }
    },
  },
  components: { Drop, Icon, E },
  props: [
    "draggables",
    "dropAreas",
    "areaDroppedOn",
    "dropIsCorrect",
    "clickRevealTracker",
    "interactionPhase",
    "grayOutAreasExceptThisOne",
    "areaBeingRead",
    "areaDraggedOver",
  ],
})
</script>

<style scoped lang="scss">
#top-part {
  height: 33%;
  position: relative;
  border-bottom: 1px dotted gray;
  width: 93%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .tool-drop-area {
    height: 160px;
    width: 225px;
    border-radius: 15px;
    background: white;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
    border: 1px solid #d2d2d2;
    text-align: center;
    margin-left: 30px;
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: $very-fast-transition;
    position: relative;
    &.correct {
      // border-color: #00b432;
      box-shadow: 0px 3px 5px rgba(0, 180, 50, 0.15);
      .drag-item-title {
        color: #00b432;
      }
    }
    &.draggedOver {
      border-color: black;
      .drag-item-title {
        color: black;
      }
      .drop-circle {
        border-color: black;
      }
    }

    &.clickRevealPhase {
      box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      &:hover {
        border-color: black;
        .drag-item-title {
          color: black;
        }
      }
      .drag-item-title {
        color: #a8a8a8;
      }
      &.grayedOut {
        &:hover {
          border-color: #d2d2d2;
          .drag-item-title {
            color: #a8a8a8;
          }
        }
      }
    }
    &.active {
      border-color: black;
      .drag-item-title {
        color: black;
      }
    }
    .wrong-answer {
      color: red;
      position: absolute;
      font-size: 5em;
    }
    img {
      height: 75px;
    }
    ::v-deep .selected-icon {
      svg {
        width: 75px;
        fill: green;
      }
    }
    &.grayedOut {
      background: #e8e8e8;
      filter: contrast(0.9);
      opacity: 0.4;
      cursor: default;
    }
    .drop-circle {
      width: 75px;
      height: 75px;
      border: 3px dashed #d2d2d2;
      border-radius: 100%;
      transition: $very-fast-transition;
    }
    .drag-item-title {
      font-family: "Roboto Condensed";
      font-weight: bold;
      text-transform: uppercase;
      color: #a8a8a8;
      font-size: $text-size-small;
      margin: 0;
      padding: 0;
      margin-top: 1em;
      transition: $very-fast-transition;
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .drag-item-title h2 {
  font-size: 1em;
  margin: 0;
  padding: 0;
}
// ::v-deep #top-section .sub-headline h2 {
//   font-size: 1em;
//   margin-bottom: 0.3em;
//   margin-top: 0;
// }
</style>

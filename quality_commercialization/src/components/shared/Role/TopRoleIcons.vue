<template>
  <div id="icon-section">
    <div
      v-for="(activity, index) in activities"
      :key="activity.id"
      class="title-and-icon-container"
    >
      <div class="headline-wrapper" :class="activity.id">
        <Icon
          :iconName="'check'"
          class="visited-icon"
          v-if="sectionsDone[index]"
        />
        <!-- <h3
          class="small-headline"
          :class="{ active: selectedActivityIndex === index }"
          v-html="activity.e_title"
        /> -->
        <E class="small-headline" t="h3" :h="activity.e_title" />
      </div>

      <div
        class="icon-wrapper"
        @click="setActivityIndex(index)"
        :class="{ active: selectedActivityIndex === index }"
      >
        <Icon :iconName="activity.icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Icon from "@/components/Icon.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "TopRuleIcons",
  data() {
    return {}
  },
  methods: {
    setActivityIndex(index: number) {
      this.$emit("click", index)
    },
  },
  props: ["activities", "selectedActivityIndex", "sectionsDone"],
  components: { Icon, E },
})
</script>

<style scoped lang="scss">
#icon-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 26.5%;
  padding-bottom: 10px;
  padding-left: 3%;
  padding-right: 3%;
  border-bottom: 1px dotted $color;
  box-sizing: border-box;
  padding-top: 0em;

  .title-and-icon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 18%;

    ::v-deep .headline-wrapper {
      position: relative;
      .visited-icon {
        position: absolute;
        left: 0;
        &.icon-container {
          fill: $phaseGreen;
          width: 20px;
          position: absolute;
          top: 0px;
          left: -23px;
          svg {
            fill: $phaseGreen;
            width: 20px;
          }
        }
      }

      .small-headline {
        color: $mediumGray;
        font-size: 0.95em;
        height: 1.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0;
        margin-bottom: 0.3em;
        span {
          display: block;
        }
        &.active {
          color: black;
        }
      }
    }
  }
  ::v-deep .icon-wrapper {
    width: 90px;
    height: 90px;
    border-radius: 100%;
    border: 1px solid $lightGray;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: $very-fast-transition;

    svg {
      transition: $very-fast-transition;
      fill: $lightGray;
      width: 50px;
      height: 50px;
    }
    &.active {
      svg {
        fill: black;
      }
      border: 1px solid $darkGray;
      box-shadow: $box-shadow;
      &:hover {
        background: white;
        cursor: default;
      }
    }
    &:hover {
      box-shadow: $box-shadow;
      border-color: black;
      svg {
        fill: black;
      }
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .small-headline {
  h3 {
    font-size: 1em;
  }
}
</style>

<template>
  <div id="right-part">
    <div
      class="menu-item"
      :class="` ${mousDownIndex === i ? 'shrink' : ''}`"
      v-for="(section, i) in sectionData"
      :key="section.section"
      @click="navigate(section.section)"
      @mousedown="() => (mousDownIndex = i)"
      @mouseup="() => (mousDownIndex = -1)"
      @mouseleave="() => (mousDownIndex = -1)"
    >
      <img
        :src="require(`@/assets/images/Quality/Menu/${section.image}`).default"
      />

      <!-- the "first" section is the speech bubble.. now each area has 7 sections -->
      <!-- so the completed section is actiually this plus one -->
      <E class="small-headline section-headline" :h="section.e_title" t="h2" />
      <div v-if="lockedSections[i]" class="icon-thing">
        <Icon :iconName="'lock'" />
      </div>
      <div v-else-if="completedSections[i]" class="icon-thing check">
        <Icon :iconName="'check'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Icon from "@/components/Icon.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "LessonMenu",
  components: { Icon, E },
  data() {
    return {
      mousDownIndex: -1,
    }
  },
  methods: {
    navigate(index: number) {
      this.$store.dispatch("meta/goToPage", {
        sectionIndex: index,
        pageIndex: 0,
      })
    },
  },
  computed: {
    completedSections(): boolean[] {
      // hmm.. this will have to be rewritten if I do more of these..
      // I like the data in 'suspendedData'..  but you should be able to get this from "getAllSections"
      return this.$store.getters["meta/getCompletedSectionsOfRole"]("quality")
    },
    lockedSections(): boolean[] {
      // hmm.. this will have to be rewritten if I do more of these..
      // I like the data in 'suspendedData'..  but you should be able to get this from "getAllSections"
      return this.$store.getters["meta/getLockedSectionsOfRole"]("quality")
    },
  },
  props: ["sectionData"],
})
</script>

<style scoped lang="scss">
#right-part {
  padding-top: 3em;
  width: 45%;
  position: relative;
  left: 0.3em;
  .menu-item {
    min-width: 48%;

    height: 180px;
    margin-bottom: 15px;
    object-fit: contain;
    position: relative;
    color: white;
    cursor: pointer;
    font-family: $roboto;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      filter: brightness(1.1) contrast(30%) grayscale(100%);
      transition: $very-fast-transition;
    }
    &.highlit {
      img {
        filter: brightness(0.6);
      }
    }
    &.locked {
      &:hover {
        cursor: default;
        img {
          filter: brightness(1.1) contrast(30%) grayscale(100%);
        }
      }
    }
    &:hover {
      img {
        filter: brightness(0.6);
      }
    }
    ::v-deep h2,
    .icon-thing {
      position: relative;
      color: white;
      fill: white;
      font-family: $roboto;
      font-size: 1.1em;
      position: relative;
      top: 5px;
      .icon-container {
        position: relative;
        top: 10px;
      }
    }
    display: flex;
    align-items: center;
    flex-direction: column;
    transition: $very-fast-transition;
    float: left;
    margin-left: 2%;
    &.shrink {
      transform: scale(0.95);
    }
    .section-headline {
      text-align: center;
      text-shadow: $box-shadow;
      text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.35);
    }
  }
  .icon-thing {
    width: 40px;
    height: 40px;
    &.check {
      width: 50px;
      height: 50px;
    }
  }
}
</style>

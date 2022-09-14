<template>
  <div id="top-right-buttons">
    <div class="button-container">
      <transition
        :enter-active-class="TEnter.FADE_IN"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div class="button-outline" v-show="showHomeButton" @click="goHome">
          <font-awesome-icon icon="home" />
        </div>
      </transition>
    </div>

    <div class="button-container">
      <div
        class="button-outline"
        :class="{ active: menuOpen }"
        @click="menuToggle"
      >
        <Icon iconName="search-bars" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit } from "@/types"
import Icon from "@/components/Icon.vue"

export default Vue.extend({
  name: "TopRightButtons",
  data() {
    return {
      TEnter,
      TExit,
    }
  },
  methods: {
    menuToggle() {
      // this.open = !this.open
      this.menuOpen
        ? this.$store.dispatch("meta/closeMenu")
        : this.$store.dispatch("meta/openMenu")
    },
    goHome() {
      // this.$store.dispatch("meta/goToPage", { sectionIndex: 0, pageIndex: 0 })
      this.$store.dispatch("meta/goHome")
    },
  },
  computed: {
    menuOpen() {
      return this.$store.getters["meta/getMenuStatus"].open
    },
    showHomeButton() {
      let { currSection, currPage } =
        this.$store.getters["meta/getSectionAndPageIndex"]
      // return currSection === 0 && currPage === 0
      if (currSection === 0) {
        return false
      }
      if (currSection - (1 % 6) === 0) {
        return false
      }
      return true
    },
  },
  components: { Icon },
})
</script>

<style scoped lang="scss">
#top-right-buttons {
  position: absolute;
  display: flex;
  justify-content: space-between;
  top: 20px;
  right: 2em;
  width: 90px;
  color: $lightGray;
  z-index: 998;
  .button-container {
    width: 38px;
    height: 28px;
    .button-outline {
      width: 100%;
      height: 100%;
      border: 1px solid $lightGray;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25em;
      // box-shadow: $box-shadow;
      background: white;
      border-radius: 5px;
      cursor: pointer;
      transition: $very-fast-transition;
      &.active,
      &:hover {
        border: 1px solid $lightOrange;
        color: white;
        background: $lightOrange;
        box-shadow: $light-orange-box-shadow;
        ::v-deep .icon-container {
          svg {
            fill: white;
          }
        }
      }
      ::v-deep .icon-container {
        svg {
          width: 23px;
          height: 25px;
          fill: $mediumGray;
          position: relative;
          top: 2px;
        }
      }
    }
  }
}
</style>

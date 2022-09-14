<template>
  <div id="nav-menu" @mouseleave="hideIfUp" :class="{ up: hideMenu }">
    <div id="menu-bar">
      <E :h="menuJson.e_headerText" t="h2" />
      <div id="nav-right-side">
        <E
          :h="menuJson.e_glossaryText"
          t="h2"
          id="glossary-link"
          class="module-link"
          @click="showGlossary"
        />
        <h2 id="menu-toggle" @click="menuToggle">
          <font-awesome-icon v-if="!open" icon="bars" />
          <font-awesome-icon v-if="open" icon="times" />
        </h2>
      </div>
    </div>
    <div class="sections-wrapper" :class="{ up: hideMenu && !open }">
      <transition
        :enter-active-class="menuOpenClass"
        :leave-active-class="menuCloseClass"
      >
        <div id="sections" v-if="open">
          <div
            class="menu-item"
            :class="{ currentSection: currentSectionIndex === index }"
            v-for="(section, index) in sections"
            :key="section.id"
            @click="handleClick(index)"
          >
            <div class="menu-section-icon">
              <div v-if="!lockedSections[index] && !completedSections[index]">
                {{ " " }}
              </div>
              <div v-else-if="lockedSections[index]">
                <font-awesome-icon class="menu-icon lock" icon="lock" />
              </div>
              <div v-else-if="completedSections[index]">
                <font-awesome-icon class="menu-icon check" icon="check" />
              </div>
            </div>
            <h2>{{ section.name }}</h2>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { TEnter, TExit, TTimes } from "@/types"
import E from "@/components/editable/E.vue"
import Vue from "vue"

export default Vue.extend({
  name: "Menu",
  data() {
    return {
      menuOpenClass: `${TEnter.SLIDE_IN_DONW} ${TTimes.MEDIUM}`,
      menuCloseClass: `${TExit.SLIDE_OUT_UP} ${TTimes.MEDIUM}`,
    }
  },
  methods: {
    menuToggle() {
      // alert("asfd")
      console.log("clicked")
      this.open
        ? this.$store.dispatch("meta/closeMenu")
        : this.$store.dispatch("meta/openMenu")
    },
    hideIfUp() {
      if (this.hideMenu) {
        this.$store.dispatch("meta/closeMenu")
      }
    },
    handleClick(sectionIndex: number) {
      if (sectionIndex !== this.currentSectionIndex) {
        this.$store.dispatch("meta/goToPage", { sectionIndex, pageIndex: 0 })
      }
    },
    showGlossary() {
      // alert("eh")
      this.$emit("showGlossary")
    },
  },
  computed: {
    // a computed getter
    sections() {
      return this.$store.getters["meta/getAllSections"]
    },
    hideMenu() {
      return this.$store.getters["meta/getMenuStatus"].hidden
    },
    open() {
      return this.$store.getters["meta/getMenuStatus"].open
    },
    completedSections(): boolean[] {
      return this.$store.getters["meta/getSuspendedData"].completed
    },
    lockedSections(): boolean[] {
      return this.$store.getters["meta/getSuspendedData"].locked
    },
    currentSectionIndex(): number {
      let { currSection: currSectionIndex } =
        this.$store.getters["meta/getSectionAndPageIndex"]

      return currSectionIndex
    },
    menuJson(): string | undefined {
      const extraJson = this.$store.getters["meta/getExtraJson"]("extra")

      return extraJson ? extraJson : undefined
    },
  },
  components: { E },
})
</script>

<style lang="scss">
#nav-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: 600ms all;
  &.up {
    top: -45px;
    &:hover {
      top: 0px;
      cursor: pointer;
    }
  }
}
#menu-bar {
  height: 55px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  position: absolute;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  z-index: 10;
  border-radius: 0 0 11px 11px;
  transition: 600ms all;
  border: 1px solid #aaa;
  box-shadow: $box-shadow;

  #nav-right-side {
    display: flex;
    width: 15%;
    justify-content: space-between;
  }

  #menu-toggle {
    cursor: pointer;
  }
}

#sections {
  background: white;
  flex-direction: column;
  max-width: 350px;
  min-width: 350px;
  position: absolute;
  right: 30px;
  top: 50px;
  z-index: 5;
  padding-top: 10px;
  border-radius: 0 0 11px 11px;
  border: 1px solid #aaa;
  box-shadow: $box-shadow;
  .menu-item {
    user-select: none;
    padding-left: 10px;
    cursor: pointer;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    .menu-section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 25px;
      font-size: 1.1em;
      .menu-icon.lock {
        position: relative;
        bottom: 0px;
      }
      .menu-icon.check {
        position: relative;
        font-size: 1.2em;
        bottom: -1px;
        right: 1px;
      }
    }
    &:last-of-type {
      margin-bottom: 8px;
    }
    h2 {
      margin: 0;
      padding: 0;
    }
    &:hover {
      background: #ccc;
    }
    &.currentSection {
      cursor: default;
      background: #ccc;
    }
  }
}
.sections-wrapper {
  position: relative;
  transition: 600ms all;
  bottom: 0px;
  &.up {
    bottom: 40px;
  }
}
</style>

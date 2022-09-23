<template>
  <PageBase>
    <div id="starting-menu-page" class="page-container">
      <div class="page-container-inner">
        <div class="left-and-right-parts">
          <div id="left-part">
            <img
              id="logo-img"
              :src="require('@/assets/images/shared/3M_188x100.png').default"
            />
            <E class="bold-headline" :h="json.e_title" t="h2" />
            <E class="top-part-info" :h="json.e_html" t="div" />

            <div>
              <E class="sub-headline" :h="json.e_subTitle" t="h2" />
            </div>
            <BackToRoleMenuButton :buttonText="json.e_backToRoleMenu" />
          </div>

          <LessonMenu :sectionData="sectionData" />
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import LessonMenu from "@/components/shared/Intro/LessonMenu.vue"
import BackToRoleMenuButton from "@/components/shared/Intro/BackToRoleMenuButton.vue"
import E from "@/components/editable/E.vue"
// import Icon from "@/components/Icon.vue"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, LessonMenu, BackToRoleMenuButton, E },
  data() {
    return {
      sectionData: this.json.sectionData,
      mousDownIndex: -1,
    }
  },
  mounted() {
    this.$store.dispatch("meta/setLastLocation", {
      sectionId: "QngESQ64",
      pageId: "eZtl0QCN",
    })
    this.$store.dispatch("meta/setRole", "quality")

    // if not complete, let's marke this section complete
    let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
    this.$store.dispatch("meta/markSectionComplete", currSection)
    // this.$store.dispatch("meta/goHome") // goes to the home of the current role
  },
  methods: {
    // goBackToRole() {
    //   this.$store.commit("meta/setRole", "")
    //   this.$store.dispatch("meta/goBackToRole")
    // },
    // navigate(index: number) {
    //   this.$store.dispatch("meta/goToPage", {
    //     sectionIndex: index,
    //     pageIndex: 0,
    //   })
    // },
  },
  computed: {
    completedSections(): boolean[] {
      // hmm.. this will have to be rewritten if I do more of these..
      // I like the data in 'suspendedData'..  but you should be able to get this from "getAllSections"
      console.log(
        this.$store.getters["meta/getCompletedSectionsOfRole"]("quality")
      )
      return this.$store.getters["meta/getCompletedSectionsOfRole"]("quality")
    },
    lockedSections(): boolean[] {
      // hmm.. this will have to be rewritten if I do more of these..
      // I like the data in 'suspendedData'..  but you should be able to get this from "getAllSections"
      return this.$store.getters["meta/getLockedSectionsOfRole"]("quality")
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#starting-menu-page {
  .page-container-inner {
    max-height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding-bottom: 0%;

    #top-part {
      width: 100%;
      margin-top: 2em;
      h1 {
        margin: 0.5em 0em;
      }
    }

    .left-and-right-parts {
      display: flex;
      flex-direction: row;
      min-height: 502px;
      ::v-deep #left-part {
        width: 55%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        #logo-img {
          width: 100px;
          margin-top: 3em;
        }

        .top-part-info {
          font-family: $noto;
          color: $darkGray;
          font-size: 1em;
          padding-right: 1em;
          p:first-of-type {
            margin-top: 0;
          }
        }
      }
    }
  }
}
.sub-headline {
  margin-top: 0;
  padding-top: 0;
}
// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline {
  h2 {
    font-size: 1em; // it's already 1.7 from the outer class, so make sure it stays
    color: $black;
    font-family: "Noto Sans";
    font-weight: bold;
  }
}
::v-deep .sub-headline {
  h2 {
    font-family: "Noto Sans";
    font-style: italic;
    font-size: 1em;
    color: $darkGray;
  }
}
</style>

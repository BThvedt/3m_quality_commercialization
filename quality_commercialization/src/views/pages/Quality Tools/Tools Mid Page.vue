<template>
  <PageBase>
    <div id="tools-mid-page" class="page-container">
      <div class="page-container-inner">
        <div class="top-and-bottom-parts">
          <div id="top-part">
            <E :h="json.e_header" t="h1" class="bold-headline" />
            <E :h="json.e_text" t="div" class="page-text" />
          </div>
          <div id="bottom-part">
            <img
              :src="
                require(`@/assets/images/Quality/Tools/${json.pageImage}`)
                  .default
              "
            />
          </div>
        </div>
      </div>

      <transition
        :enter-active-class="TEnter.FADE_IN_UP"
        :leave-active-class="TExit.FADE_OUT"
      >
        <div id="buttons-container" v-if="showContinue">
          <div id="continue-container">
            <button class="continue-button small-button" @click="goToNextPage">
              Continue
            </button>
          </div>
          <div id="pdf-button-container">
            <div class="bAndWButton small-button" @click="showToolDisplay">
              <strong>View the Tool</strong>
            </div>
          </div>
        </div>
      </transition>

      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="`${TExit.FADE_OUT}`"
        mode="out-in"
      >
        <ToolDisplay
          v-if="showToolPage"
          :title="toolPage.e_title"
          :subTitle="toolPage.e_subtitle"
          :images="toolPage.images"
          :role="'Quality'"
          @close="closeToolDisplay"
        />
      </transition>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import E from "@/components/editable/E.vue"
import ToolDisplay from "@/components/shared/Tools/ToolDisplay.vue"

export default Vue.extend({
  name: "ToolsMidPage",
  components: { PageBase, E, ToolDisplay },
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
      showContinue: false,
      toolPage: this.json.toolPage,
      showToolPage: false,
    }
  },
  async mounted() {
    await genericAwait(1000)
    this.showContinue = true
  },
  methods: {
    showToolDisplay() {
      this.showToolPage = true
    },
    closeToolDisplay() {
      this.showToolPage = false
    },
    goToNextPage() {
      // alert("go to next page")

      let { currSection, currPage } =
        this.$store.getters["meta/getSectionAndPageIndex"]

      let sectionInfo = this.$store.getters["meta/getCurrentSection"]

      let pageIndex = sectionInfo.pages.findIndex(
        (page: any) => page.name === "What are your Tools Two"
      )

      console.log("SECTION AND PAGE INDEX")
      console.log({ sectionIndex: currSection, pageIndex })

      this.$store.dispatch("meta/goToSectionAndPage", {
        sectionIndex: currSection,
        pageIndex,
      })
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#buttons-container {
  z-index: 0;
  position: absolute;
  right: 2em;
  bottom: 1.2em;
  width: 20.5em;
  height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#continue-container {
  position: static;
}
// #pdf-button-container {
//   z-index: 0;
//   position: absolute;
//   right: 0em;
// }
// #continue-container {
//   z-index: 0;
//   position: absolute;
//   right: 11em;
//   bottom: 0.2em;
// }
.page-container-inner {
  box-sizing: border-box;
  padding-bottom: 0%;
}
.top-and-bottom-parts {
  display: flex;
  flex-direction: column;
  padding-bottom: 2em;
  min-height: 502px;
  width: 100%;
  ::v-deep #top-part {
    // width: 50%;
    // padding-right: 3%;
    box-sizing: border-box;
    padding-bottom: 0.5em;
  }
  ::v-deep #bottom-part {
    // width: 50%;
    // padding-left: 3%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 83%;
      position: relative;
      // top: 13%;
      bottom: 5%;
    }
  }
}
::v-deep .page-text {
  font-size: 1em;
  font-family: $noto;
  color: $darkGray;
}
</style>

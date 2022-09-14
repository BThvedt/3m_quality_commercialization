<template>
  <PageBase>
    <div id="tools-mid-page" class="page-container">
      <div class="page-container-inner">
        <div class="left-and-right-parts">
          <div id="left-part">
            <E :h="json.e_header" t="h1" class="bold-headline" />
            <E :h="json.e_text" t="div" class="page-text" />
          </div>
          <div id="right-part">
            <img
              :src="
                require(`@/assets/images/Quality/Tools/${json.pageImage}`)
                  .default
              "
            />
          </div>
        </div>

        <transition
          :enter-active-class="TEnter.FADE_IN_UP"
          :leave-active-class="TExit.FADE_OUT"
        >
          <div id="continue-container" v-if="showContinue">
            <button class="continue-button small-button" @click="goToNextPage">
              Continue
            </button>
          </div>
        </transition>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "ToolsMidPage",
  components: { PageBase, E },
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
      showContinue: false,
    }
  },
  async mounted() {
    await genericAwait(1000)
    this.showContinue = true
  },
  methods: {
    goToNextPage() {
      // alert("go to next page")

      let { currSection, currPage } =
        this.$store.getters["meta/getSectionAndPageIndex"]

      console.log("-----> REPLACE THE HARDCODED CURRPAGE WITH THE currPage")
      console.log("MAYBE MAKE A NEW GETTER.. GET PAGE BY NAME.. OR USE ")

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
.page-container-inner {
  box-sizing: border-box;
  padding-bottom: 0%;
}
.left-and-right-parts {
  display: flex;
  flex-direction: row;
  min-height: 502px;
  width: 100%;
  ::v-deep #left-part {
    width: 50%;
    padding-right: 3%;
    box-sizing: border-box;
  }
  ::v-deep #right-part {
    width: 50%;
    padding-left: 3%;
    box-sizing: border-box;
    img {
      position: relative;
      top: 15%;
      width: 100%;
    }
  }
}
::v-deep .page-text {
  font-size: 1em;
  font-family: $noto;
  color: $darkGray;
}
#continue-container {
  z-index: 0;
  position: absolute;
  right: 2em;
  bottom: 1.2em;
}
</style>

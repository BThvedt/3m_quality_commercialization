<template>
  <PageBase>
    <div id="conclusion-page" class="module-page-container">
      <ConclusionPage
        :title="json.e_title"
        :text="json.e_text"
        :exitButtonText="json.exitBtn"
        @completeAndExit="completeAndExit"
      />
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import ConclusionPage from "@/components/shared/Conclusion/ConclusionPage.vue"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, ConclusionPage },
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
    completeAndExit() {
      let { currSection } = this.$store.getters["meta/getSectionAndPageIndex"]
      this.$store.dispatch("meta/markSectionComplete", currSection)

      const completedSectionData =
        this.$store.getters["meta/getCompletedSections"]

      let weAreDone = false
      // once every section is complete in at least one "role", then learner gets credit
      Object.keys(completedSectionData).forEach((role: string) => {
        if (completedSectionData[role].every((status: boolean) => status)) {
          weAreDone = true
        }
      })

      if (weAreDone) {
        // complete, set last location to the role menu so when user returns, that's where they go
        this.$store.dispatch("meta/setLastLocation", {
          sectionId: "Hx5Dxudy",
          pageId: "8U9NajQt",
        })
      } else {
        // incomplete, set last location to the role's lesson menu so when user returns, that's where they go
        this.$store.dispatch("meta/setLastLocation", {
          sectionId: "QngESQ64",
          pageId: "eZtl0QCN",
        })
      }

      this.$store.dispatch("meta/saveAndExitScorm")

      // some LMS's don't close window automatically
      window.close()
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#conclusion-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  background-image: url("../../../assets/images/Quality/Conclusion/conclusion-coach.jpg");
  background-size: cover;
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline {
  h1 {
    font-size: 1em;
  }
}
</style>

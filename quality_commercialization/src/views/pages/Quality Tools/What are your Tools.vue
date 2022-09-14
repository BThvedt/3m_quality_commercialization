<template>
  <PageBase>
    <div id="quality-tools" class="module-page-container">
      <TitleAndSubTitle :title="json.e_title" :subTitle="json.e_subTitle" />

      <transition
        :enter-active-class="`${TEnter.FADE_IN}`"
        :leave-active-class="`${TExit.FADE_OUT}`"
      >
        <img
          id="the-coach"
          :src="
            require(`@/assets/images/Quality/Tools/${json.smallCoachImg}`)
              .default
          "
          v-if="componentsShowing.smallCoach"
        />
      </transition>

      <div id="content-area">
        <transition
          :enter-active-class="`${TEnter.FADE_IN}`"
          :leave-active-class="`${TExit.FADE_OUT}`"
          mode="out-in"
        >
          <template v-for="(tool, i) in tools">
            <div :key="i" v-if="toolIndex === i">
              <transition
                :enter-active-class="`${TEnter.FADE_IN}`"
                :leave-active-class="`${TExit.FADE_OUT}`"
                mode="out-in"
              >
                <template v-for="(part, i) in tool.parts">
                  <div v-if="partIndex === i" :key="i">
                    <ToolIntro
                      v-if="part.type === 'tool-intro-prompts'"
                      :introData="part"
                      :role="'Quality'"
                      @moveOn="goToNextStep"
                    />
                    <MultiChoice
                      :questionData="part"
                      @moveOn="goToNextStep"
                      v-if="part.type === 'multi-choice'"
                      :role="'Quality'"
                    />
                    <MultiSelect
                      :questionData="part"
                      @moveOn="goToNextStep"
                      v-if="part.type === 'multiple-select'"
                      :role="'Quality'"
                    />
                    <HotSpotSelect
                      :hotspotData="part"
                      @moveOn="goToNextStep"
                      v-if="part.type === 'hotspot'"
                      :role="'Quality'"
                    />
                    <HotSpotClickResponse
                      :hotspotData="part"
                      @moveOn="goToNextStep"
                      v-if="part.type === 'hotspot-click-response'"
                      :role="'Quality'"
                    />
                  </div>
                </template>
              </transition>
            </div>
          </template>
        </transition>
      </div>
      <IntroConclusionModal
        ref="IntroModal"
        :titleAndText="introModal"
        @onClose="startLesson"
        :coach="true"
      />
      <IntroConclusionModal
        ref="ConclusionModal"
        :titleAndText="conclusionModal"
        @onClose="goToNextPage"
      />
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import TitleAndSubTitle from "@/components/TitleAndSubtitle.vue"
import ToolIntro from "@/components/shared/Tools/ToolIntro.vue"
import HotSpotSelect from "@/components/shared/Tools/HotSpotSelect.vue"
import MultiChoice from "@/components/shared/Tools/MultiChoice.vue"
import MultiSelect from "@/components/shared/Tools/MultiSelect.vue"
import HotSpotClickResponse from "@/components/shared/Tools/HotSpotClickResponse.vue"
import IntroConclusionModal from "@/components/modals/IntroConclusionModal.vue"

export default Vue.extend({
  name: "QualityTools",
  components: {
    PageBase,
    TitleAndSubTitle,
    ToolIntro,
    MultiChoice,
    MultiSelect,
    HotSpotSelect,
    HotSpotClickResponse,
    IntroConclusionModal,
  },
  data() {
    return {
      introModal: this.json.introModal,
      conclusionModal: this.json.conclusionModal,
      componentsShowing: {
        smallCoach: false,
      },
      tools: this.json.tools,
      toolIndex: -1,
      partIndex: -1,
      TEnter,
      TExit,
    }
  },
  async mounted() {
    // await genericAwait(1000)
    // ;(this.$refs["IntroModal"] as any).show()
    // ---- remove this below ----
    this.componentsShowing.smallCoach = true
    this.toolIndex = 0
    this.partIndex = 0
  },
  methods: {
    async startLesson() {
      await genericAwait(1000)
      this.componentsShowing.smallCoach = true
      await genericAwait(1000)
      this.toolIndex = 0
      this.partIndex = 0
    },
    goToNextPage() {
      //this.$store.dispatch("meta/goForward")
      this.$store.dispatch("meta/goToHiddenPage", "Tools Mid Page")
    },
    async goToNextStep() {
      if (this.partIndex < this.tools[this.toolIndex].parts.length - 1) {
        this.partIndex++
      } else if (this.toolIndex < this.tools.length - 1) {
        this.partIndex = 0
        this.toolIndex++
      } else {
        await genericAwait(1000)
        ;(this.$refs["ConclusionModal"] as any).show()
      }
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#the-coach {
  position: absolute;
  top: 15px;
  left: 17px;
  transform: scale(0.8);
}
#content-area {
  position: relative;
  width: 100%;
  height: 86%;
}
</style>

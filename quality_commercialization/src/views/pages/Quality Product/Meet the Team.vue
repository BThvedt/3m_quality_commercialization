<template>
  <PageBase>
    <div id="meet-the-team" class="module-page-container disable-user-select">
      <TitleAndSubTitle :title="e_title" :subTitle="e_subtitle" />
      <div id="middle">
        <MeetTeamMembers
          :teamMembers="teamMembers"
          :revealTracker="revealTracker"
          :selectedNum="selectedNum"
          :area="area"
          @reveal="reveal"
        />
        <MeetTeamSlides :teamMembers="teamMembers" :selectedNum="selectedNum" />
      </div>
      <div id="bottom"></div>
      <transition
        :enter-active-class="TEnter.FADE_IN_UP"
        :leave-active-class="TExit.FADE_IN_DOWN"
      >
        <div id="continue-container" v-show="showDoneModal">
          <div class="continue-button small-button" @click="doneModal">
            <strong>Continue</strong>
          </div>
        </div>
      </transition>

      <IntroConclusionModal ref="IntroModal" :titleAndText="introModal" />
      <IntroConclusionModal
        ref="ConclusionModal"
        :titleAndText="transitionModal"
        @onClose="goToNextPage"
      />
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import TitleAndSubTitle from "@/components/TitleAndSubtitle.vue"
import { TEnter, TExit } from "@/types"
import IntroConclusionModal from "@/components/modals/IntroConclusionModal.vue"
import { genericAwait } from "@/lib/randomFunctions"
import MeetTeamMembers from "@/components/shared/Product/MeetTeamMembers.vue"
import MeetTeamSlides from "@/components/shared/Product/MeetTeamSlides.vue"

export default Vue.extend({
  name: "MeetTheTeam",
  components: {
    PageBase,
    IntroConclusionModal,
    TitleAndSubTitle,
    // Icon,
    MeetTeamMembers,
    MeetTeamSlides,
  },
  data() {
    return {
      selectedNum: -1,
      e_title: this.json.e_title,
      e_subtitle: this.json.e_subtitle,
      area: "quality",
      revealTracker: [false, false, false, false, false, false],
      showDoneModal: false,
      teamMembers: this.json.teamMembers,
      introModal: this.json.introModal,
      transitionModal: this.json.transitionModal,
      TEnter,
      TExit,
    }
  },
  async mounted() {
    await genericAwait(1000)
    ;(this.$refs["IntroModal"] as any).show()
  },
  methods: {
    // methods in this and just about everywhere become increasingly misnamed as things get endlessly and continulously tweaked
    // refactoring is impossible if I made things perfect I would have had to throw it all out 50 times by now
    doneModal() {
      this.showDoneModal = false
      //;(this.$refs["doneMeetingModal"] as any)?.show()
      this.$store.dispatch("meta/goForward")
    },

    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },

    async reveal(index: number) {
      this.selectedNum = index
      this.revealTracker.splice(index, 1, true)

      await genericAwait(2000)
      this.e_subtitle = this.json.e_subtitle_2
    },
  },

  watch: {
    async revealTracker(ov, nv) {
      if (nv.indexOf(false) === -1) {
        await genericAwait(1000)
        this.showDoneModal = true
      }
    },
  },
  props: ["json"],
})
</script>

<style scoped lang="scss">
#continue-container {
  position: absolute;
  right: 2em;
  bottom: 1.2em;
}
::v-deep ul li p {
  margin: 0;
}
#top {
  width: 93%;
  height: 14%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-bottom: 1px dotted $darkGray;
  padding-top: 1.4%;
  margin: auto;
  .bold-headline,
  .sub-headline {
    margin: 0;
    padding: 0;
  }
  .sub-headline {
    // margin-top: 0.1rem;
    font-weight: bold;
  }
  .bold-headline {
    padding-bottom: 0.3em;
  }
}
#middle {
  width: 100%;
  height: 70%;
  display: flex;

  #middle-right {
    width: 50%;
    position: relative;
    ::v-deep .popup {
      position: absolute;
      background: white;
      width: 90%;
      p,
      ul {
        font-family: $noto;
        font-size: 1em;
      }
    }
  }
}
#bottom {
  width: 100%;
  height: 15%;
}
</style>

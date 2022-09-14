<template>
  <ModalBase :size="'xl'" ref="modalBase">
    <div id="modal-inner">
      <img
        id="top-image"
        :src="require('@/assets/images/shared/gradient-bar.png').default"
      />
      <div id="left-section">
        <!-- <E
          id="success-summary"
          class="bold-headline"
          t="h1"
          :h="feedBack.e_feedbackTitle"
        /> -->
        <div id="score-container">
          <div>
            <h2 class="small-headline">Score:</h2>
          </div>

          <div class="right-and-wrong">
            <div
              v-for="(result, i) in correctTracker"
              :key="i"
              class="right-and-wrong-container"
            >
              <span class="check-or-x" v-if="result === true">
                <img
                  :src="
                    require(`@/assets/images/Quality/Challenge/correct.png`)
                      .default
                  "
                />
              </span>
              <span class="check-or-x" v-else-if="result === false">
                <img
                  :src="
                    require(`@/assets/images/Quality/Challenge/incorrect.png`)
                      .default
                  "
                />
              </span>
            </div>
          </div>
        </div>
        <div id="text-section">
          <div id="headlines">
            <E
              :h="title"
              v-if="title"
              t="h2"
              :class="`intro-modal-title small-headline ${headlineClass}`"
            />
          </div>
          <!-- <E
            id="success-summary"
            v-if="successRate < 100"
            class="bold-headline"
            t="h2"
            :h="feedBack.e_feedbackSubTitle"
          /> -->
          <!-- <E class="small-headline" :h="feedBack.e_allCorrect" v-else t="h2" /> -->
          <E :h="text" v-if="text" t="div" />
        </div>
      </div>

      <div id="right-section">
        <!-- <img
          v-if="headlineClass === 'green'"
          :src="
            require(`@/assets/images/Quality/Challenge/champion.png`).default
          "
        />
        <E
          h="You're a Champion!"
          v-if="headlineClass === 'green'"
          t="h2"
          :class="`champion-headline small-headline `"
        />
        <E
          :h="`${successRate}% Success Rate`"
          v-if="headlineClass === 'green'"
          t="p"
          :class="'success-rate-feedback'"
        /> -->

        <FinalBadges :badges="badges" :showBadgesArr="showBadgesArr" />
      </div>
      <div id="continue-container">
        <div class="continue-button med-button" @click="closeModal">
          <strong>
            <E id="success-summary" t="p" :h="feedBack.e_continue" />
          </strong>
        </div>
        <div
          v-if="showTryAgain"
          class="bAndWButton med-button"
          @click="emitTryAgain"
        >
          <strong>
            <E id="success-summary" t="p" :h="feedBack.e_tryAgain" />
          </strong>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script lang="ts">
import Vue from "vue"
import ModalBase from "@/components/ModalBase.vue"
import E from "@/components/editable/E.vue"
import FinalBadges from "@/components/shared/Product/FinalBadges.vue"

export default Vue.extend({
  name: "CTPFeedbackModal",
  data() {
    return {
      title: "",
      text: "",
      icon: false,
      headlineClass: "green",
      successRate: 0,
      showTryAgain: false,
    }
  },

  methods: {
    emitTryAgain() {
      this.$emit("tryAgain")
    },
    async show() {
      let successRate = 0
      this.correctTracker.forEach((correct: boolean) => {
        if (correct) {
          successRate++
        }
      })

      let totalQuestions = this.correctTracker.length

      if (successRate === totalQuestions) {
        this.title = this.feedBack.perfect.e_title
        this.text = this.feedBack.perfect.e_text
        this.icon = this.feedBack.perfect.icon
        this.showTryAgain = false
        this.headlineClass = "green"
      } else if (successRate >= Math.round(0.8 * totalQuestions)) {
        this.title = this.feedBack.high.e_title
        this.text = this.feedBack.high.e_text
        this.icon = this.feedBack.high.icon
        this.showTryAgain = true
        this.headlineClass = "green"
      } else if (successRate >= Math.round(0.6 * totalQuestions)) {
        this.title = this.feedBack.med.e_title
        this.text = this.feedBack.med.e_text
        this.icon = this.feedBack.med.icon
        this.showTryAgain = true
        this.headlineClass = "orange"
      } else {
        this.title = this.feedBack.low.e_title
        this.text = this.feedBack.low.e_text
        this.icon = this.feedBack.low.icon
        this.showTryAgain = true
        this.headlineClass = "red"
      }

      this.successRate = Math.round((successRate / totalQuestions) * 100)

      await (this.$refs["modalBase"] as any)?.show()
    },
    async closeModal() {
      await (this.$refs["modalBase"] as any)?.hide()
      this.$emit("onClose")
    },
  },
  computed: {
    showBadgesArr(): boolean[] {
      return this.$store.getters["getBadgesShowing"]
      // return [true, false, true, false, true]
    },
  },
  props: ["feedBack", "correctTracker", "badges"],

  components: { ModalBase, E, FinalBadges },
})
</script>

<style scoped lang="scss">
.champion-headline {
  margin-top: 0.5em;
  margin-bottom: 0em;
}
::v-deep .success-rate-feedback {
  font-family: $noto;
  color: $darkGray;

  margin: 0;
  padding: 0;
}
.intro-modal-title {
  &.green {
    color: $phaseGreen;
  }
  &.orange {
    color: $orange;
  }
  &.red {
    color: $red;
  }
}
#success-summary {
  margin: 0;
  padding: 0;
}
#score-container {
  display: flex;
  z-index: 100;
  text-transform: uppercase;
  .right-and-wrong {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 0.5em;
    position: relative;
    .right-and-wrong-container {
      position: relative;
      width: 15px;
      height: 15px;
      margin-right: 3px;
      .check-or-x {
        width: 15px;
        height: 15px;
        background: #d2d2d2;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 100;
        display: block;
        border-radius: 100%;
        img {
          width: 15px;
        }
      }
    }
  }
}

#modal-inner {
  padding-top: 3em;
  padding-bottom: 5.5em;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 95% 0%;
  background-size: 42%;
  padding-left: 6%;
  box-sizing: border-box;
  text-align: left;
  display: flex;
  ::v-deep .intro-modal-title {
    margin-top: 0;
  }
  #left-section {
    width: 60%;
    padding-right: 5%;
    box-sizing: border-box;
  }
  #right-section {
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 150px;
    }
  }
  #top-image {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  #text-section {
    position: relative;
    font-family: $noto;
    color: $darkGray;

    #headlines {
      h2 {
        margin: 0;
        padding: 0;
      }
      .bold-headline {
        margin-bottom: 0.5em;
      }
    }
  }

  #continue-container {
    right: 6em;
    display: flex;
    .bAndWButton {
      margin-left: 1.8em;
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline {
  h1 {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
}
::v-deep .small-headline.green,
::v-deep #right-section .small-headline {
  h2 {
    font-weight: bold;
    font-size: 1em;
    margin-top: 0;
    margin-bottom: 0;
  }
}
::v-deep #right-section {
  p {
    margin-top: 0;
  }
}
::v-deep .small-headline {
  h2 {
    font-weight: bold;
    font-size: 1em;
  }
}
</style>

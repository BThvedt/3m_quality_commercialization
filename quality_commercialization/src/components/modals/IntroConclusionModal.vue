<template>
  <ModalBase :size="'med-width'" ref="modalBase">
    <div
      id="intro-conclusion-modal-inner"
      :class="`${specialClass} ${coach ? 'show-coach' : ''}`"
    >
      <img
        id="top-image"
        :src="require('@/assets/images/shared/gradient-bar.png').default"
      />
      <img
        v-if="coach"
        id="the-coach"
        :src="require(`@/assets/images/shared/coach-circle.png`).default"
      />
      <div id="text-section">
        <div id="headlines">
          <E
            :h="title"
            v-if="title"
            t="h2"
            :class="'intro-modal-title bold-headline'"
          />
        </div>

        <E :h="text" v-if="text" t="div" class="text-div" />
      </div>

      <div id="continue-container">
        <div class="continue-button small-button" @click="closeModal">
          <strong>Continue</strong>
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script lang="ts">
import Vue from "vue"
import ModalBase from "@/components/ModalBase.vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "IntroConclusionModal",
  data() {
    return {
      title: this.titleAndText.e_title,
      text: this.titleAndText.e_text,
    }
  },
  methods: {
    async show() {
      await (this.$refs["modalBase"] as any)?.show()
    },
    async closeModal() {
      await (this.$refs["modalBase"] as any)?.hide()
      this.$emit("onClose")
    },
  },
  props: ["titleAndText", "specialClass", "coach"],

  components: { ModalBase, E },
})
</script>

<style scoped lang="scss">
#intro-conclusion-modal-inner {
  padding-top: 4.5em;
  padding-bottom: 5.5em;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 95% 0%;
  background-size: 42%;
  padding-left: 6%;
  box-sizing: border-box;
  text-align: left;

  &.show-coach {
    #the-coach {
      position: absolute;
      width: 115px;
      top: 25px;
      left: 25px;
    }
    #headlines {
      padding-left: 100px;
      margin-bottom: 2.5em;
    }
  }

  ::v-deep .intro-modal-title {
    margin-top: 0;
  }
  #top-image {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  #text-section {
    width: 93%;
    position: relative;
    top: 15%;
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

  #continue-button {
    position: absolute;
    bottom: 1.8em;
  }

  &.tasks-conclusion-modal {
    padding-top: 2.5em;
    padding-bottom: 3.5em;
    #text-section {
      ::v-deep .text-div {
        ul li {
          p {
            margin: 0;
            padding-bottom: 0.5em;
          }
        }
      }
    }
  }
}
// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline {
  h2 {
    font-size: 1em;
    margin-bottom: 0.5em;
    margin-top: 0;
  }
}
</style>

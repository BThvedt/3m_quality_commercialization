<template>
  <ModalBase :size="'med-width'" ref="modalBase">
    <div id="modal-inner">
      <img
        id="top-image"
        :src="require('@/assets/images/shared/gradient-bar.png').default"
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

        <E :h="text" v-if="text" t="div" />
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
  name: "StandardModal",
  data() {
    return {
      title: "",
      text: "",
    }
  },
  // mounted() {
  //   console.log("Title and text is")
  //   console.log(this.titleAndText)
  // },
  methods: {
    async show() {
      this.title = this.titleAndText.e_title
      this.text = this.titleAndText.e_text

      await (this.$refs["modalBase"] as any)?.show()
    },
    async closeModal() {
      await (this.$refs["modalBase"] as any)?.hide()
      this.$emit("onClose")
    },
  },
  props: ["titleAndText"],

  components: { ModalBase, E },
})
</script>

<style scoped lang="scss">
#modal-inner {
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
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline {
  h2 {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
}
::v-deep .sub-headline {
  h4 {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
}
</style>

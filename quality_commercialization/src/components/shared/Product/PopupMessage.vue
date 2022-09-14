<template>
  <div class="popup-message-outer" key="pop-msg-outer" v-show="showBadgePopup">
    <transition
      :enter-active-class="`${TEnter.BOUNCE_IN} delay-half-sec`"
      :leave-active-class="TExit.FADE_OUT"
    >
      <div class="popup-message-inner" key="popupMsg" v-if="showBadgePopup">
        <font-awesome-icon
          class="close"
          icon="times"
          @click="closeBadgePopup"
        />
        <img
          id="popup-top-image"
          :src="require('@/assets/images/shared/gradient-bar.png').default"
        />

        <E :h="badges[currBadgeIndex].text" t="div" />
        <!-- {{ currBadgeIndex }}
        {{ badges }} -->
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit, TTimes } from "@/types"

export default Vue.extend({
  name: "PopupMessage",
  components: { E },
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
    }
  },
  methods: {
    closeBadgePopup() {
      this.$emit("closeBadgePopup")
    },
  },
  props: [
    "showBadgePopup",
    "gateReviewTransitionClassAdded",
    "badges",
    "currBadgeIndex",
  ],
})
</script>

<style scoped lang="scss">
.popup-message-outer {
  #popup-top-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep .popup-message-inner {
    width: 50%;
    height: auto;
    bottom: 5%;
    background: white;
    box-shadow: $box-shadow;
    padding-top: 1em;
    padding-bottom: 1em;
    position: relative;
    padding-left: 2em;
    padding-right: 1em;
    .close {
      font-size: 1.5em;
      cursor: pointer;
      color: $mediumGray;
      position: absolute;
      top: 10px;
      right: 10px;
      &:hover {
        cursor: pointer;
        color: black;
      }
    }
    p {
      font-family: $noto;
      font-size: 1em;
      color: $darkGray;
      text-align: left;
    }
  }
}
.delay-half-sec {
  animation-delay: 0.5s;
}
</style>

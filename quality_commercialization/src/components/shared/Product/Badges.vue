<template>
  <div id="progress-container">
    <div id="badge-container">
      <template v-for="(badge, index) in badges">
        <div class="badge-image" :key="badge.id">
          <!-- <div class="badge-image" :key="badge.id" v-if="showBadgesArr[index]"> -->
          <transition
            :enter-active-class="`${TEnter.BOUNCE_IN} delay-1-s`"
            :leave-active-class="TExit.FADE_OUT"
          >
            <div :key="badge.id" v-if="showBadgesArr[index]">
              <img
                class="badge-image-image"
                :class="badge.id"
                :src="
                  require(`@/assets/images/Quality/Product/${badge.image}`)
                    .default
                "
              />
              <E :h="badge.caption" t="h3" />
            </div>
          </transition>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit } from "@/types"

export default Vue.extend({
  name: "Badges",
  components: { E },
  data() {
    return {
      TEnter,
      TExit,
    }
  },
  methods: {},
  props: ["badges", "showBadgesArr"],
})
</script>

<style lang="scss">
#badge-container {
  display: flex;
  position: relative;
  top: 6px;
  left: -12px;
  width: 108%;
  justify-content: space-between;
  .badge-image {
    width: 112px;
    height: 160px;
    position: relative;
    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
    h3 {
      position: relative;
      bottom: 10px;
      text-align: center;
      color: $darkGray;
      line-height: 19px;
      width: 100%;
      font-family: $roboto;
    }
  }
}
</style>

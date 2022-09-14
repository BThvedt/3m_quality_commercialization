<template>
  <div id="progress-container">
    <div id="badge-container">
      <template v-for="(badge, index) in badges">
        <div class="badge-image" :key="badge.id">
          <!-- <div class="badge-image" :key="badge.id" v-if="showBadgesArr[index]"> -->

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
          <div :key="badge.id" v-else>
            <img
              class="badge-image-image"
              :class="badge.id"
              :src="
                require(`@/assets/images/Quality/Product/badge-grayed-out.png`)
                  .default
              "
            />
          </div>
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
  name: "FinalBadges",
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

<style lang="scss" scoped>
#badge-container {
  display: flex;
  position: relative;
  flex-wrap: wrap;
  top: 6px;
  left: -12px;
  width: 100%;
  justify-content: center;
  .badge-image {
    width: 100px;
    height: 157px;
    position: relative;
    margin-left: 20px;
    margin-right: 20px;
    img {
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
    h3 {
      position: relative;
      bottom: 15px;
      right: 8%;
      text-align: center;
      color: #595959;
      line-height: 18px;
      width: 116%;
      font-family: "Roboto Condensed";
      font-size: 1em;
    }
  }
}
</style>

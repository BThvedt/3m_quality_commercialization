<template>
  <div id="middle-left">
    <template v-for="(member, i) in teamMembers">
      <transition
        :enter-active-class="TEnter.FADE_IN"
        :leave-active-class="TExit.FADE_OUT"
        :key="member.id"
      >
        <div
          v-if="showAll || member.area === area"
          @click="reveal(i)"
          class="member-image"
          :class="`member-${i} ${selectedNum === i ? 'active' : 'not-active'}`"
        >
          <img
            :src="
              require(`@/assets/images/Quality/Product/${member.image}`).default
            "
          />
          <p class="small-headline">
            <Icon
              :iconName="'check'"
              class="check-icon"
              v-if="revealTracker[i]"
            />

            <E :h="member.e_title" t="span" />
          </p>
        </div>
      </transition>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
import Icon from "@/components/Icon.vue"
import { TEnter, TExit } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"

export default Vue.extend({
  name: "MeetTeamMembers",
  data() {
    return {
      TEnter,
      TExit,
      showAll: false,
    }
  },
  methods: {
    async reveal(index: number) {
      this.$emit("reveal", index)

      if (!this.showAll) {
        await genericAwait(1000)
        this.showAll = true
      }
    },
  },
  components: { E, Icon },
  props: ["teamMembers", "revealTracker", "selectedNum", "area"],
})
</script>

<style scoped lang="scss">
#middle-left {
  width: 50%;
  background-image: url("../../../assets/images/Quality/Product/networked-globe.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 55%;
  position: relative;
  bottom: 2%;
  left: 0.5%;
  .member-image {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      filter: brightness(1.3) contrast(65%) grayscale(100%);
    }
    transition: $very-fast-transition;
    ::v-deep .check-icon {
      width: 20px;
      height: 20px;
      position: absolute;
      fill: $green;
      stroke: $green;
      display: inline-block;
      svg {
        position: relative;
        left: -20px;
        bottom: 3px;
      }
    }
    &:hover,
    &.active {
      cursor: pointer;
      img {
        filter: none;
      }

      .small-headline {
        color: black;
      }
    }
    &.member-0 {
      right: 431px;
      top: 45px;
    }
    &.member-1 {
      left: 53px;
      top: 210px;
    }
    &.member-2 {
      left: 154px;
      top: 352px;
    }
    &.member-3 {
      right: 148px;
      top: 352px;
    }
    &.member-4 {
      right: 65px;
      top: 210px;
    }
    &.member-5 {
      right: 93px;
      top: 44px;
    }
    .small-headline {
      color: $mediumGray;
      font-family: $roboto;
      margin: 0;
      padding: 0;
      margin-top: 0.3em;
      transition: $very-fast-transition;
      text-align: center;
    }
    img {
      width: 110px;
      height: 110px;
    }
  }
}
::v-deep p.small-headline,
::v-deep .small-headline p {
  margin: 0;
  padding: 0;
}
// fixes for editing - it's ok changing strategy next iteration
// ::v-deep p.small-headline,
// ::v-deep .small-headline {
//   font-family: $noto;
//   font-size: 1em;
//   margin: 0;
//   padding: 0;
//   .editable-text-span {
//     p {
//       margin: 0;
//       padding: 0;
//     }
//   }
// }
</style>

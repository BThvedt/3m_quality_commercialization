<template>
  <div id="middle-right">
    <transition
      name="select-reveal-transition"
      :enter-active-class="TEnter.FADE_IN_RIGHT"
      :leave-active-class="TExit.FADE_OUT_RIGHT"
    >
      <template v-for="(member, i) in teamMembers">
        <div class="popup" v-if="selectedNum === i" :key="member.id">
          <!-- <h2 class="bold-headline">{{ member.e_headlineOne }}</h2>
          <div v-html="member.e_text" /> -->

          <E
            v-if="member.e_headlineOne"
            class="bold-headline"
            :h="member.e_headlineOne"
            t="h2"
          />
          <E v-if="member.e_text" :h="member.e_text" t="div" />

          <!-- <h2 class="small-headline">{{ member.e_headlineTwo }}</h2> -->
          <E
            v-if="member.e_headlineTwo"
            class="small-headline"
            :h="member.e_headlineTwo"
            t="h2"
          />
          <E v-if="member.e_textTwo" :h="member.e_textTwo" t="div" />
          <!-- <div v-html="member.e_textTwo" /> -->
        </div>
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit } from "@/types"

export default Vue.extend({
  name: "MeetTeamSlides",
  data() {
    return {
      TEnter,
      TExit,
    }
  },
  methods: {},
  components: { E },
  props: ["teamMembers", "selectedNum"],
})
</script>

<style scoped lang="scss">
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

// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline h2 {
  font-size: 1em;
  padding: 0;
}
</style>

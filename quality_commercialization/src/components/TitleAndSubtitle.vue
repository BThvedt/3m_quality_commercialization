<template>
  <div id="top-banner">
    <transition
      :enter-active-class="`${TEnter.FADE_IN_RIGHT}`"
      :leave-active-class="`${TExit.FADE_OUT_LEFT}`"
      mode="out-in"
    >
      <E v-if="title" :h="title" t="h1" class="bold-headline" :key="titleKey" />
    </transition>

    <transition
      :enter-active-class="`${TEnter.FADE_IN_RIGHT}`"
      :leave-active-class="`${TExit.FADE_OUT_LEFT}`"
      mode="out-in"
    >
      <E
        v-if="subTitle"
        :h="subTitle"
        t="h1"
        class="sub-headline"
        :key="subtitleKey"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
import { TEnter, TExit } from "@/types"

export default Vue.extend({
  name: "TitleAndSubtitle",
  components: { E },

  data() {
    return {
      titleKey: 1,
      subtitleKey: 1,
      TEnter,
      TExit,
    }
  },
  watch: {
    title(nv, ov) {
      if (nv !== ov) {
        this.titleKey++
      }
    },
    subTitle(nv, ov) {
      console.log("NEW SUBTITLE")
      console.log(nv)
      if (nv !== ov) {
        this.subtitleKey++
      }
    },
  },
  props: ["title", "subTitle"],
})
</script>

<style scoped lang="scss">
#top-banner {
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
// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline {
  h1 {
    font-size: 1em;
    margin: 0;
    padding: 0;
    padding-bottom: 0.3em;
  }
}
::v-deep .sub-headline {
  h1 {
    margin: 0;
    padding: 0;
    font-size: 1em;
  }
}
</style>

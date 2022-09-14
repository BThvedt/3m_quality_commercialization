<template>
  <PageBase>
    <div id="tasks-intro-one" class="page-container">
      <TitleAndSubTitle :title="json.e_pageTitle" />

      <div class="page-container-inner">
        <E :h="json.e_topText" t="div" class="top-text" />
        <div class="left-and-right-parts">
          <div id="left-part">
            <E :h="json.e_left_header" t="h1" class="bold-headline" />
            <E :h="json.e_left_text" t="div" class="page-text" />
          </div>
          <div id="right-part">
            <E :h="json.e_right_header" t="h1" class="bold-headline" />
            <E :h="json.e_right_text" t="div" class="page-text" />
          </div>
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { TEnter, TExit, TTimes } from "@/types"
import { genericAwait } from "@/lib/randomFunctions"
import E from "@/components/editable/E.vue"
import TitleAndSubTitle from "@/components/TitleAndSubtitle.vue"

export default Vue.extend({
  name: "TasksIntroThree",
  components: { TitleAndSubTitle, PageBase, E },
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
      showContinue: false,
    }
  },

  methods: {},
  props: ["json"],
})
</script>

<style scoped lang="scss">
.page-container-inner {
  box-sizing: border-box;
  padding-bottom: 0%;
  // min-height: 469px;
  justify-content: flex-start;
  // background: green;
}
.left-and-right-parts {
  display: flex;
  flex-direction: row;
  // min-height: 502px;

  width: 100%;
  ::v-deep #left-part {
    width: 50%;
    padding-right: 3%;
    box-sizing: border-box;
  }
  ::v-deep #right-part {
    width: 50%;
    padding-left: 3%;
    box-sizing: border-box;
    img {
      width: 100%;
    }
  }
}
::v-deep .page-text {
  font-size: 1em;
  font-family: $noto;
  color: $darkGray;
}
::v-deep .top-text {
  font-size: 1em;
  font-family: $noto;
  color: $darkGray;
  // text-align: center;
}
</style>

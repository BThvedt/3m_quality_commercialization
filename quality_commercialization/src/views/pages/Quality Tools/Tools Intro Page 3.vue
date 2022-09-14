<template>
  <PageBase>
    <div id="tools-intro-three" class="page-container">
      <div class="page-container-inner">
        <div class="left-and-right-parts">
          <div id="top-part">
            <E :h="json.e_header" t="h1" class="bold-headline" />
            <E :h="json.e_text" t="div" class="page-text" />
          </div>
          <div id="bottom-part">
            <img
              :src="
                require(`@/assets/images/Quality/Tools/${json.pageImage}`)
                  .default
              "
            />
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

export default Vue.extend({
  name: "ToolsIntroOne",
  components: { PageBase, E },
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
}
.left-and-right-parts {
  display: flex;
  flex-direction: column;
  min-height: 502px;
  width: 100%;
  ::v-deep #top-part {
    // width: 50%;
    // padding-right: 3%;
    box-sizing: border-box;
  }
  ::v-deep #bottom-part {
    // width: 50%;
    // padding-left: 3%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 90%;
      position: relative;
      // top: 13%;
      // bottom: 5%;
    }
  }
}
::v-deep .page-text {
  font-size: 1em;
  font-family: $noto;
  color: $darkGray;
}
</style>

<template>
  <PageBase>
    <div id="tools-intro-two" class="page-container">
      <div class="page-container-inner">
        <div class="left-and-right-parts">
          <div id="left-part">
            <E :h="json.e_header" t="h1" class="bold-headline" />
            <E :h="json.e_text" t="div" class="page-text" />
          </div>
          <div id="right-part">
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
  name: "ToolsIntroTwo",
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
  flex-direction: row;
  min-height: 502px;
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
      position: relative;
      top: 15%;
      width: 100%;
    }
  }
}
::v-deep .page-text {
  font-size: 1em;
  font-family: $noto;
  color: $darkGray;
}
</style>

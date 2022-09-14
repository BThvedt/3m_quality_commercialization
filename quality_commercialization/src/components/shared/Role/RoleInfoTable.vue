<template>
  <div id="role-info">
    <transition
      :enter-active-class="`${TEnter.FADE_IN} ${TTimes.MEDIUM}`"
      :leave-active-class="`${TExit.FADE_OUT} ${TTimes.MEDIUM}`"
      mode="out-in"
    >
      <template v-for="(activity, index) in activities">
        <div
          class="table-container"
          v-if="selectedActivityIndex == index"
          :key="index"
        >
          <!-- <h2 v-html="activity.e_oneLineTitle" class="bold-headline" /> -->
          <E class="bold-headline" :h="activity.e_title" t="h2" />

          <div class="table-section">
            <template v-for="(deliverable, index) in activity.deliverables">
              <div
                class="deliverable-review-div"
                :class="`animate__animated animate__fadeIn delay-${index}`"
                :key="index"
              >
                <E class="small-headline" :h="deliverable.e_title" t="h2" />

                <E :h="deliverable.e_text" t="div" />
              </div>
            </template>
          </div>
        </div>
      </template>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { TEnter, TExit, TTimes, TAttnSeek } from "@/types"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "RoleInfoTable",
  data() {
    return {
      TEnter,
      TExit,
      TTimes,
    }
  },
  props: ["activities", "selectedActivityIndex"],
  components: { E },
})
</script>

<style scoped lang="scss">
#role-info {
  .table-container {
    margin-top: -3em;
    .bold-headline {
      margin: 0;
      padding-bottom: 4px;
      margin-bottom: 12px;
      border-bottom: 1px dotted $darkGray;
    }
    ::v-deep .deliverable-review-div {
      padding: 0em 0.5em;
      .small-headline {
        margin-top: 0;
        margin-bottom: 0;
      }
      p {
        margin: 1em 0.5em;
        font-family: "Noto Sans";
        font-style: italic;
        font-size: 1em;
        color: $darkGray;
        font-weight: bold;
      }
      ul {
        li {
          p {
            font-weight: normal;
            font-family: $noto;
            font-style: normal;
          }
        }
      }
      p,
      ul {
        font-size: 0.97em;
        // line-height: 1.18em;
        text-align: left;
      }
      ul {
        padding-left: 0.5em;
        margin-top: 0em;
        li {
          p {
            margin: 0.5em;
            margin-left: 0;
            margin-right: 0;
            margin-top: 0.5em;
          }
        }
      }
    }
  }
  .table-section {
    display: flex;
    .deliverable-review-div {
      width: 33%;
      padding-right: 1.5em;
    }
  }
  margin-top: 15px;
  margin-bottom: 15px;
  margin-top: 4%;
}
.delay-0 {
  animation-delay: 0s;
}
.delay-1 {
  animation-delay: 1s;
}
.delay-2 {
  animation-delay: 2s;
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .small-headline {
  h2 {
    font-size: 1em;
    margin: 0;
    padding: 0;
  }
}
</style>

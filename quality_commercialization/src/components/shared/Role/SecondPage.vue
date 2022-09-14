<template>
  <div id="second-page-wrapper" key="second-page">
    <div id="inner-box-shadow" :class="{ boxShadow: amountScrolled !== 0 }">
      <PerfectScrollbar @ps-scroll-y="onScroll">
        <div class="scrollable-div">
          <template v-for="(activity, index) in activities">
            <div
              class="table-container"
              :class="`container-${index}`"
              :key="index"
            >
              <E class="bold-headline" :h="activity.e_oneLineTitle" t="h2" />

              <div class="table-section">
                <template v-for="(deliverable, index) in activity.deliverables">
                  <div class="deliverable-review-div" :key="index">
                    <E class="small-headline" :h="deliverable.e_title" t="h2" />
                    <E :h="deliverable.e_text" t="div" />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </PerfectScrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { PerfectScrollbar } from "vue2-perfect-scrollbar"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "SecondPage",
  components: {
    PerfectScrollbar,
    E,
  },
  data() {
    return {
      amountScrolled: 0,
    }
  },

  methods: {
    onScroll(data: any, stuff: any) {
      this.amountScrolled = data.target.scrollTop
    },
  },
  props: ["activities"],
})
</script>

<style scoped lang="scss">
.scrollable-div {
  min-height: 1174px; // otherwise the scrollbar doesn't render right away.. this is about the height of the div give or take
}
#second-page-wrapper {
  margin-top: 0;
  width: calc(100% + 5px);
  overflow: hidden;
  .table-container {
    margin-top: -3em;
    .bold-headline {
      margin: 0;
      padding-bottom: 4px;
      margin-bottom: 10px;
      border-bottom: 1px dotted $darkGray;
    }
    ::v-deep .deliverable-review-div {
      padding: 0em 0.5em;
      .small-headline {
        margin-top: 0;
        margin-bottom: 0;
      }
      p {
        margin: 0.5em 0em;
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
        text-align: left;
      }
      ul {
        padding-left: 1.3em;
        li {
          margin-bottom: 0.5em;
        }
      }
    }
  }
  .table-section {
    display: flex;
    padding-top: 1em;
    .deliverable-review-div {
      width: 33%;
    }
  }

  #inner-box-shadow {
    transition: $fast-transition;
    &.boxShadow {
      box-shadow: inset -10px 6px 6px rgba(0, 0, 0, 0.1);
    }
    width: calc(100% + 20px);
    padding-right: 20px;
    box-sizing: border-box;
  }

  .table-container {
    margin-top: 0;
    border-bottom: 1px dotted $darkGray;
    padding-bottom: 20px;
    &:first-of-type {
      border-top: 1px dotted $darkGray;
    }
    &.container-3 {
      border-bottom: none;
    }
  }
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

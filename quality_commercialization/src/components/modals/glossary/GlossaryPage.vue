<template>
  <div>
    <ul>
      <li v-for="(term, index) in terms" :key="index">
        <!-- <p v-html="term.e_title" class="term-title" /> -->
        <E :h="term.e_title" t="p" class="term-title small-headline" />
        -&nbsp;
        <!-- <div v-html="term.e_text" class="term-text" /> -->
        <E :h="term.e_text" t="div" class="term-text" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"

export default Vue.extend({
  name: "GlossaryPage",
  components: { E },
  data() {
    return {}
  },
  props: ["terms"],
})
</script>

<style scoped lang="scss">
ul {
  margin: 0;
  padding: 0;
  column-count: 2;
  font-size: 0.85em;
  color: $darkGray;

  ::v-deep li {
    break-inside: avoid;
    -webkit-column-break-inside: avoid;
    page-break-inside: avoid;
    margin: 0.5em 0em;
    margin-bottom: 0.3em;
    vertical-align: top;
    line-height: 18px;
    page-break-inside: avoid;

    &:first-of-type {
      margin-top: 0em;
    }
    list-style: none;
    .term-title,
    .term-text,
    .term-text > p {
      display: inline;
      font-family: $noto;
      margin-bottom: 0.5em;
    }
    .term-title {
      font-weight: bold;
    }
    .term-text {
      p {
        margin-bottom: 0.5em;
      }
      ul {
        margin-top: 0.5em;
      }
      ul li {
        margin: 0;
        padding: 0;
        list-style: disc;
        vertical-align: top;
        line-height: 18px;
        page-break-inside: avoid;
      }
      ul li p {
        margin: 0;
        padding: 0;
        font-family: $noto;
      }
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .small-headline {
  div,
  p {
    margin: 0;
    padding: 0;
    display: inline;
  }
}

// ::v-deep .term-text {
//   div {
//     margin: 0;
//     padding: 0;
//     display: inline;
//   }
// }
</style>

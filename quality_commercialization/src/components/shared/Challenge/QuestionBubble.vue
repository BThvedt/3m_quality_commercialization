<template>
  <div class="question-text">
    <font-awesome-icon
      class="word-bubble-x"
      icon="times"
      @click="emitCloseEvent"
      v-if="closeable"
    />
    <E class="prompt-text" :h="prompt" t="p" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import E from "@/components/editable/E.vue"
export default Vue.extend({
  name: "CoachImg",
  components: { E },
  methods: {
    emitCloseEvent() {
      this.$emit("close")
    },
  },
  props: ["closeable", "prompt"],
})
</script>

<style scoped lang="scss">
.question-text {
  padding: 1em;
  outline: 1px solid $lightGray;
  box-shadow: $box-shadow;
  box-sizing: border-box;
  background: white;
  &.feedback {
    // padding-bottom: 3.5em;
    .sub-headline {
      padding: 0;
      margin: 0;
    }
    &.correct {
      .sub-headline {
        color: $correct;
      }
    }
    &.incorrect {
      .sub-headline {
        color: $incorrect;
      }
    }
  }
  p {
    font-family: $noto;
    text-align: left;
    margin: 0;
    padding: 0;
  }
  &::after {
    content: "";
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 20px solid white;
    display: block;
    position: absolute;
    top: -20px;
    left: 75px;
    display: block;
    position: absolute;

    transform: skewX(20deg);
  }
  &::before {
    content: "";
    border-left: 17px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 23px solid #e2e2e2;
    display: block;
    position: absolute;
    top: -23px;
    left: 73px;
    transform: skewX(20deg);
  }
  .word-bubble-x {
    position: absolute;
    right: 0.5em;
    top: 0.5em;
    cursor: pointer;
    color: $mediumGray;
    transition: $very-fast-transition;
    &:hover {
      color: black;
    }
  }
}
// fixes for editing - it's ok changing strategy next iteration
::v-deep .prompt-text {
  p {
    font-family: $noto;
    text-align: left;
    margin: 0;
    padding: 0;
  }
}
</style>

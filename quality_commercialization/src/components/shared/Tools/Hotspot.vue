<template>
  <g>
    <polygon
      ref="thepolygon"
      v-if="shapeName == 'poly'"
      style="
        fill: transparent;
        stroke: white;
        stroke-width: 0;
        fill-rule: evenodd;
      "
      target=""
      alt=""
      title=""
      href=""
      :points="points"
      shape="poly"
      @mouseover="mouseOverFunction"
      @mouseleave="mouseLeaveFunction"
      @click="clickFunction"
      :class="{
        clicked: hasBeenClicked,
        hovering: isBeingHovered,
        alreadySelected: alreadySelected,
      }"
    />
    <rect
      ref="theShape"
      alt=""
      title=""
      href=""
      v-if="shapeName == 'rect'"
      style="
        fill: transparent;
        stroke: white;
        stroke-width: 0;
        fill-rule: evenodd;
      "
      target=""
      shape="rect"
      :width="rectData.width"
      :height="rectData.height"
      :x="rectData.x"
      :y="rectData.y"
      @mouseover="mouseOverFunction"
      @mouseleave="mouseLeaveFunction"
      @click="clickFunction"
      :class="{
        clicked: hasBeenClicked,
        hovering: isBeingHovered,
        questionAnswered: hotSpotQuestionAnswered,
        alreadySelected: alreadySelected,
      }"
    />
  </g>
</template>

<script>
import Vue from "vue"

export default Vue.extend({
  name: "Hotspot",
  data() {
    return {
      shapeName: "poly", // default is poly
      hasBeenClicked: false,
      isBeingHovered: false,
      rectData: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    }
  },

  computed: {
    items() {
      return this.$store.state.items
    },
    currentImg() {
      return this.image
    },
  },
  methods: {
    mouseOverFunction() {
      if (!this.hotSpotQuestionAnswered) {
        this.$emit("currentlyHovered", this.id)
        this.isBeingHovered = true
      }
    },
    mouseLeaveFunction() {
      this.$emit("notHoveredAnymore", this.id)
      this.isBeingHovered = false
    },
    clickFunction() {
      if (!this.hasBeenClicked && !this.hotSpotQuestionAnswered) {
        this.$emit("clicked", { index: this.index })
        this.hasBeenClicked = true
      }
    },
    setClicked() {
      this.hasBeenClicked = true
    },
  },
  watch: {
    hotSpotResetCounter(nv, ov) {
      this.hasBeenClicked = false
    },
    hotSpotQuestionAnswered(nv, ov) {
      if (!nv) {
        this.hasBeenClicked = false
      }
    },
  },
  mounted() {
    if (this.typeOfShape) {
      switch (this.typeOfShape) {
        case "rect":
          this.shapeName = "rect"
          // split up the points
          var pointsArray = this.points.split(",").map((x) => parseInt(x))
          // convert the strings to integers
          this.rectData.x = pointsArray[0]
          this.rectData.y = pointsArray[1]

          // the array should have four numbers
          // no need to get fancy with the code

          this.rectData.width = pointsArray[2] - pointsArray[0]
          this.rectData.height = pointsArray[3] - pointsArray[1]

          console.log(this.rectData)
          break
        case "whateverElse":
          this.shapeName = this.typeOfShape
          break
        default:
          this.shapeName = "poly"
          break
      }
    }
  },
  components: {},
  props: [
    "points",
    "index",
    "typeOfShape",
    "hotSpotResetCounter",
    "hotSpotQuestionAnswered",
    "alreadySelected",
  ],
})
</script>

<style lang="scss" scoped>
g {
  position: relative;
  polygon,
  rect {
    position: absolute;
    z-index: 1;
    cursor: pointer;
    &.this-is-done {
      cursor: default;
    }
    &.hovering {
      fill: rgba(227, 111, 30, 1) !important;
      opacity: 0.6;
    }
    stroke: #014a63 !important;
    stroke-width: 3px !important;

    &.questionAnswered {
      cursor: default;
      display: none;
    }
    &.clicked {
      stroke: #e36f1e !important;
      fill: rgba(227, 111, 30, 0.5) !important;
      opacity: 1 !important;
      &.questionAnswered {
        display: inherit;
      }
    }
    &.alreadySelected {
      stroke: #00b432 !important;
      fill: rgba(28, 178, 59, 0.5) !important;
    }
  }
  image {
    position: absolute;
    z-index: 0;
  }
}
</style>

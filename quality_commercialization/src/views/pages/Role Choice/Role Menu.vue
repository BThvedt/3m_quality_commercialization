<template>
  <PageBase>
    <div id="starting-menu-page" class="page-container">
      <div class="page-container-inner">
        <div class="top-and-bottom-parts">
          <div id="top-part">
            <img
              id="logo-img"
              :src="require('@/assets/images/shared/3M_188x100.png').default"
            />

            <E t="h1" class="bold-headline" :h="json.e_title" />
            <E t="h1" class="bold-headline" :h="json.e_roleText" />

            <div>
              <!-- <h2 class="sub-headline">{{ json.subTitle }}</h2> -->
              <E t="h2" class="sub-headline" :h="json.e_subTitle" />
            </div>
          </div>

          <div id="bottom-part">
            <div
              class="menu-item"
              :class="` ${mousDownIndex === i ? 'shrink' : ''}  `"
              v-for="(section, i) in sectionData"
              :key="section.section"
              @click="navigate(section.section, section.role)"
              @mousedown="() => (mousDownIndex = i)"
              @mouseup="() => (mousDownIndex = -1)"
              @mouseleave="() => (mousDownIndex = -1)"
            >
              <div class="gradient-overlay"></div>

              <img
                :src="
                  require(`@/assets/images/Role Menu/${section.image}`).default
                "
              />

              <h2
                class="small-headline section-headline"
                v-html="section.title"
              ></h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageBase>
</template>

<script lang="ts">
import Vue from "vue"
import PageBase from "@/components/PageBase.vue"
import { CommercializationRole } from "@/store/meta/types"
import E from "@/components/editable/E.vue"

// import Icon from "@/components/Icon.vue"

export default Vue.extend({
  name: "Menu",
  components: { PageBase, E },
  data() {
    return {
      mousDownIndex: -1,
      sectionData: this.json.sectionData,
    }
  },
  mounted() {
    // this.$store.dispatch("meta/setLastLocation", {
    //   sectionId: "K4y6hHHz",
    //   pageId: "LpM4b3Tv",
    // })

    // set the last location to here when the user goes here
    this.$store.dispatch("meta/setLastLocation", {
      sectionId: "Hx5Dxudy",
      pageId: "8U9NajQt",
    })

    this.$store.commit("meta/setRole", "")
  },
  methods: {
    navigate(index: number, role: CommercializationRole) {
      // this.$store.commit("meta/setRole", role)
      // this.$store.dispatch("meta/goToPage", {
      //   sectionIndex: index,
      //   pageIndex: 0,
      // })
      this.$store.commit("meta/setRole", "quality")
      this.$store.dispatch("meta/goToPage", {
        sectionIndex: 1,
        pageIndex: 0,
      })
    },
  },

  props: ["json"],
})
</script>

<style scoped lang="scss">
#starting-menu-page {
  .page-container-inner {
    max-height: 100%;
    box-sizing: border-box;
    // display: flex;
    // flex-direction: column;
    padding-bottom: 0%;
    display: block;

    #top-part {
      width: 100%;
      margin-top: 2em;
      h1 {
        margin: 0.5em 0em;
        text-align: center;
      }
      #logo-img {
        position: absolute;
        width: 100px;
      }
      .sub-headline {
        text-align: center;
      }
    }

    .top-and-bottom-parts {
      height: 100%;
      #top-part {
        ::v-deep .top-part-info {
          font-family: $noto;
          color: $darkGray;
          font-size: 1em;
          p:first-of-type {
            margin-top: 0;
          }
        }
      }
      #bottom-part {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-wrap: wrap;
        height: 66%;
        margin-top: 2%;
        .menu-item {
          width: 32%;
          flex-direction: column;
          margin-bottom: 15px;
          object-fit: contain;
          position: relative;
          color: white;
          cursor: pointer;
          font-family: $roboto;
          overflow: hidden;
          .gradient-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            transition: $very-fast-transition;
            background: rgb(255, 0, 0);
            background: linear-gradient(
              180deg,
              rgba(255, 0, 0, 0) 30%,
              rgba(0, 0, 0, 0.5) 100%
            );
          }

          img {
            position: absolute;
            filter: brightness(1.1) contrast(30%) grayscale(100%);
            transition: $very-fast-transition;
          }
          &.highlit {
            img {
              filter: brightness(0.6);
            }
          }
          &.locked {
            &:hover {
              cursor: default;
              img {
                filter: brightness(1.1) contrast(30%) grayscale(100%);
              }
            }
          }
          &:hover {
            img {
              filter: brightness(0.9);
              transform: scale(1.05);
            }
            .gradient-overlay {
              opacity: 0.5;
            }
          }
          h2,
          .icon-thing {
            position: relative;
            color: white;
            fill: white;
            font-family: $roboto;
            font-size: 1.1em;
            position: absolute;
            bottom: 10px;
            z-index: 20;
          }
          display: flex;
          align-items: center;
          flex-direction: column;
          transition: $very-fast-transition;

          &.shrink {
            transform: scale(0.95);
          }
          .section-headline {
            text-align: center;
            text-shadow: $box-shadow;
            text-shadow: 0px 2px 3px rgba(0, 0, 0, 0.35);
          }
        }
        .icon-thing {
          width: 40px;
          height: 40px;
          &.check {
            width: 50px;
            height: 50px;
          }
        }
      }
    }
  }
}

// fixes for editing - it's ok changing strategy next iteration
::v-deep .bold-headline h1,
::v-deep .sub-headline h2 {
  font-size: 1em;
  text-align: center;
}
</style>

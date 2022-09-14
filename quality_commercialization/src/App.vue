<template>
  <div class="module-app-container" @click="bodyClicked">
    <div id="app">
      <div
        id="stage"
        :style="{ ...screenDimensions }"
        v-if="mounted && showStage"
        :class="theSpecialPageClass"
      >
        <!-- put menu here -->
        <transition
          :enter-active-class="'animate__animated animate__fadeIn'"
          :leave-active-class="'animate__animated animate__fadeOut'"
        >
          <div v-if="jsonLoaded && true">
            <transition
              name="nav-transition"
              :enter-active-class="transitionEnterClass"
              :leave-active-class="transitionLeaveClass"
            >
              <router-view />
            </transition>
          </div>
          <div id="lesson-loading" v-else>
            <h1 class="animate__animated animate__fadeIn">Loading...</h1>
          </div>
        </transition>

        <img
          id="top-image"
          :src="require('@/assets/images/shared/gradient-bar.png').default"
        />

        <ResourcesMenu @glossaryClicked="showGlossary" />

        <TopRightButtons />

        <!-- <Navigation /> -->

        <!-- <NavMenu @showGlossary="showGlossary" /> -->

        <ContinueModal
          :show="continueModalShow"
          @onClose="handleContinueClose"
        />

        <GlossaryModal ref="glossaryModal" />

        <transition
          :enter-active-class="`${TEnter.FADE_IN} one-sec-delay`"
          :leave-active-class="TExit.FADE_OUT"
        >
          <div
            @click="goToNextPage"
            id="continue-container"
            v-if="currentPageData.showContinue && !onHiddenPage"
          >
            <div class="continue-button small-button">
              <strong>Continue</strong>
            </div>
          </div>
        </transition>

        <transition
          :enter-active-class="`${TEnter.FADE_IN} `"
          :leave-active-class="TExit.FADE_OUT"
        >
          <div
            @click="goToPrevPage"
            id="back-container"
            v-if="currentPageData.showBack && !onHiddenPage"
          >
            <div class="back-button small-button">
              <strong>Back</strong>
            </div>
          </div>
        </transition>
      </div>

      <FloatingControls />
    </div>
    <JiraButton />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
// import Navigation from "./components/Navigation/Navigation.vue"
// import NavMenu from "@/components/Menu/NavMenu.vue"
import router from "./router"
import { RouteActions, Section } from "./store/meta/types"
import ContinueModal from "@/components/modals/ContinueModal.vue"
import { TEnter, TExit } from "@/types"
import { bigConsoleLog } from "./lib/randomFunctions"
import FloatingControls from "@/components/editable/FloatingControls.vue"
import GlossaryModal from "@/components/modals/GlossaryModal.vue"
import TopRightButtons from "@/components/TopRightButtons/TopRightButtons.vue"
import ResourcesMenu from "@/components/TopRightButtons/ResourcesMenu.vue"
import JiraButton from "@/components/JiraButton.vue"

/**
 * node . --path="../../3M/3M Quality Commercialization/quality_commercialization" --endpoint=local
 * node . --path="../../3M/3M Quality Commercialization/quality_commercialization" --endpoint=live --email=sadmin@mpemail.com --password=Song2!2Montage?2Skirmish
 */

// oh yeah gotta change app

// dynamically load all the json up front
// keyis sectionId/pageId .. value is json
// it becomes a computed value in page wrapper
// passed to the page object
// jsonPath is an env variable
// how to destructure .. just call it json?
// make the prop say 't="json.e_xxx"' that's particular enough that a script can remove the 'e_' for the final build from both the Json and the templates
// ultimate goal is just to replace all <T t="json.e_xxx"> components with just {{json.xxx}}
// ok. Goal is to do this.. then make invoices

const transitions = {
  sectionForward: {
    enter: `${TEnter.BACK_IN_RIGHT} big-box-shadow`,
    leave: `${TExit.BACK_OUT_LEFT} big-box-shadow`,
  },
  sectionBackward: {
    enter: `${TEnter.BACK_IN_LEFT} big-box-shadow`,
    leave: `${TExit.BACK_OUT_RIGHT} big-box-shadow`,
  },
  pageForward: {
    enter: TEnter.SLIDE_IN_RIGHT,
    leave: TExit.SLIDE_OUT_LEFT,
  },
  pageBackward: {
    enter: TEnter.SLIDE_IN_LEFT,
    leave: TExit.SLIDE_OUT_RIGHT,
  },
  jumpToPage: {
    enter: TEnter.BACK_IN_RIGHT,
    leave: TExit.BACK_OUT_LEFT,
  },
  goingBackHome: {
    enter: TEnter.BACK_IN_LEFT,
    leave: TExit.BACK_OUT_RIGHT,
  },
  jumpToHiddenPage: {
    enter: TEnter.FADE_IN,
    leave: TExit.FADE_OUT,
  },
  returnFromHiddenPage: {
    enter: TEnter.FADE_IN,
    leave: TExit.FADE_OUT,
  },
}

export default Vue.extend({
  //components: { Navigation, ContinueModal },

  name: "App",
  data() {
    return {
      mounted: false,
      continueModalShow: false,
      // test to see if section is greater!
      transitionEnterClass: "",
      transitionLeaveClass: "",
      theSpecialPageClass: "",
      currentPageData: {},
      interval: null as number | null,
      showStage: false,
      parentOrigin: "",
      glossaryShowing: false,
      // variables for module_portal
      partsLoaded: {
        text: false,
        files: false,
      },
      TEnter,
      TExit,
    }
  },

  async mounted() {
    //await this.$store.dispatch("meta/loadMeta")

    await this.$store.dispatch("initialize")

    bigConsoleLog("Initialization Complete!")

    const moduleData = this.$store.getters["meta/getStoreBasicModuleInfo"]

    if (moduleData.resumed) {
      const lastLocation = this.$store.getters["meta/getLastLocation"]
      const firstPageRoute = this.$store.getters["meta/getFirstPageRoutePath"]

      if (lastLocation !== firstPageRoute) {
        this.continueModalShow = true // do you want to go to your last location?
      }
    }

    /*** --- Remove for delivery --- ***/

    if (process.env.VUE_APP_EDITABLE_TEXT === "true") {
      window.addEventListener("keydown", this.handleKeyPress)
      window.addEventListener("keyup", this.handleKeyUp)
    }

    // eh.. just do this every time .. in fact.. might want to move this to 'init'
    // alert("start here before going onto non navigatbale pages")
    // if (process.env.VUE_APP_RUN_MODE === "local_keyed") {
    //   // alright. Name this better 'load local keyed json' or something and use VUE_APP_JSON_PATH in the function..
    //   console.log("loading local keyed json")
    //   await this.$store.dispatch("editableText/loadLocalKeyedJson")
    // }

    if (process.env.VUE_APP_RUN_MODE === "module_portal") {
      console.log("posting message to parent window")
      parent.postMessage(
        {
          type: "ready",
          data: {
            message: "okReady",
          },
        },
        "*"
      )

      this.showStage = false

      window.onmessage = null
      window.addEventListener("message", async (event) => {
        if (event.data.type === "readyRecieved") {
          console.log(
            `Ready recieved, setting parent origin to ${this.parentOrigin}`
          )

          this.parentOrigin = event.data.parentOrigin
          this.$store.dispatch(
            "editableText/setParentOrigin",
            this.parentOrigin
          )

          // now that we have the origin, signal that we're read for text data
          parent.postMessage(
            {
              type: "message",
              data: {
                message: "readyForData",
              },
            },
            this.parentOrigin
          )
        } else if (event.origin === this.parentOrigin) {
          //await this.$store.dispatch("editableText/loadSavedJson")
          switch (event.data.type) {
            case "textData":
              await this.$store.dispatch(
                "editableText/loadSavedJson",
                event.data.textData
              )
              this.partsLoaded = { ...this.partsLoaded, text: true }

              if (this.partsLoaded.text && this.partsLoaded.files) {
                this.showStage = true
              }
              // this.showStage = true // don't want to render the stage before I get text in
              break
            case "pageData":
              this.partsLoaded = { ...this.partsLoaded, files: true }

              console.log("GETTING MODULE JSON PAGES GETTING MODULE JSON PAGES")
              // gotta take care of a few things here which otherwise are done in router
              await this.$store.dispatch(
                "meta/loadPagesFromModulePortal",
                event.data.pageData
              )

              this.$store.commit("meta/initRouter")

              bigConsoleLog("done initing router")

              if (this.partsLoaded.text && this.partsLoaded.files) {
                this.showStage = true
              }
              break
            default:
              bigConsoleLog(
                `ERROR.. recieved event from module editor with type "${event.data.type}" - which is an unknown type!`
              )
              break
          }
        }
      })

      /*** --- End remove for delivery --- ***/
    } else {
      this.showStage = true
    }

    this.mounted = true

    bigConsoleLog("mounted complete")
  },
  computed: {
    screenDimensions: {
      get(): { width: string; height: string } {
        let { width, height } = this.$store.getters["meta/getScreenDimensions"]
        return { width: `${width}px`, height: `${height}px` }
      },
    },
    currSectionNum(): number {
      return this.$store.state.meta.currSection
    },
    currSection(): Section {
      return this.$store.getters["meta/getCurrentSection"]
    },
    currPageNum(): number {
      return this.$store.state.meta.currPage
    },
    currentPageId(): string {
      return this.$store.getters["meta/getCurrentPageId"]
    },
    routeAction(): RouteActions {
      return this.$store.getters["meta/getRouteAction"]
    },
    readyToEdit(): boolean {
      return this.$store.getters["editableText/getReadyToEdit"]
    },
    jsonLoaded(): boolean {
      // if (this.$store.getters["json/jsonLoaded"]) {
      //   bigConsoleLog("JSON LOADED")
      // }
      return this.$store.getters["meta/jsonLoaded"]
    },
    top(): number {
      // console.log(
      //   `top is ${this.$store.getters["editableText/getEditorPosition"]}`
      // )
      // return 10
      return this.$store.getters["editableText/getEditorPosition"]?.top
    },
    left(): number {
      // return 20
      return this.$store.getters["editableText/getEditorPosition"]?.left
    },
    onHiddenPage(): boolean {
      return this.$store.getters["meta/isOnHiddenPage"]
    },
  },
  methods: {
    goToNextPage() {
      this.$store.dispatch("meta/goForward")
    },
    goToPrevPage() {
      this.$store.dispatch("meta/goBackward")
    },
    showGlossary() {
      // this.glossaryShowing = true
      ;(this.$refs["glossaryModal"] as any).show()
    },
    handleContinueClose(shouldContinue: boolean) {
      this.continueModalShow = false

      if (shouldContinue) {
        // I think currently the initialize function loads this page by default ..
        // wonder if that is best behavior or if it should load 1st page by default
        // would have to manually just push the 1st page without mutating last locaiotn
        // and then if not continue.. mutate the last location to the first page then
        const lastLocation = this.$store.getters["meta/getLastLocation"]

        this.$store.dispatch("meta/goToPath", lastLocation)
      } else {
        this.$store.dispatch("meta/goToPage", { sectionIndex: 0, pageIndex: 0 })
      }
    },
    handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Control" && !this.readyToEdit) {
        this.$store.dispatch("editableText/readyToEdit")
      }
    },
    handleKeyUp(e: KeyboardEvent) {
      if (e.key === "Control") {
        this.$store.dispatch("editableText/stopEditing")
      }
    },
    bodyClicked(e: KeyboardEvent) {
      console.log("ive been clicked")
      // let moduleEditorDomain =
      //   this.$store.getters["editableText/getModuleEditorDomain"]
      // parent.postMessage(
      //   {
      //     type: "clicked",
      //     data: {
      //       message: "iveBeenClicked",
      //     },
      //   },
      //   moduleEditorDomain
      // )
      if (process.env.VUE_APP_RUN_MODE === "module_portal") {
        parent.postMessage(
          {
            type: "clicked",
            data: {
              message: "iveBeenClicked",
            },
          },
          this.parentOrigin
        )
      }
    },
  },
  watch: {
    currentPageId(newval): void {
      if (newval === "9Mq8Y4Hv" || newval === "xAtc7ozA") {
        setTimeout(() => {
          this.theSpecialPageClass =
            this.$store.getters["meta/getPageSpecialClass"]
        }, 1000)
      } else {
        this.theSpecialPageClass =
          this.$store.getters["meta/getPageSpecialClass"]
      }

      console.log("CHANGING PAGE")
      console.log(this.$store.getters["meta/getPageData"])

      // takes a second to go to the page.. and the only thing I really use it for is
      // to show the continue button, so I'll just use a set timeout

      // UPDATE: I want back buttons to show right away
      // luckily this doesn't create any problems.. it should work
      // this.currentPageData = this.$store.getters["meta/getPageData"]

      this.$nextTick(() => {
        this.currentPageData = this.$store.getters["meta/getPageData"]
      })

      // let currentPageData = this.$store.getters["meta/getPageData"]

      // if (currentPageData?.showBack) {
      //   this.currentPageData = this.$store.getters["meta/getPageData"]
      // } else if (currentPageData?.showContinue) {
      //   setTimeout(() => {
      //     this.currentPageData = this.$store.getters["meta/getPageData"]
      //   }, 1000)
      // } else {
      //   // if th econtinue button is going away though, do it immediately
      //   this.currentPageData = this.$store.getters["meta/getPageData"]
      // }
    },
    routeAction(to, from): void {
      switch (to) {
        case RouteActions.PAGING_FORWARD:
          this.transitionEnterClass = transitions.pageForward.enter
          this.transitionLeaveClass = transitions.pageForward.leave
          break
        case RouteActions.PAGING_BACKWARD:
          this.transitionEnterClass = transitions.pageBackward.enter
          this.transitionLeaveClass = transitions.pageBackward.leave
          break
        case RouteActions.GOING_TO_NEXT_SECTION:
          this.transitionEnterClass = transitions.sectionForward.enter
          this.transitionLeaveClass = transitions.sectionForward.leave
          break
        case RouteActions.GOING_TO_PREV_SECTION:
          this.transitionEnterClass = transitions.sectionBackward.enter
          this.transitionLeaveClass = transitions.sectionBackward.leave
          break
        case RouteActions.JUMPING_TO_PAGE:
          this.transitionEnterClass = transitions.jumpToPage.enter
          this.transitionLeaveClass = transitions.jumpToPage.leave
          break
        case RouteActions.GOING_BACK_HOME:
          this.transitionEnterClass = transitions.goingBackHome.enter
          this.transitionLeaveClass = transitions.goingBackHome.leave
          break
        case RouteActions.GOING_TO_HIDDEN_PAGE:
          this.transitionEnterClass = transitions.jumpToHiddenPage.enter
          this.transitionLeaveClass = transitions.jumpToHiddenPage.leave
          break
        case RouteActions.RETURNING_FROM_HIDDEN_PAGE:
          this.transitionEnterClass = transitions.returnFromHiddenPage.enter
          this.transitionLeaveClass = transitions.returnFromHiddenPage.leave
          break
      }
    },
  },
  components: {
    // Navigation,
    // NavMenu,
    TopRightButtons,
    ContinueModal,
    FloatingControls,
    // GlossaryModal,
    ResourcesMenu,
    JiraButton,
    GlossaryModal,
  },
})
</script>

<style lang="scss">
#jira-button {
  box-shadow: $box-shadow;
  margin-top: 2em;
}
.module-app-container {
  padding-top: 3vh;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #c6c6c6;
  box-sizing: border-box;
}

#app {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
#stage {
  position: relative;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  background: #f5f5f5;
  border-radius: 2px;
  #top-image {
    position: absolute;
    width: 100%;
    z-index: 1001;
  }
}
#lesson-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#continue-container {
  z-index: 0;
  position: absolute;
  right: 2em;
  bottom: 1.2em;
}
#back-container {
  z-index: 0;
  position: absolute;
  left: 2em;
  bottom: 1.2em;
}
.one-sec-delay {
  animation-delay: 1s;
}
</style>

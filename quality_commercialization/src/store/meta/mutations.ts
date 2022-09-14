import { MutationTree } from "vuex"
import {
  MetaState,
  Size,
  Section,
  RouteActions,
  SpecialPages,
  SuspendedData,
  ModuleData,
  UserData,
  FakeLoadingTimes,
  NavStatus,
  MenuStatus,
  SpecialPageStatus,
} from "./types"
import router from "@/router"
import { bigConsoleLog } from "@/lib/randomFunctions"
import scorm from "@/scorm"
import { ScormStatusString } from "@/types"

export const mutations: MutationTree<MetaState> = {
  setLastPageVisited(state, payload: string) {
    console.log("SETTING LAST PAGE VISITED {}{}{}{}{}{{}{}}{")
    state.lastPageVisited = payload
  },
  incrementTicker(state) {
    state.bodyClickedTicker += 1
  },
  setRole(state, payload) {
    state.scorm.suspendedData.currentRole = payload
  },
  setSectionLoaded(state, payload: string) {
    const sectionId = payload
    const index = state.sections.findIndex(
      (section) => section.id === sectionId
    )
  },
  setFakeLoadingTimes(state, payload: FakeLoadingTimes) {
    // console.log("Fake loading times - to implement later")
    //state.fakeLoadingTimes = payload
  },
  setSizes(state, payload: Size[]) {
    state.sizes = payload
  },
  setSections(state, payload: Section[]) {
    state.sections = payload
  },
  setCurrSize(state, payload: Size) {
    state.currSize = payload
  },
  setRouteAction(state, payload: RouteActions) {
    state.routeAction = payload
  },
  setSpecialPages(state, payload: SpecialPages) {
    state.specialPages = payload
  },
  setSuspendedData(state, payload: SuspendedData) {
    state.scorm.suspendedData = payload
  },
  loadModule(state, payload: ModuleData) {
    state.scorm.module = payload
  },
  setModuleRawScore(state, payload: number) {
    state.scorm.module.score.raw = payload
  },
  setModuleStatus(state, payload: ScormStatusString) {
    state.scorm.module.moduleStatus = payload
  },

  setUser(state, payload: UserData) {
    state.scorm.user = payload
  },
  setAllowedPaths(state, payload: string[]) {
    state.allowedPaths = payload
  },
  initRouter(state) {
    const { sections } = state

    const allowedPaths: string[] = []
    sections.forEach((section: Section) => {
      const { pages, hiddenPages } = section
      pages.forEach((page) => {
        allowedPaths.push(`/${section.id}/${page.id}`)

        router.addRoute({
          path: `/${section.id}/${page.id}`,
          /* eslint-disable */
          component: require(`@/views/pages/${section.name}/${page.name}.vue`)
            .default,
          props: {
            path: `/${section.id}/${page.id}`,
            json: state.jsonData[`/${section.id}/${page.id}`],
          },
        })
      })

      hiddenPages?.forEach((hiddenPage) => {
        allowedPaths.push(`/${section.id}/${hiddenPage.id}`)

        router.addRoute({
          path: `/${section.id}/${hiddenPage.id}`,
          /* eslint-disable */
          component:
            require(`@/views/pages/${section.name}/${hiddenPage.name}.vue`)
              .default,
          props: {
            path: `/${section.id}/${hiddenPage.id}`,
            json: state.jsonData[`/${section.id}/${hiddenPage.id}`],
          },
        })
      })
    })
  },
  goToNextPage(state, p): void {
    const { currSection, currPage } = state
    let nextPage = 1

    // hidden pages can't go back and forth in a normal way
    state.isOnHiddenPage = false

    const newCurrPage = currPage + 1

    state.currPage = newCurrPage

    router.push(
      `/${state.sections[currSection].id}/${state.sections[currSection].pages[newCurrPage].id}`
    )
  },
  goToPrevPage(state, p): void {
    const { currSection, currPage } = state
    const newCurrPage = currPage - 1
    state.currPage = newCurrPage

    // hidden pages can't go back and forth in a normal way
    state.isOnHiddenPage = false

    router.push(
      `/${state.sections[currSection].id}/${state.sections[currSection].pages[newCurrPage].id}`
    )
  },
  goToHiddenPage(state, payload): void {
    const { currSection } = state
    let { pageName } = payload
    state.isOnHiddenPage = true

    let theHiddenPage = state.sections[currSection].hiddenPages?.find(
      (hiddenPage) => {
        return hiddenPage.name === pageName
      }
    )

    if (!theHiddenPage) {
      console.error(
        `Sorry there is no page with the name ${pageName} in this section`
      )
      return
    }

    let { id: pageId } = theHiddenPage

    if (!pageId) {
      return
    }

    router.push(`/${state.sections[currSection].id}/${pageId}`)
  },
  returnFromHiddenPage(state): void {
    const { currSection, lastPageVisited } = state

    if (!lastPageVisited) {
      console.error(
        `You're attempting to return from a hidden page but there is no last Page!!`
      )
      return
    }
    state.isOnHiddenPage = false

    console.log("Returning from hidden page and LAST PAGE IS")
    console.log(lastPageVisited)

    router.push(lastPageVisited)
  },
  goToNextSection(state, p): void {
    const { currSection } = state
    const newCurrSection = currSection + 1
    state.currSection = newCurrSection
    state.currPage = 0

    // hidden pages can't go back and forth in a normal way
    state.isOnHiddenPage = false

    router.push(
      `/${state.sections[newCurrSection].id}/${state.sections[newCurrSection].pages[0].id}`
    )
  },
  goToPrevSection(state, p): void {
    const { currSection } = state
    const newCurrSection = currSection - 1
    const newCurrPage = state.sections[newCurrSection].pages.length - 1
    state.currSection = newCurrSection
    state.currPage = newCurrPage

    // hidden pages can't go back and forth in a normal way
    state.isOnHiddenPage = false

    router.push(
      `/${state.sections[newCurrSection].id}/${state.sections[newCurrSection].pages[newCurrPage].id}`
    )
  },
  goToSection(state, payload: string | number) {
    console.log("TODO: write mutation")
  },
  setLastLocation(state, payload: string): void {
    state.scorm.module.lastLocation = payload
  },
  setCurrPageAndCurrSecForPath(state, payload: string): void {
    // we have a path that looks like /sectionId/pageId
    let [sectionId, pageId] = payload.split("/").slice(1)
    let newCurrPage: number | undefined

    let newCurrSection = state.sections.findIndex(
      (section) => section.id === sectionId
    )
    if (newCurrSection === -1) {
      throw new Error("setCurrPageAndCurrSecForPath: section not found")
    }

    newCurrPage = state.sections[newCurrSection].pages.findIndex(
      (page) => page.id === pageId
    )

    if (newCurrPage === -1) {
      newCurrPage = state.sections[newCurrSection].hiddenPages?.findIndex(
        (page) => page.id === pageId
      )

      if (newCurrPage !== -1) {
        state.isOnHiddenPage = true
      }
    }

    if (typeof newCurrPage === "undefined" || newCurrPage === -1) {
      throw new Error("setCurrPageAndCurrSecForPath: page not found")
    }

    state.currSection = newCurrSection
    state.currPage = newCurrPage
  },
  setAndGoToSectionAndPage(
    state,
    payload: { sectionIndex: number; pageIndex: number }
  ): void {
    let { sectionIndex, pageIndex } = payload
    state.currSection = sectionIndex
    state.currPage = pageIndex

    let { id: sectionId } = state.sections[sectionIndex]
    let { id: pageId } = state.sections[sectionIndex].pages[pageIndex]

    // hidden pages don't work with the nav in a normal way
    state.isOnHiddenPage = false

    router.push(`/${sectionId}/${pageId}`)
  },
  setNavStatus(state, payload: Partial<NavStatus>) {
    let { navStatus } = state
    state.navStatus = {
      ...navStatus,
      ...payload,
    }
  },
  setMenuStatus(state, payload: Partial<MenuStatus>) {
    let { menuStatus } = state
    state.menuStatus = {
      ...menuStatus,
      ...payload,
    }
  },
  setSpecialPageStatus(state, payload: SpecialPageStatus) {
    state.specialPageStatus = payload
  },
  unlockSection(state, payload: number) {
    const sectionIndex = payload
  },
  addJson(state, { path, json }) {
    // console.log({ path, json })
    state.jsonData[path] = json
  },
  loadExtraJson(state, { propertyName, extra_json }) {
    const extraJson = { ...state.extraJson, [propertyName]: extra_json }

    state.extraJson = extraJson

    bigConsoleLog("Extra Json Is Loaded")
  },
  jsonLoaded(state, isLoaded) {
    state.jsonLoaded = isLoaded
  },
}

import { ScormStatusString } from "@/types"
import { GetterTree } from "vuex"
import { RootState } from "../types"
import {
  MetaState,
  RouteActions,
  Section,
  SpecialPageStatus,
  NavStatus,
  MenuStatus,
  ModuleData,
  SuspendedData,
  UserData,
  ScormScore,
  CommercializationRole,
} from "./types"

export const getters: GetterTree<MetaState, RootState> = {
  isOnHiddenPage(state) {
    return state.isOnHiddenPage
  },
  getLastPageVisited(state) {
    return state.lastPageVisited
  },
  getScreenDimensions(state): { width: number; height: number } {
    if (state.currSize) {
      const { width, height } = state.currSize
      return { width, height }
    } else {
      return {
        width: 0,
        height: 0,
      }
    }
  },
  getCurrentSection(state): Section {
    const { currSection } = state
    return state.sections[currSection]
  },
  getCurrentPageId(state): string {
    const { currSection, currPage } = state
    return state.sections[currSection]?.pages[currPage].id || ""
  },
  getPageSpecialClass(state): string {
    const { currSection, currPage } = state
    const { specialClass } = state.sections[currSection].pages[currPage]
    return specialClass ? specialClass : "no-special-class"
  },
  getPageData(state): Record<string, any> {
    const { currSection, currPage } = state
    const { data } = state.sections[currSection].pages[currPage]
    return data ? data : {}
  },
  getAllSections(state): Section[] {
    // console.log("getting sections")
    // console.log(state)
    return state.sections
  },
  getAllowedRoutePaths(state): string[] | undefined {
    if (state.allowedPaths.length) {
      return state.allowedPaths
    } else {
      return undefined
    }
  },
  getLastLocation(state): string | undefined {
    return state.scorm.module.lastLocation
  },
  getRouteAction(state): RouteActions {
    return state.routeAction
  },
  getSpecialPageStatus(state): SpecialPageStatus {
    // console.log("asdfasdfadfasdfasfdasfsad")
    return state.specialPageStatus
  },
  getNavStatus(state): NavStatus {
    return state.navStatus
  },
  getMenuStatus(state): MenuStatus {
    return state.menuStatus
  },
  getSuspendedData(state): SuspendedData {
    return state.scorm.suspendedData
  },
  getSectionAndPageIndex(state): { currSection: number; currPage: number } {
    return {
      currSection: state.currSection,
      currPage: state.currPage,
    }
  },
  getUserData(state): UserData {
    return state.scorm.user
  },
  getArrayOfLockedSections(state): boolean[] {
    // remember, new sections is 'locked sections'
    // logic will have to be fixed in actions
    return state.scorm.suspendedData.locked
  },
  getLockedSectionsOfRole: (state) => (role: CommercializationRole) => {
    return state.scorm.suspendedData.lockedSections[role]
  },
  getCompletedSectionsOfRole: (state) => (role: CommercializationRole) => {
    return state.scorm.suspendedData.completedSections[role]
  },
  getCompletedSections(state): Record<string, boolean[]> {
    return state.scorm.suspendedData.completedSections
  },
  getFirstPageRoutePath(state): string {
    const { id: sectionId } = state.sections[0]
    const { id: pageId } = state.sections[0].pages[0]
    return `/${sectionId}/${pageId}`
  },
  // um, guess I didn't know what to call this so ..
  getStoreBasicModuleInfo(state): ModuleData {
    return state.scorm.module
  },
  getModuleStatus(state): ScormStatusString | undefined {
    return state.scorm.module.moduleStatus
  },
  getModuleScoreData(state): ScormScore {
    return state.scorm.module.score
  },
  getExtraJson(state): any {
    return (arg: string) => {
      if (state.extraJson[arg]) {
        return state.extraJson[arg]
      } else {
        return undefined
      }
    }
  },
  getBodyClickTicker(state): number {
    return state.bodyClickedTicker
  },
  jsonLoaded(state): boolean {
    return state.jsonLoaded
  },
}

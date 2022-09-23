import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import { RoleName, RootState, QuestionResult } from "./types"
import { meta } from "@/store/meta"
import { editableText } from "@/store/editableText"
import { bigConsoleLog } from "@/lib/randomFunctions"

import scorm from "@/scorm"

Vue.use(Vuex)

/**
 * The root store. Stores extremely basic stuff (was scorm initialized?) and dispatches the nessesary actions
 * to set up the data in all the modules. Also handles saving 'custom data' because scorm 1.2 only allows
 * one real point to do this.
 */

const state: RootState = {
  initialized: false,
  errorConnecting: undefined,
  isDev: process.env.NODE_ENV === "production" ? false : true,
  builtWithoutLms: process.env.VUE_APP_RUN_MODE !== "lms" ? true : false,
  noLms: undefined,
  muted: false,
  volume: 0.5,
  badgesShowing: [false, false, false, false, false],
  commercializationPhaseIndex: -1,

  commercializeQResults: {
    quality: [[], [], [], []],
    marketing: [[], [], [], []],
    manufacturing: [[], [], [], []],
    legal: [[], [], [], []],
    lab: [[], [], [], []],
    product: [[], [], [], []],
  },

  commercializeAResults: {
    quality: [[], [], [], []],
    marketing: [[], [], [], []],
    manufacturing: [[], [], [], []],
    legal: [[], [], [], []],
    lab: [[], [], [], []],
    product: [[], [], [], []],
  },
}

const store: StoreOptions<RootState> = {
  state,
  mutations: {
    setInitialized(state) {
      state.initialized = true
      state.errorConnecting = false
    },
    setError(state) {
      state.errorConnecting = true
    },
    setMuted(state, status: boolean) {
      state.muted = status
    },
    setVolume(state, volume: number) {
      state.volume = volume
    },
    setCommercializationQuestionResult(
      state,
      payload: {
        area: RoleName
        id: number
        phaseIndex: number
        questionNum: number
        showBadge: boolean | undefined
        result: QuestionResult
      }
    ) {
      const { id, area, phaseIndex, questionNum, showBadge, result } = payload
      const newQResults = structuredClone(state.commercializeQResults)

      // whoops need the id in the result
      newQResults[area][phaseIndex][questionNum] = { ...result, id, showBadge }

      state.commercializeQResults = newQResults
    },
    setCommercializationSubactivityDone(
      state,
      payload: {
        area: RoleName
        phaseIndex: number
        subAreaNum: number
      }
    ) {
      const { area, phaseIndex, subAreaNum } = payload
      const newAResults = structuredClone(state.commercializeAResults)
      newAResults[area][phaseIndex][subAreaNum] = true

      state.commercializeAResults = newAResults
    },
    initilizeCommercializationQuestionResults(
      state,
      payload: {
        area: RoleName
        questionArray: (QuestionResult | null)[][]
        activitesArray: (boolean | null)[][]
      }
    ) {
      const { area, questionArray, activitesArray } = payload
      const newQResults = structuredClone(state.commercializeQResults)
      const newAResults = structuredClone(state.commercializeAResults)
      newQResults[area] = questionArray
      newAResults[area] = activitesArray

      state.commercializeQResults = newQResults
      state.commercializeAResults = newAResults
    },
    initilizeCommercializationBadgeArray() {
      state.badgesShowing = [false, false, false, false, false]
    },
    startCommercializationLesson() {
      state.commercializationPhaseIndex = 0
    },
    // eh.. for simple mutations I'm fine with not using an action
    showABadge() {
      const index = state.badgesShowing.findIndex((entry: boolean) => !entry)
      if (index != -1) {
        state.badgesShowing.splice(index, 1, true)
      }
    },
    startCommercializationPhase(state, payload: number) {
      state.commercializationPhaseIndex = payload
    },
    resetCommercializationLesson() {
      state.commercializationPhaseIndex = -1
    },
  },
  actions: {
    // async thingy() {
    //   await require("something")
    // },
    async initialize({ commit, dispatch, state }) {
      if (state.isDev || state.builtWithoutLms) {
        bigConsoleLog("NO LMS")

        state.noLms = true
        await dispatch("meta/loadMeta")

        // ok now these should have been loaded
        const sections = (state as any).meta.sections

        // dispatch("json/loadJson", sections)
      } else if (scorm.init()) {
        bigConsoleLog("LMS CONNECTED")
        // always need to set suspend, since I'm assuming I'm always saving scorm's allowed "suspended" data
        scorm.set("cmi.exit", "suspend")
        commit("setInitialized")

        // dispatch loadMeta and loadUser
        dispatch("meta/loadMeta")

        // ok now these should have been loaded
        const sections = (state as any).meta.sections

        // dispatch("json/loadJson", sections)
      } else {
        console.log("Error connecting")
        commit("setErrorConnecting")
      }
    },
    mute({ commit, dispatch, state }) {
      commit("setMuted", true)
    },
    unMute({ commit, dispatch, state }) {
      commit("setMuted", false)
    },
    setVolume({ commit, dispatch, state }, volume: number) {
      commit("setVolume", volume)
    },
    initilizeCommercializationQuestionResults(
      { commit, state },
      payload: { area: RoleName; questionArray: (QuestionResult | null)[][] }
    ) {
      commit("startCommercializationLesson")
      commit("initilizeCommercializationQuestionResults", payload)
      commit("initilizeCommercializationBadgeArray")
    },
    setCommercializationQuestionResult(
      { commit, state },
      payload: {
        area: RoleName
        showBadge: boolean | undefined
        phaseIndex: number
        questionNum: number
        result: QuestionResult
      }
    ) {
      commit("setCommercializationQuestionResult", payload)
    },
    setCommercializationSubactivityDone(
      { commit, state },
      payload: {
        area: RoleName
        phaseIndex: number
        subAreaNum: number
      }
    ) {
      this.commit("setCommercializationSubactivityDone", payload)
    },
    startCommercializationPhase({ commit, state }, payload: number) {
      commit("startCommercializationPhase", payload)
    },
    resetCommercializationLesson() {
      // to do this, all you gotta do is reset the phase
      bigConsoleLog("RESETTING COMMERCIALIZATION LESSION")
      this.commit("resetCommercializationLesson")
    },
  },
  getters: {
    getVolume(state): number {
      return state.volume
    },
    getMuted(state): boolean {
      return state.muted
    },
    getCommercializationQuestionResults: (state) => (area: RoleName) => {
      // whoops.. I don't think this really has to be by area.. but I don't think it makes a difference
      return state.commercializeQResults[area]
    },
    getCommercializationAreaResults: (state) => (area: RoleName) => {
      // whoops.. I don't think this really has to be by area.. but I don't think it makes a difference
      return state.commercializeAResults[area]
    },
    getBadgesShowing: (state) => {
      return state.badgesShowing
    },
    getCommercializationPhaseIndex: (state) => {
      return state.commercializationPhaseIndex
    },
  },
  modules: {
    meta,
    editableText,
  },
}

export default new Vuex.Store<RootState>(store)

import search from './search'
import { MODAL_TYPE } from '@/utils/constants'
import { nextTick } from 'vue'
import router from '@/router'
import { OgType } from '@frontier/platform-web-sdk'

const state = () => ({
  modalPipeline: [],
  isReloadInnerApp: true,
})

const getters = {
  modalPipeline: (state) => state.modalPipeline,
  /**
   * control by route
   * /:orgNo/?:ogKey(OgType-OgId) -> org
   */
  routeLocation: () => {
    if (router.currentRoute.value.params.ogKey) {
      const [ogType] = router.currentRoute.value.params.ogKey.split('-')
      return Number(ogType) === OgType.GROUP ? 'group' : 'org'
    }

    return 'org'
  },
  routeLocationId: (state, getters, rootState, rootGetters) => {
    return getters.routeLocation === 'org'
      ? rootGetters['organization/orgId']
      : rootGetters['group/groupId']
  },
  isReloadInnerApp: (state) => state.isReloadInnerApp,
}

const mutations = {
  PUSH_modalPipeline(state, { type, options }) {
    state.modalPipeline.push({ type, options })
  },
  REPLACE_modalPipeline(state, { type, options }) {
    const length = state.modalPipeline.length
    state.modalPipeline[length - 1] = { type, options }
  },
  CLOSE_modalPipeline(state) {
    state.modalPipeline.pop()
  },
  CLEAR_modalPipeline(state) {
    state.modalPipeline.length = 0
  },
  SET_isReloadInnerApp(state, bool) {
    state.isReloadInnerApp = bool
  },
}

const actions = {
  openModalConfirm({ commit }, options) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.CONFIRM, options })
  },
  pushModalConfirm({ commit }, options) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.CONFIRM, options })
  },
  closeModalConfirm({ commit }) {
    commit('CLOSE_modalPipeline')
  },
  openModal({ commit }, options) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.MODAL, options })
  },
  pushModal({ commit }, options) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.MODAL, options })
  },
  replaceModal({ commit }, options) {
    commit('REPLACE_modalPipeline', { type: MODAL_TYPE.MODAL, options })
  },
  closeModal({ commit }) {
    commit('CLOSE_modalPipeline')
  },
  openModalBehavior({ commit }, options) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.BEHAVIOR, options })
  },
  pushModalBehavior({ commit }, options) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.BEHAVIOR, options })
  },
  replaceModalBehavior({ commit }, options) {
    commit('REPLACE_modalPipeline', { type: MODAL_TYPE.BEHAVIOR, options })
  },
  openModalCommon({ commit }, options) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.COMMON, options })
  },
  pushModalCommon({ commit }, options) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.COMMON, options })
  },
  replaceModalCommon({ commit }, options) {
    commit('REPLACE_modalPipeline', { type: MODAL_TYPE.COMMON, options })
  },
  closeModalBehavior({ commit }) {
    commit('CLOSE_modalPipeline')
  },
  clearModalPipeline({ commit }) {
    commit('CLEAR_modalPipeline')
  },
  openModalLoading({ commit }) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.LOADING })
  },
  pushModalLoading({ commit }, options) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.LOADING, options })
  },
  closeModalLoading({ commit }) {
    commit('CLOSE_modalPipeline')
  },
  async reloadInnerApp({ commit }) {
    commit('SET_isReloadInnerApp', false)
    await nextTick()
    commit('SET_isReloadInnerApp', true)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    search,
  },
}

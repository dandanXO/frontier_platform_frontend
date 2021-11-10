import search from './search'
import { MODAL_TYPE } from '@/utils/constants'

const state = () => ({
  /**
   * control by route
   * /:orgNo -> org
   * /:orgNo/:groupId -> group
   */
  routeLocation: 'org',
  modalPipeline: [],
  message: ''
})

const getters = {
  modalPipeline: (state) => state.modalPipeline,
  message: (state) => state.message,
  routeLocation: (state) => state.routeLocation
}

const mutations = {
  PUSH_modalPipeline (state, { type, options }) {
    state.modalPipeline.push({ type, options })
  },
  REPLACE_modalPipeline (state, { type, options }) {
    const length = state.modalPipeline.length
    state.modalPipeline[length - 1] = { type, options }
  },
  CLOSE_modalPipeline (state) {
    state.modalPipeline.pop()
  },
  CLEAR_modalPipeline (state) {
    state.modalPipeline.length = 0
  },
  PUSH_message (state, message) {
    state.message = message
  },
  REMOVE_message (state) {
    state.message = ''
  },
  SET_routeLocation (state, routeLocation) {
    state.routeLocation = routeLocation
    console.log('Route Location:', state.routeLocation)
  }
}

const actions = {
  openModalConfirm ({ commit }, options) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.CONFIRM, options })
  },
  pushModalConfirm ({ commit }, options) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.CONFIRM, options })
  },
  closeModalConfirm ({ commit }) {
    commit('CLOSE_modalPipeline')
  },
  openModal ({ commit }, options) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.MODAL, options })
  },
  pushModal ({ commit }, options) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.MODAL, options })
  },
  replaceModal ({ commit }, options) {
    commit('REPLACE_modalPipeline', { type: MODAL_TYPE.MODAL, options })
  },
  closeModal ({ commit }) {
    commit('CLOSE_modalPipeline')
  },
  openFullScreen ({ commit }, options) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.FULLSCREEN, options })
  },
  pushFullScreen ({ commit }, options) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.FULLSCREEN, options })
  },
  replaceFullScreen ({ commit }, options) {
    commit('REPLACE_modalPipeline', { type: MODAL_TYPE.FULLSCREEN, options })
  },
  closeFullscreen ({ commit }) {
    commit('CLOSE_modalPipeline')
  },
  clearModalPipeline ({ commit }) {
    commit('CLEAR_modalPipeline')
  },
  openModalLoading ({ commit }) {
    commit('CLEAR_modalPipeline')
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.LOADING })
  },
  pushModalLoading ({ commit }) {
    commit('PUSH_modalPipeline', { type: MODAL_TYPE.LOADING })
  },
  closeModalLoading ({ commit }) {
    commit('CLOSE_modalPipeline')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    search
  }
}

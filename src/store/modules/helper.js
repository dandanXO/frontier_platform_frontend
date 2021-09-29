import { MODAL_TYPE } from '@/utils/constants'

const state = () => ({
  isModalFeatureOpen: false,
  modalFeatureComponent: {
    component: '',
    header: '',
    primaryText: '',
    primaryHandler: null,
    secondaryText: '',
    secondaryHandler: null
  },
  modalPipeline: []
})

const getters = {
  isModalFeatureOpen: (state) => state.isModalFeatureOpen,
  modalFeatureComponent: (state) => state.modalFeatureComponent,
  modalPipeline: (state) => state.modalPipeline
}

const mutations = {
  SET_isModalFeatureOpen (state, bool) {
    state.isModalFeatureOpen = bool
  },
  SET_modalFeatureComponent (state, configs) {
    Object.assign(state.modalFeatureComponent, configs)
  },
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
  }
}

const actions = {
  openModalFeature ({ commit }, configs) {
    commit('SET_isModalFeatureOpen', true)
    commit('SET_modalFeatureComponent', configs)
  },
  closeModalFeature ({ commit }) {
    commit('SET_isModalFeatureOpen', false)
    commit('SET_modalFeatureComponent', {
      component: '',
      header: '',
      primaryText: '',
      primaryHandler: null,
      secondaryText: '',
      secondaryHandler: null
    })
  },
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
  closeFullscreen ({ commit }) {
    commit('CLOSE_modalPipeline')
  },
  clearModalPipeline ({ commit }) {
    commit('CLEAR_modalPipeline')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

// import setVuexState from '@/utils/set-vuex-state'

const state = () => ({
  isModalConfirmOpen: false,
  modalConfirmComponent: {
    header: '',
    title: '',
    content: '',
    primaryText: '',
    primaryHandler: null,
    secondaryText: '',
    secondaryHandler: null
  }
})

const getters = {
  isModalConfirmOpen: (state) => state.isModalConfirmOpen,
  modalConfirmComponent: (state) => state.modalConfirmComponent
}

const mutations = {
  SET_isModalConfirmOpen (state, bool) {
    state.isModalConfirmOpen = bool
  },
  SET_modalConfirmComponent (state, configs) {
    Object.assign(state.modalConfirmComponent, configs)
  }
}

const actions = {
  openModalConfirm ({ commit }, configs) {
    commit('SET_isModalConfirmOpen', true)
    commit('SET_modalConfirmComponent', configs)
  },
  closeModalConfirm ({ commit }) {
    commit('SET_isModalConfirmOpen', false)
    commit('SET_modalConfirmComponent', {
      header: '',
      title: '',
      content: '',
      primaryText: '',
      primaryHandler: null,
      secondaryText: '',
      secondaryHandler: null
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

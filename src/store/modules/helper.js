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
  },
  isModalOpen: false,
  modalComponent: {
    component: '',
    header: '',
    properties: {},
    closeHandler: null,
    closable: true
  }
})

const getters = {
  isModalConfirmOpen: (state) => state.isModalConfirmOpen,
  modalConfirmComponent: (state) => state.modalConfirmComponent,
  isModalOpen: (state) => state.isModalOpen,
  modalComponent: (state) => state.modalComponent
}

const mutations = {
  SET_isModalConfirmOpen (state, bool) {
    state.isModalConfirmOpen = bool
  },
  SET_modalConfirmComponent (state, configs) {
    Object.assign(state.modalConfirmComponent, configs)
  },
  SET_isModalOpen (state, bool) {
    state.isModalOpen = bool
  },
  SET_modalComponent (state, configs) {
    Object.assign(state.modalComponent, configs)
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
  },
  openModal ({ commit }, { component = '', header = '', properties = {}, closeHandler = null, closable = true }) {
    commit('SET_isModalOpen', true)
    commit('SET_modalComponent', {
      component,
      header,
      properties,
      closeHandler,
      closable
    })
  },
  closeModal ({ commit }) {
    commit('SET_isModalOpen', false)
    commit('SET_modalComponent', {
      component: '',
      header: '',
      properties: {},
      closeHandler: null,
      closable: true
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

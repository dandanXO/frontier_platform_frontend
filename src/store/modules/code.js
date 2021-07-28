import codeApi from '@/apis/code'

const state = () => ({
  countryList: [
    // {
    //   countryCode: 'TW',
    //   name: 'Taiwan',
    //   native: '臺灣',
    //   phone: '886',
    //   emoji: 'U+1F1F9 U+1F1FC'
    // },
    // {
    //   countryCode: 'SD',
    //   name: 'Sudan',
    //   native: 'السودان',
    //   phone: '249',
    //   emoji: 'U+1F1F8 U+1F1E9'
    // }
  ]
})

const getters = {
  countryList: (state) => state.countryList
}

const mutations = {
  SET_countryList (state, countryList) {
    state.countryList = countryList
  }
}

const actions = {
  async getCountryList ({ commit }) {
    const { data } = await codeApi.getCountryList()
    commit('SET_countryList', data.result.countryList)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

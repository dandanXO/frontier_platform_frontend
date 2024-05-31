import { CUSTOMIZE_LITTLEKING_RULE_ORG_ID_LIST } from '@/utils/constants'
const state = () => ({})

const getters = {
  littlekingRule: (state, getters, rootState) => {
    // 特殊客戶不給看 sourcing library
    if (
      CUSTOMIZE_LITTLEKING_RULE_ORG_ID_LIST.includes(
        rootState.organization.orgId
      )
    ) {
      return false
    }
    return true
  },
}

const mutations = {}

const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

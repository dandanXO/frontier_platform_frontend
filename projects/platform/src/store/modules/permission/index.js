import { some, includes } from 'lodash/fp'
import { DIGITAL_DRAPE_LIST } from '@/utils/trialDigitalDrape'

// 6 is Fabric Pro for testing.
// Other test org id need to delete before prod.
const state = () => ({
  taiwanTaffet: [96],
  // J&B INT"L
  jbIntL: [113],
  texperts: [1694],
  littleKing: [1879],
  trialDigitalDrape: DIGITAL_DRAPE_LIST,
  old3DViewer: [1701, 1892, 6],
})

const getters = {
  isShowOld3DViewer: (state, getters, rootState) => {
    return state.old3DViewer.includes(rootState.organization.orgId)
  },
  noLittleKingInOrgList: (state, getters, rootState) => {
    const orgIds = rootState.user.organizationList.map((org) => org.orgId)
    return !state.littleKing.some((orgId) => orgIds.includes(orgId))
  },
  isLittleKingRule: (state, getters, rootState) => {
    // Hide sourcing library
    return state.littleKing.includes(rootState.organization.orgId)
  },
  notLittleKingRule: (state, getters, rootState) => {
    // Show sourcing library
    return !state.littleKing.includes(rootState.organization.orgId)
  },
  isTaiwanTaffetaRule: (state, getters, rootState) => {
    // Convert weight by cuttable width
    return state.taiwanTaffet.includes(rootState.organization.orgId)
  },
  isJBRule: (state, getters, rootState) => {
    // J&B QR code label layout
    return state.jbIntL.includes(rootState.organization.orgId)
  },
  isTexpertsRule: (state, getters, rootState) => {
    // Texperts QR code label layout
    return state.texperts.includes(rootState.organization.orgId)
  },
  isDigitalDrapeTrialRule: (state, getters, rootState) => {
    // Show Digital Drape
    return state.trialDigitalDrape.includes(rootState.organization.orgId)
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

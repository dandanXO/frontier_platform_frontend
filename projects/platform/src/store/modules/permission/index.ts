// import { DIGITAL_DRAPE_LIST } from '@/utils/trialDigitalDrape'
// taiwanTaffet: [96],
// // J&B INT"L
// jbIntL: [113],
// texperts: [1694],
// // disable public-library and disable create new org
// littleKing: [1879, 1964],
// trialDigitalDrape: DIGITAL_DRAPE_LIST,
// colorFeatureOf3DViewer: [1918],
// new3DViewer: [6, 1498, 1892, 1815],
// moodboardOrg: [6, 1935, 1701, 248, 1943, 1944],
// threadboardOrg: [6, 1935, 1701],
// customPlanName: [1935],
import { PlanPlatformEnum } from '@frontier/platform-web-sdk'
import { PLAN_TYPE } from '@/utils/constants'
import type { OrganizationFeatureFlag } from '@frontier/platform-web-sdk'

// 6 is Fabric Pro for testing.
// Other test org id need to delete before prod.
const state = () => ({
  taiwanTaffet: false,
  // J&B INT"L
  jbIntL: false,
  texperts: false,
  // disable public-library and disable create new org
  littleKing: false,
  trialDigitalDrape: false,
  colorFeatureOf3DViewer: false,
  new3DViewer: false,
  moodboardOrg: false,
  threadboardOrg: false,

  customPlanName: [1935],
  customerPlanNameMap: {
    1935: PLAN_TYPE.PRO,
  },
  // new upload page display logic control
  useOldUiOrgList: true, //all  user USE old ui ,true mean's all user used
  useNewUiOrgList: [6], // list of organization id that used the new upload material UI
})

const getters = {
  useCustomPlanName: (
    state: { customPlanName: string | any[] },
    getters: any,
    rootState: { organization: { orgId: any } }
  ) => {
    return state.customPlanName.includes(rootState.organization.orgId)
  },
  enable3DViewerColor: (state: { colorFeatureOf3DViewer: boolean }) => {
    return state.colorFeatureOf3DViewer
  },
  enablemoodboardOrg: (state: { moodboardOrg: boolean }) => {
    return state.moodboardOrg
  },
  enablethreadboardOrg: (state: { threadboardOrg: boolean }) => {
    return state.threadboardOrg
  },
  uploadPageUseBothUi: (
    state: any,
    getters: { uploadPageUseOldUi: boolean; uploadPageUseNewUi: boolean }
  ) => {
    return getters.uploadPageUseOldUi && getters.uploadPageUseNewUi
  },
  uploadPageUseNewUi: (
    state: { useNewUiOrgList: string | any[] },
    getters: any,
    rootState: { organization: { orgId: any } }
  ) => {
    return state.useNewUiOrgList.includes(rootState.organization.orgId)
  },
  uploadPageUseOldUi: (state: { useOldUiOrgList: boolean }) => {
    return state.useOldUiOrgList
  },
  isShowNew3DViewer: (state: { new3DViewer: boolean }) => {
    return state.new3DViewer
  },
  noLittleKingInOrgList: (state: { littleKing: boolean }) => {
    return !state.littleKing
  },
  isLittleKingRule: (state: { littleKing: boolean }) => {
    // Hide sourcing library
    return state.littleKing
  },
  notLittleKingRule: (state: { littleKing: boolean }) => {
    // Show sourcing library
    return !state.littleKing
  },
  isFabriSelectAccount: (
    state: any,
    getters: any,
    rootState: { organization: { plan: { platform: number } } }
  ) => {
    // Hide sourcing library
    return rootState.organization.plan.platform === PlanPlatformEnum.FabriSelect
  },
  isTaiwanTaffetaRule: (state: { taiwanTaffet: boolean }) => {
    // Convert weight by cuttable width
    return !!state.taiwanTaffet
  },
  isJBRule: (state: { jbIntL: boolean }) => {
    // J&B QR code label layout
    return state.jbIntL
  },
  isTexpertsRule: (state: { texperts: boolean }) => {
    // Texperts QR code label layout
    return state.texperts
  },
  isDigitalDrapeTrialRule: (state: { trialDigitalDrape: boolean }) => {
    // Show Digital Drape
    return state.trialDigitalDrape
  },
}

const mutations = {
  updateTaiwanTaffet(
    state: { taiwanTaffet: boolean },
    newTaffet: OrganizationFeatureFlag['convertWeightByCuttableWidth']
  ) {
    state.taiwanTaffet = newTaffet
  },
  // update jbIntL
  updateJbIntL(
    state: { jbIntL: boolean },
    newJbIntL: OrganizationFeatureFlag['printQRCodeLableUsingJBFormat']
  ) {
    state.jbIntL = newJbIntL
  },
  // update texperts
  updateTexperts(
    state: { texperts: boolean },
    newTexperts: OrganizationFeatureFlag['printQRCodeLableUsingTexpertsFormat']
  ) {
    state.texperts = newTexperts
  },
  // update littleKing
  updateLittleKing(
    state: { littleKing: boolean },
    newLittleKing: OrganizationFeatureFlag['hideSourcingLibrary']
  ) {
    state.littleKing = newLittleKing
  },
  // update trialDigitalDrape
  updateTrialDigitalDrape(
    state: { trialDigitalDrape: boolean },
    newTrialDigitalDrape: OrganizationFeatureFlag['digitalDrape']
  ) {
    state.trialDigitalDrape = newTrialDigitalDrape
  },
  // update colorFeatureOf3DViewer
  updateColorFeatureOf3DViewer(
    state: {
      colorFeatureOf3DViewer: boolean
    },
    newColorFeature: OrganizationFeatureFlag['changeColorIn3DViewer']
  ) {
    state.colorFeatureOf3DViewer = newColorFeature
  },
  // update new3DViewer
  updateNew3DViewer(
    state: { new3DViewer: boolean },
    new3DViewer: OrganizationFeatureFlag['new3DViewer']
  ) {
    state.new3DViewer = new3DViewer
  },
  // update moodboardOrg
  updateMoodboardOrg(
    state: { moodboardOrg: boolean },
    newMoodboardOrg: OrganizationFeatureFlag['moodboard']
  ) {
    state.moodboardOrg = newMoodboardOrg
  },
  // update threadboardOrg
  updateThreadboardOrg(
    state: { threadboardOrg: boolean },
    newThreadboardOrg: OrganizationFeatureFlag['threadBoard']
  ) {
    state.threadboardOrg = newThreadboardOrg
  },
  // update customPlanName
  updateCustomPlanName(
    state: { customPlanName: number[] },
    newCustomPlanName: number[]
  ) {
    state.customPlanName = newCustomPlanName
  },
  // update customerPlanNameMap
  updateCustomerPlanNameMap(
    state: { customerPlanNameMap: Record<number, string> },
    newCustomerPlanNameMap: Record<number, string>
  ) {
    state.customerPlanNameMap = newCustomerPlanNameMap
  },
}

const actions = {
  updateFeatureFlag({ commit }: any, featureFlagList: any[]) {
    const featureFlagMapping: Record<string, string> = {
      HideSourcingLibrary: 'updateLittleKing',
      ConvertWeightByCuttableWidth: 'updateTaiwanTaffet',
      PrintQRCodeLableUsingJBFormat: 'updateJbIntL',
      PrintQRCodeLableUsingTexpertsFormat: 'updateTexperts',
      DigitalDrape: 'updateTrialDigitalDrape',
      ChangeColorIn3DViewer: 'updateColorFeatureOf3DViewer',
      New3DViewer: 'updateNew3DViewer',
      Moodboard: 'updateMoodboardOrg',
      ThreadBoard: 'updateThreadboardOrg',
    }

    Object.entries(featureFlagMapping).forEach(([flag, mutation]) => {
      commit(mutation, featureFlagList.includes(flag))
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

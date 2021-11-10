import setVuexState from '@/utils/set-vuex-state'
import materialApi from '@/apis/material'
import { SIDE_TYPE, WEIGHT_UNIT, INVENTORY_UNIT, MATERIAL_PRICING_CURRENCY } from '@/utils/constants'

const getDefaultState = () => ({
  materialId: null,
  relationMaterialId: null,
  frontierNo: null,
  materialNo: null,
  materialSeq: null,
  coverMode: 0,
  coverImg: null,
  isDoubleSideMaterial: true,
  sideType: SIDE_TYPE.FACE,
  isComplete: false,
  cloneFromMaterialId: null,
  description: null,
  descriptionList: [],
  weight: 0, // LOCAL VAR
  weightUnit: WEIGHT_UNIT.GSM,
  weightGsm: 0,
  weightOz: 0,
  weightGy: null,
  width: 0,
  content: '',
  contentList: [{
    contentId: -1,
    name: '',
    percentage: 0
  }],
  finish: '',
  finishList: [],
  warpDensity: '',
  weftDensity: '',
  warpYarnCount: '',
  weftYarnCount: '',
  pattern: '',
  color: '',
  publicTagList: [],
  privateTagList: [],
  tagList: [],
  aiTagList: [],
  remark: '',
  sampleCardsRemainingQty: null,
  sampleCardsLocation: '',
  hangersRemainingQty: null,
  hangersLocation: '',
  totalInventoryQty: 0,
  isPublicInventory: false,
  inventoryUnit: INVENTORY_UNIT.Y,
  inventoryList: [{
    section: '',
    shelf: '',
    quantity: 0,
    unit: INVENTORY_UNIT.Y
  }],
  publicPrice: {
    countryCode: '',
    currency: MATERIAL_PRICING_CURRENCY.USD,
    price: null,
    unit: INVENTORY_UNIT.Y,
    minimumOrderQuantity: null,
    minimumOrderQuantityUnit: INVENTORY_UNIT.Y,
    minimumContainerQuantity: null,
    minimumContainerQuantityUnit: INVENTORY_UNIT.Y,
    productionLeadTime: '',
    sampleLeadTime: ''
  },
  privatePrice: {
    countryCode: '',
    currency: MATERIAL_PRICING_CURRENCY.USD,
    price: null,
    unit: INVENTORY_UNIT.Y,
    minimumOrderQuantity: null,
    minimumOrderQuantityUnit: INVENTORY_UNIT.Y,
    minimumContainerQuantity: null,
    minimumContainerQuantityUnit: INVENTORY_UNIT.Y,
    productionLeadTime: '',
    sampleLeadTime: ''
  },
  faceSideImg: {
    crop: '',
    ruler: '',
    original: '',
    dpi: 300,
    u3mCrop: '',
    u3mOriginal: ''
  },
  backSideImg: {
    crop: '',
    ruler: '',
    original: '',
    dpi: 300,
    u3mCrop: '',
    u3mOriginal: ''
  },
  attachmentList: [],
  pantoneList: [],
  u3m: {
    status: 0,
    zipUrl: '',
    baseImgUrl: '',
    normalImgUrl: ''
  },
  createDate: '',
  updateDate: '',

  /** Code */
  code: {
    contentList: [],
    descriptionList: [],
    finishList: []
  }
})

const state = getDefaultState()

const getters = {
  material: (state) => state,
  code: (state) => state.code
}

const mutations = {
  RESET_material (state) {
    Object.assign(state, getDefaultState())
  },
  UPDATE_material (state, material) {
    Object.assign(state, material)
  },
  UPDATE_content_item (state, { index, content }) {
    Object.assign(state.contentList[index], content)
  },
  ADD_content_item (state) {
    state.contentList.push(getDefaultState().contentList[0])
  },
  REMOVE_content_item (state, index) {
    state.contentList.splice(index, 1)
  },
  ADD_inventory_item (state) {
    state.inventoryList.push(getDefaultState().inventoryList[0])
  },
  REMOVE_inventory_item (state, index) {
    state.inventoryList.splice(index, 1)
  }
}

const actions = {
  setMaterial ({ state, commit }, data) {
    setVuexState(state, data)

    if (data.contentList && data.contentList.length === 0) {
      commit('ADD_content_item')
    }
    if (data.inventoryList && data.inventoryList.length === 0) {
      commit('ADD_inventory_item')
    }
    if (data.weightUnit) {
      state.weight = data.weightUnit === WEIGHT_UNIT.GSM ? data.weightGsm : data.weightOz
    }
  },
  resetMaterial ({ commit }) {
    commit('RESET_material')
  },
  async getMaterialOptions ({ rootGetters, dispatch }) {
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await materialApi.org.getMaterialOptions({ orgId: rootGetters['organization/orgId'] })
      : await materialApi.group.getMaterialOptions({ groupId: rootGetters['group/groupId'] })

    dispatch('setMaterial', {
      code: data.result.code
    })
  },
  async createMaterial ({ rootGetters, getters }, { tempMaterialId }) {
    const material = Object.fromEntries(
      Object.entries(getters.material)
        .filter(([key]) => [
          'isDoubleSideMaterial',
          'sideType',
          'materialNo',
          'descriptionList',
          'weight',
          'weightUnit',
          'weightGy',
          'width',
          'contentList',
          'finishList',
          'warpYarnCount',
          'weftYarnCount',
          'warpDensity',
          'weftDensity',
          'pattern',
          'color',
          'publicTagList',
          'privateTagList',
          'aiTagList',
          'remark',
          'materialSeq',
          'sampleCardsRemainingQty',
          'sampleCardsLocation',
          'hangersRemainingQty',
          'hangersLocation',
          'inventoryList',
          'isPublicInventory',
          'publicPrice',
          'privatePrice'
        ].includes(key))
    )
    rootGetters['helper/routeLocation'] === 'org'
      ? await materialApi.org.createMaterial({ orgId: rootGetters['organization/orgId'], tempMaterialId, material })
      : await materialApi.group.createMaterial({ groupId: rootGetters['group/groupId'], tempMaterialId, material })
  },
  async updateMaterial ({ rootGetters, getters }) {
    const materialId = getters.material.materialId
    const material = Object.fromEntries(
      Object.entries(getters.material)
        .filter(([key]) => [
          'isDoubleSideMaterial',
          'sideType',
          'materialNo',
          'descriptionList',
          'weight',
          'weightUnit',
          'weightGy',
          'width',
          'contentList',
          'finishList',
          'warpYarnCount',
          'weftYarnCount',
          'warpDensity',
          'weftDensity',
          'pattern',
          'color',
          'publicTagList',
          'privateTagList',
          'aiTagList',
          'remark',
          'materialSeq',
          'sampleCardsRemainingQty',
          'sampleCardsLocation',
          'hangersRemainingQty',
          'hangersLocation',
          'inventoryList',
          'isPublicInventory',
          'publicPrice',
          'privatePrice'
        ].includes(key))
    )
    rootGetters['helper/routeLocation'] === 'org'
      ? await materialApi.org.updateMaterial({ orgId: rootGetters['organization/orgId'], materialId, material })
      : await materialApi.group.updateMaterial({ groupId: rootGetters['group/groupId'], materialId, material })
  },
  async addPantone ({ rootGetters, getters, dispatch }, { name }) {
    const params = {
      name,
      materialId: getters.material.materialId
    }
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await materialApi.org.addPantone({ orgId: rootGetters['organization/orgId'], ...params })
      : await materialApi.group.addPantone({ groupId: rootGetters['group/groupId'], ...params })

    dispatch('handleResponseData', { data }, { root: true })
  },
  async removePantone ({ rootGetters, getters, dispatch }, { materialPantoneId }) {
    const params = {
      materialPantoneId,
      materialId: getters.material.materialId
    }
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await materialApi.org.removePantone({ orgId: rootGetters['organization/orgId'], ...params })
      : await materialApi.group.removePantone({ groupId: rootGetters['group/groupId'], ...params })

    dispatch('handleResponseData', { data }, { root: true })
  },
  async changeCoverImg ({ rootGetters, getters, dispatch }, { coverMode, materialAttachmentId = null, attachmentCropImg = null }) {
    const params = {
      materialId: getters.material.materialId,
      coverMode,
      materialAttachmentId,
      attachmentCropImg
    }
    const { data } = rootGetters['helper/routeLocation'] === 'org'
      ? await materialApi.org.changeCoverImg({ orgId: rootGetters['organization/orgId'], ...params })
      : await materialApi.group.changeCoverImg({ groupId: rootGetters['group/groupId'], ...params })

    dispatch('handleResponseData', { data }, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

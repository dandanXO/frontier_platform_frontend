import { SIDE_TYPE, WEIGHT_UNIT, INVENTORY_UNIT, MATERIAL_PRICING_CURRENCY, SOURCE_ASSET_LOCATION } from '@/utils/constants'

const Material = {
  state: () => ({
    materialId: null,
    relationMaterialId: null,
    frontierNo: null,
    relationFrontierNo: null,
    materialNo: null,
    materialSeq: null,
    sourceAssetLocation: SOURCE_ASSET_LOCATION.ORG,
    coverMode: 0,
    coverImg: null,
    isDoubleSideMaterial: true,
    sideType: SIDE_TYPE.FACE,
    isComplete: false,
    cloneFromMaterialId: null,
    description: null,
    descriptionList: [],
    weight: null, // LOCAL VAR
    weightUnit: WEIGHT_UNIT.GSM.value,
    weightGsm: 0,
    weightOz: 0,
    weightGy: null,
    width: null,
    content: '',
    contentList: [{
      contentId: -1,
      name: '',
      percentage: null
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
      u3maUrl: '',
      baseImgUrl: '',
      normalImgUrl: ''
    },
    createDate: '',
    updateDate: ''
  }),
  getters: {
    material: (state) => state,
    attachmentList: (state) => {
      const sortedAttachmentList = JSON.parse(JSON.stringify(state.attachmentList))
      const extensionOrder = {
        '.png': 7,
        '.jpg': 6,
        '.jpeg': 5,
        '.gif': 4,
        '.mov': 3,
        '.mp4': 3,
        '.pdf': 2,
        '.zip': 1
      }
      sortedAttachmentList.sort((a, b) => extensionOrder[b.extension] - extensionOrder[a.extension])
      return sortedAttachmentList
    }
  },
  mutations: {
    SET_material (state, material) {
      Object.assign(state, material)
      if (material.weightUnit) {
        state.weight = material.weightUnit === WEIGHT_UNIT.GSM.value ? material.weightGsm : material.weightOz
      } else {
        state.weightUnit = WEIGHT_UNIT.GSM.value
      }
    }
  },
  actions: {
  }
}

export default Material

import {
  SIDE_TYPE,
  INVENTORY_UNIT,
  MATERIAL_PRICING_CURRENCY,
  OG_TYPE,
  useConstants,
} from '@/utils/constants'

const { WEIGHT_UNIT } = useConstants()

const Material = {
  state: () => ({
    materialId: 0,
    relationMaterialId: null,
    frontierNo: null,
    relationFrontierNo: null,
    materialNo: '',
    materialSeq: null,
    sourceAssetLocation: OG_TYPE.ORG,
    coverMode: 0,
    coverImg: null,
    isDoubleSideMaterial: true,
    sideType: SIDE_TYPE.FACE,
    isComplete: false, // isComplete 的規則是，所以必填欄位 + 有封面圖或上傳正或反面圖
    cloneFromMaterialId: null,
    description: null,
    descriptionList: [],
    weight: null, // LOCAL VAR
    weightUnit: WEIGHT_UNIT.value.GSM.value,
    weightGsm: 0,
    weightOz: 0,
    weightGy: null,
    width: null,
    content: '',
    contentList: [
      {
        contentId: -1,
        name: '',
        percentage: null,
      },
    ],
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
    inventoryList: [
      {
        section: '',
        shelf: '',
        quantity: 0,
        unit: INVENTORY_UNIT.Y,
      },
    ],
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
      sampleLeadTime: '',
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
      sampleLeadTime: '',
    },
    faceSideImg: {
      crop: '',
      ruler: '',
      original: '',
      dpi: 300,
      u3mCrop: '',
      u3mOriginal: '',
    },
    backSideImg: {
      crop: '',
      ruler: '',
      original: '',
      dpi: 300,
      u3mCrop: '',
      u3mOriginal: '',
    },
    attachmentList: [],
    pantoneList: [],
    certificateList: [],
    carbonEmission: {
      co2: {
        personalized: 6.27,
        benchmark: null,
        differenceInPercent: 1,
        saving: null,
      },
      water: {
        personalized: 12.55,
        benchmark: null,
        differenceInPercent: null,
        saving: null,
      },
      land: {
        personalized: 18.7,
        benchmark: null,
        differenceInPercent: null,
        saving: null,
      },
      energy: {
        personalized: 34.2,
        benchmark: null,
        differenceInPercent: null,
        saving: null,
      },
    },
    u3m: {
      status: 0,
      zipUrl: '',
      u3maUrl: '',
      baseImgUrl: '',
      normalImgUrl: '',
      dpi: 300,
    },
    createDate: '',
    updateDate: '',
    digitalThreadQty: 0,
    digitalThreadHasUnread: false,
    unitName: '',
    unitLogo: '',
    isMaterialOwnerSide: false,
    materialOwnerOGId: 0,
    materialOwnerOGType: OG_TYPE.ORG,
  }),
  getters: {
    material: (state) => state,
    attachmentList: (state) => {
      const sortedAttachmentList = JSON.parse(
        JSON.stringify(state.attachmentList)
      )
      const extensionOrder = {
        '.png': 7,
        '.jpg': 6,
        '.jpeg': 5,
        '.gif': 4,
        '.mov': 3,
        '.mp4': 3,
        '.pdf': 2,
        '.zip': 1,
      }
      sortedAttachmentList.sort(
        (a, b) => extensionOrder[b.extension] - extensionOrder[a.extension]
      )
      return sortedAttachmentList
    },
    immediateTotalInventoryQty: (state) => {
      let inventoryUnit
      const { inventoryList, weightUnit, weight, width } = state
      const total = inventoryList.reduce((prev, current) => {
        const quantity = current.quantity
        inventoryUnit = current.unit

        if (!weight || !width) {
          return 0
        }

        switch (inventoryUnit) {
          case INVENTORY_UNIT.Y: {
            return prev + Number(quantity)
          }
          case INVENTORY_UNIT.M: {
            return prev + Number(quantity) / 0.9114
          }
          case INVENTORY_UNIT.KG: {
            let gsm
            if (weightUnit === WEIGHT_UNIT.value.GSM.value) {
              gsm = weight
            } else if (weightUnit === WEIGHT_UNIT.value.OZ.value) {
              gsm = weight / 0.9114
            }
            return prev + (Number(quantity) / (gsm * 0.02323 * width)) * 1000
          }
          default:
            return prev + Number(quantity)
        }
      }, 0)

      if ([INVENTORY_UNIT.M, INVENTORY_UNIT.KG].includes(inventoryUnit)) {
        return Math.round(total)
      }
      return total
    },
  },
  mutations: {
    SET_material(state, material) {
      Object.assign(state, material)
      if (!state.weightUnit) {
        state.weightUnit = WEIGHT_UNIT.value.GSM.value
      }
      state.weight =
        state.weightUnit === WEIGHT_UNIT.value.GSM.value
          ? state.weightGsm
          : state.weightOz
    },
    RESET_material(state) {
      Object.assign(state, Material.state())
    },
    UPDATE_material(state, material) {
      Object.assign(state, material)
    },
    UPDATE_content_item(state, { index, content }) {
      Object.assign(state.contentList[index], content)
    },
    ADD_content_item(state) {
      state.contentList.push(Material.state().contentList[0])
    },
    REMOVE_content_item(state, index) {
      state.contentList.splice(index, 1)
    },
    ADD_inventory_item(state) {
      const inventory = Material.state().inventoryList[0]
      if (state.inventoryList[0]?.unit) {
        inventory.unit = state.inventoryList[0].unit
      }
      state.inventoryList.push(inventory)
    },
    REMOVE_inventory_item(state, index) {
      state.inventoryList.splice(index, 1)
    },
    UPDATE_inventoryList_unit(state, unit) {
      state.inventoryList.forEach((inventory) => (inventory.unit = unit))
    },
    UPDATE_attachmentList(state, attachmentList) {
      state.attachmentList = attachmentList
    },
  },
  actions: {},
}

export default Material

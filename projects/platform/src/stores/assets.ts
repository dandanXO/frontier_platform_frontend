import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  type Material,
  CoverMode,
  MaterialType,
  LengthUnit,
  WeightUnit,
} from '@frontier/platform-web-sdk'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import useCurrentUnit from '@/composables/useCurrentUnit'
import assetsApi from '@/apis/assets'

export const useAssetsStore = defineStore('assets', () => {
  const { unit } = useCurrentUnit()
  const baseReq = computed(() => ({
    orgId: unit.value.orgId,
    ogType: unit.value.ogType,
    ogId: unit.value.ogId,
  }))

  const material = ref<Material>({
    materialId: 0,
    isAutoSyncFaceToBackSideInfo: true,
    itemNo: 'Item No',
    coverImage: {
      mode: CoverMode.FACE,
      thumbnailUrl: `https://picsum.photos/200`,
      displayUrl: `https://picsum.photos/200`,
    },
    seasonInfo: {
      season: {
        seasonId: 0,
        name: 'Season Name',
      },
      year: 2023,
      isPublic: true,
    },
    width: {
      cuttable: 30,
      full: 50,
      unit: LengthUnit.CM,
    },
    weight: {
      value: 100,
      unit: WeightUnit.GM,
    },
    isComposite: true,
    isDoubleSide: true,
    sideType: MATERIAL_SIDE_TYPE.FACE,
    faceSide: {
      frontierNo: 'Frontier No',
      materialSideId: 1,
      isMainSide: true,
      sideImage: {
        originalUrl: `https://picsum.photos/200`,
        displayUrl: `https://picsum.photos/200`,
        thumbnailUrl: `https://picsum.photos/200`,
        rulerUrl: `https://picsum.photos/200`,
        dpi: 300,
        cropRecord: {
          x: 0,
          y: 0,
          rotateDeg: 200,
          scaleRatio: 4,
        },
      },
      u3mImage: null,
      materialType: MaterialType.WOVEN,
      featureList: new Array(7).fill(0).map((_, index) => ({
        featureId: index,
        name: `Feature Name ${index}`,
      })),
      descriptionList: [],
      construction: {
        isPublic: false,
        warpDensity: 'Warp Density',
        weftDensity: 'Weft Density',
        warpYarnSize: 'Warp Yarn',
        weftYarnSize: 'Weft Yarn',
      },
      constructionCustomPropertyList: [
        {
          isPublic: false,
          name: 'Custom Property Name 1',
          value: 'Custom Property Value 1',
          customId: 1,
        },
        {
          isPublic: true,
          name: 'Custom Property Name 2',
          value: 'Custom Property Value 2',
          customId: 2,
        },
        {
          isPublic: false,
          name: 'Custom Property Name 3',
          value: 'Custom Property Value 3',
          customId: 3,
        },
      ],
      contentList: [
        {
          contentId: 0,
          name: 'Content Name',
          percentage: 100,
        },
      ],
      finishList: [
        {
          finishId: 1,
          name: 'Finish Name 1',
        },
      ],
      patternInfo: {
        pattern: 'Pattern',
        customPropertyList: [
          {
            customId: 1,
            isPublic: false,
            name: 'Custom Property Name 1',
            value: 'Custom Property Value 1',
          },
          {
            customId: 2,
            isPublic: false,
            name: 'Custom Property Name 2',
            value: 'Custom Property Value 2',
          },
          {
            customId: 3,
            isPublic: true,
            name: 'Custom Property Name 3',
            value: 'Custom Property Value 3',
          },
        ],
      },
      colorInfo: {
        color: 'Color',
        customPropertyList: [
          {
            customId: 1,
            isPublic: false,
            name: 'Custom Property Name 1',
            value: 'Custom Property Value 1',
          },
          {
            customId: 2,
            isPublic: true,
            name: 'Custom Property Name 2',
            value: 'Custom Property Value 2',
          },
          {
            customId: 3,
            isPublic: false,
            name: 'Custom Property Name 3',
            value: 'Custom Property Value 3',
          },
        ],
      },
      pantoneList: [
        {
          materialPantoneId: 137267,
          pantoneId: 659,
          name: '15-3412 TCX',
          majorColorName: 'Light-Purple',
          colorName: 'Orchid Bouquet',
          r: 209,
          g: 172,
          b: 206,
        },
        {
          materialPantoneId: 137268,
          pantoneId: 1185,
          name: '17-2625 TCX',
          majorColorName: 'Pink',
          colorName: 'Super Pink',
          r: 206,
          g: 107,
          b: 164,
        },
        {
          materialPantoneId: 137269,
          pantoneId: 1196,
          name: '17-3628 TCX',
          majorColorName: 'Light-Purple',
          colorName: 'Amethyst Orchid',
          r: 146,
          g: 106,
          b: 166,
        },
        {
          materialPantoneId: 137270,
          pantoneId: 1490,
          name: '18-3027 TCX',
          majorColorName: 'Pink',
          colorName: 'Purple Orchid',
          r: 173,
          g: 77,
          b: 140,
        },
        {
          materialPantoneId: 137271,
          pantoneId: 1501,
          name: '18-3418 TCX',
          majorColorName: 'Light-Purple',
          colorName: 'Chinese Violet',
          r: 131,
          g: 94,
          b: 129,
        },
        {
          materialPantoneId: 137272,
          pantoneId: 1769,
          name: '19-2520 TCX',
          majorColorName: 'Pink',
          colorName: 'Potent Purple',
          r: 70,
          g: 38,
          b: 57,
        },
        {
          materialPantoneId: 137273,
          pantoneId: 1774,
          name: '19-2820 TCX',
          majorColorName: 'Pink',
          colorName: 'Phlox',
          r: 105,
          g: 45,
          b: 93,
        },
      ],
    },
    middleSide: {
      materialSideId: 2,
      frontierNo: 'Frontier No',
      featureList: [],
      finishList: [],
      customPropertyList: [],
    },
    backSide: {
      frontierNo: 'Frontier No',
      materialSideId: 3,
      isMainSide: false,
      sideImage: {
        originalUrl: `https://picsum.photos/seed/back/200`,
        displayUrl: `https://picsum.photos/seed/back/200`,
        thumbnailUrl: `https://picsum.photos/seed/back/200`,
        rulerUrl: `https://picsum.photos/seed/back/200`,
        dpi: 300,
        cropRecord: {
          x: 0,
          y: 0,
          rotateDeg: 200,
          scaleRatio: 4,
        },
      },
      u3mImage: null,
      materialType: MaterialType.KNIT,
      featureList: new Array(7).fill(0).map((_, index) => ({
        featureId: index,
        name: `Feature Name ${index}`,
      })),
      descriptionList: [],
      construction: {
        isPublic: false,
        machineType: 'Machine Type',
        walesPerInch: 11,
        coursesPerInch: 22,
        yarnSize: 'Yarn Size',
        machineGaugeInGg: 33,
      },
      constructionCustomPropertyList: [
        {
          isPublic: false,
          name: 'Custom Property Name 1',
          value: 'Custom Property Value 1',
          customId: 1,
        },
        {
          isPublic: true,
          name: 'Custom Property Name 2',
          value: 'Custom Property Value 2',
          customId: 2,
        },
        {
          isPublic: false,
          name: 'Custom Property Name 3',
          value: 'Custom Property Value 3',
          customId: 3,
        },
      ],
      contentList: [
        {
          contentId: 0,
          name: 'Content Name',
          percentage: 100,
        },
      ],
      finishList: [],
      patternInfo: {
        pattern: 'Pattern',
        customPropertyList: [
          {
            customId: 1,
            isPublic: false,
            name: 'Custom Property Name 1',
            value: 'Custom Property Value 1',
          },
          {
            customId: 2,
            isPublic: false,
            name: 'Custom Property Name 2',
            value: 'Custom Property Value 2',
          },
          {
            customId: 3,
            isPublic: true,
            name: 'Custom Property Name 3',
            value: 'Custom Property Value 3',
          },
        ],
      },
      colorInfo: {
        color: 'Color',
        customPropertyList: [
          {
            customId: 1,
            isPublic: false,
            name: 'Custom Property Name 1',
            value: 'Custom Property Value 1',
          },
          {
            customId: 2,
            isPublic: true,
            name: 'Custom Property Name 2',
            value: 'Custom Property Value 2',
          },
          {
            customId: 3,
            isPublic: false,
            name: 'Custom Property Name 3',
            value: 'Custom Property Value 3',
          },
        ],
      },
      pantoneList: [
        {
          materialPantoneId: 137267,
          pantoneId: 659,
          name: '15-3412 TCX',
          majorColorName: 'Light-Purple',
          colorName: 'Orchid Bouquet',
          r: 209,
          g: 172,
          b: 206,
        },
        {
          materialPantoneId: 137268,
          pantoneId: 1185,
          name: '17-2625 TCX',
          majorColorName: 'Pink',
          colorName: 'Super Pink',
          r: 206,
          g: 107,
          b: 164,
        },
        {
          materialPantoneId: 137269,
          pantoneId: 1196,
          name: '17-3628 TCX',
          majorColorName: 'Light-Purple',
          colorName: 'Amethyst Orchid',
          r: 146,
          g: 106,
          b: 166,
        },
        {
          materialPantoneId: 137270,
          pantoneId: 1490,
          name: '18-3027 TCX',
          majorColorName: 'Pink',
          colorName: 'Purple Orchid',
          r: 173,
          g: 77,
          b: 140,
        },
        {
          materialPantoneId: 137271,
          pantoneId: 1501,
          name: '18-3418 TCX',
          majorColorName: 'Light-Purple',
          colorName: 'Chinese Violet',
          r: 131,
          g: 94,
          b: 129,
        },
        {
          materialPantoneId: 137272,
          pantoneId: 1769,
          name: '19-2520 TCX',
          majorColorName: 'Pink',
          colorName: 'Potent Purple',
          r: 70,
          g: 38,
          b: 57,
        },
        {
          materialPantoneId: 137273,
          pantoneId: 1774,
          name: '19-2820 TCX',
          majorColorName: 'Pink',
          colorName: 'Phlox',
          r: 105,
          g: 45,
          b: 93,
        },
      ],
    },
    u3m: {
      status: 2,
      hasPhysicalData: true,
      zipUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/ZIP/F072547576578_202208181455009201.zip',
      u3maUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/U3MA/F072547576578_202208181455009201.u3ma',
      gltfUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/Gltf/F072547576578_202208181455009201/F072547576578_202208181455009201.gltf',
      baseImgUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/U3M/F072547576578_202208181455009201/textures/base.jpg',
      normalImgUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/U3M/F072547576578_202208181455009201/textures/nrm.jpg',
      dispImgUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/U3M/F072547576578_202208181455009201/textures/disp.jpg',
      roughImgUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/U3M/F072547576578_202208181455009201/textures/rough.jpg',
      dpi: 600,
      u3mSpecUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/U3M/F072547576578_202208181455009201/u3m_package.u3m',
      u3mPhysicSpecUrl:
        'https://textile-dev.frontier.cool/Resource/MaterialU3M/U3M/F072547576578_202208181455009201/physics.json',
      creatorUnitLabelColor: '#F2C94C',
      creator: 'ChaiChai',
      creatorAvatar:
        'https://textile-dev.frontier.cool/Resource/UserAvatar/202304170000056369.jpeg',
      createDate: 1660805701,
    },
    customU3m: {
      status: -1,
      customFileName: null,
      hasPhysicalData: null,
      zipUrl: null,
      u3maUrl: null,
      gltfUrl: null,
      baseImgUrl: null,
      normalImgUrl: null,
      dispImgUrl: null,
      roughImgUrl: null,
      dpi: null,
      u3mSpecUrl: null,
      u3mPhysicSpecUrl: null,
      creatorUnitLabelColor: null,
      creator: null,
      creatorAvatar: null,
      createDate: 0,
    },
    tagInfo: {
      tagList: ['100% Cotton', '14-5002 TCX', '15-0703 TCX'],
      aiTagList: ['16-1508 TCX', '17-1510 TCX', 'Adobe Rose'],
      certificationTagList: [
        {
          certificateId: 1,
          name: 'Certificate Name 1',
        },
        {
          certificateId: 2,
          name: 'Certificate Name 2',
        },
      ],
    },
    multimediaList: [],
    priceInfo: {
      countryOfOriginal: 'TW',
      pricing: {
        currencyCode: 'USD',
        price: '100',
        unit: 'Y',
      },
      minimumOrder: {
        qty: 10,
        unit: 'Y',
      },
      minimumColor: {
        qty: 10,
        unit: 'Y',
      },
      productionLeadTimeInDays: '10',
      sampleLeadTimeInDays: '10',
    },
    inventoryTotalQtyInYard: 100,
    internalInfo: {
      tagList: ['100% Cotton', '14-5002 TCX', '15-0703 TCX'],
      remark: 'Remark',
      priceInfo: {
        countryOfOriginal: 'TW',
        pricing: {
          currencyCode: 'USD',
          price: '100',
          unit: 'Y',
        },
        minimumOrder: {
          qty: 10,
          unit: 'Y',
        },
        minimumColor: {
          qty: 10,
          unit: 'Y',
        },
        productionLeadTimeInDays: '10',
        sampleLeadTimeInDays: '10',
      },
      nativeCode: 'Native Code',
      inventoryInfo: {
        isTotalPublic: true,
        sampleCardsRemainingList: [
          {
            source: 'Source',
            shelf1: 'Shelf 1',
            shelf2: 'Shelf 2',
            location: 'Location',
            qtyInPcs: 100,
          },
          {
            source: 'Source',
            shelf1: 'Shelf 1',
            shelf2: 'Shelf 2',
            location: 'Location',
            qtyInPcs: 100,
          },
        ],
        hangersRemainingList: [
          {
            source: 'Source',
            shelf1: 'Shelf 1',
            shelf2: 'Shelf 2',
            location: 'Location',
            qtyInPcs: 100,
          },
          {
            source: 'Source',
            shelf1: 'Shelf 1',
            shelf2: 'Shelf 2',
            location: 'Location',
            qtyInPcs: 100,
          },
        ],
        yardageRemainingInfo: {
          unit: 'Y',
          list: [
            {
              source: 'Source',
              shelf1: 'Shelf 1',
              shelf2: 'Shelf 2',
              location: 'Location',
              productionNo: 'Production No',
              roll: 'Roll',
              lot: 'Lot',
              qty: 100,
            },
            {
              source: 'Source',
              shelf1: 'Shelf 1',
              shelf2: 'Shelf 2',
              location: 'Location',
              productionNo: 'Production No',
              roll: 'Roll',
              lot: 'Lot',
              qty: 100,
            },
          ],
        },
      },
      metaData: {
        createdByInfo: {
          username: 'Username',
          date: 1669652617,
          unitName: 'Unit Name',
          unitLabelColor: '#F2C94C',
          avatar: 'https://picsum.photos/200',
        },
        lastModifiedByInfo: {
          username: 'Username',
          avatar: 'https://picsum.photos/200',
          unitName: 'Unit Name',
          unitLabelColor: '#F2C94C',
          date: 1669652617,
        },
        copiedFromInfo: {
          date: 1669652617,
          orgName: 'Org Name',
          orgLogo: 'https://picsum.photos/200',
          copiedFromItemNo: 'Copied From Item No',
        },
      },
      attachmentList: [
        {
          fileId: 1,
          fileName: 'File Name',
          displayFileName: 'Png',
          originalUrl: 'https://picsum.photos/200',
          displayUrl: 'https://picsum.photos/200',
          thumbnailUrl: 'https://picsum.photos/200',
          extension: 'png',
        },
        {
          fileId: 2,
          fileName: 'File Name',
          displayFileName: 'Zip File',
          originalUrl:
            'https://textile-dev.frontier.cool/Resource/MaterialAttach/F081732790202_202309081855400253.zip',
          displayUrl:
            'https://textile-dev.frontier.cool/Resource/MaterialAttach/F081732790202_202309081855400253.zip',
          thumbnailUrl: null,
          extension: 'zip',
        },
        {
          fileId: 3,
          fileName: 'File Name',
          displayFileName: 'Mov File',
          originalUrl:
            'https://textile-dev.frontier.cool/Resource/MaterialAttach/F081732790202_202309081856419257.mov',
          displayUrl: null,
          thumbnailUrl: null,
          extension: 'mov',
        },
        {
          fileId: 4,
          fileName: 'File Name',
          displayFileName: 'Pdf File',
          originalUrl:
            'https://textile-dev.frontier.cool/Resource/TrendBoard/202308111828554512.pdf',
          displayUrl:
            'https://textile-dev.frontier.cool/Resource/TrendBoard/202308111828554512.jpg',
          thumbnailUrl:
            'https://textile-dev.frontier.cool/Resource/TrendBoard/202308111828554512.jpg',
          extension: 'pdf',
        },
      ],
    },
    metaData: {
      isComplete: false,
      updateDate: 1669652617,
      materialOwnerOGType: 1,
    },
    carbonEmission: {
      co2: 1.42,
      water: 0.3,
      land: 0.22,
      lastUpdateTime: 1669652617,
    },
  })

  const getAssetsMaterial = async (materialId: number) => {
    assetsApi.getAssetsMaterial({
      ...baseReq.value,
      materialId,
    })
  }

  return {
    material,
    getAssetsMaterial,
  }
})

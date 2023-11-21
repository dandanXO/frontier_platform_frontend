import { computed, reactive, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { z } from 'zod'
import type {
  MaterialDescription,
  MaterialFinish,
  MaterialOptions,
  MaterialOptionsContentListDefaultInner,
  MaterialSeasonInfoSeason,
} from '@frontier/platform-web-sdk'
import { MaterialType } from '@frontier/platform-web-sdk'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import type useMaterialSchema from '@/composables/material/useMaterialSchema'
import type { MenuTree } from '@frontier/ui-component'

type Nullable<T> = { [K in keyof T]: T[K] | null }

interface DescriptionListByType {
  default: Nullable<MaterialDescription>[]
  custom: Nullable<MaterialDescription>[]
}

const useMaterialDynamicMenu = (
  materialFormValues: z.infer<ReturnType<typeof useMaterialSchema>>,
  materialOptions: MaterialOptions,
  currentMaterialSide: Ref<MATERIAL_SIDE_TYPE>
) => {
  const { t } = useI18n()

  const menuTreePublicTag = ref({
    blockList: [
      {
        menuList:
          materialFormValues.tagInfo?.tagList?.map((tag) => ({
            title: tag,
            selectValue: tag,
          })) || [],
      },
    ],
  })

  const menuTreePrivateTag = ref({
    blockList: [
      {
        menuList:
          materialFormValues.internalInfo?.tagList?.map((tag) => ({
            title: tag,
            selectValue: tag,
          })) || [],
      },
    ],
  })

  const newSeasonList = reactive<Nullable<MaterialSeasonInfoSeason>[]>([])
  const newContentList = reactive<
    Nullable<MaterialOptionsContentListDefaultInner>[]
  >([])

  const newDescriptionList = reactive<{
    woven: DescriptionListByType
    knit: DescriptionListByType
    leather: DescriptionListByType
    nonWoven: DescriptionListByType
    trim: DescriptionListByType
    others: DescriptionListByType
  }>({
    woven: { default: [], custom: [] },
    knit: { default: [], custom: [] },
    leather: { default: [], custom: [] },
    nonWoven: { default: [], custom: [] },
    trim: { default: [], custom: [] },
    others: { default: [], custom: [] },
  })

  const getInitialFeatureList = () => [
    ...(materialFormValues.faceSide?.featureList || []),
    ...(materialFormValues.middleSide?.featureList || []),
    ...(materialFormValues.backSide?.featureList || []),
  ]
  const featureList = reactive<string[]>(getInitialFeatureList())
  const newFinishList = reactive<Nullable<MaterialFinish>[]>([])

  const currentSideMaterialType = computed(() => {
    if (
      !materialFormValues ||
      !currentMaterialSide.value ||
      currentMaterialSide.value === MATERIAL_SIDE_TYPE.MIDDLE
    ) {
      return null
    }

    const sideKey =
      currentMaterialSide.value === MATERIAL_SIDE_TYPE.FACE
        ? 'faceSide'
        : 'backSide'

    const sideValue = materialFormValues[sideKey]

    if (!sideValue) {
      return null
    }

    switch (sideValue.materialType) {
      case MaterialType.WOVEN:
        return 'woven'
      case MaterialType.KNIT:
        return 'knit'
      case MaterialType.LEATHER:
        return 'leather'
      case MaterialType.NON_WOVEN:
        return 'nonWoven'
      case MaterialType.TRIM:
        return 'trim'
      case MaterialType.OTHERS:
        return 'others'
      default:
        throw new Error('currentSideMaterialType is null')
    }
  })

  const descriptionMenuDefaultList = computed(() => {
    if (currentSideMaterialType.value == null) {
      return []
    }

    const materialOptionsDescriptionList = materialOptions.descriptionList

    return materialOptionsDescriptionList[
      currentSideMaterialType.value
    ].default.map((description) => ({
      title: description.name,
      selectValue: description,
    }))
  })

  const descriptionMenuCustomList = computed(() => {
    if (currentSideMaterialType.value == null) {
      return []
    }

    const materialOptionsDescriptionList = materialOptions.descriptionList
    if (materialOptionsDescriptionList == null) {
      return []
    }

    return [
      ...newDescriptionList[currentSideMaterialType.value].custom,
      ...materialOptionsDescriptionList[currentSideMaterialType.value].custom,
    ].map((description) => ({
      title: description.name,
      selectValue: description,
    }))
  })

  const contentCustomList = computed(() =>
    newContentList.concat(materialOptions.contentList.custom)
  )

  const contentDefaultList = computed(() => materialOptions.contentList.default)

  const allContentList = computed(() => [
    ...contentCustomList.value,
    ...contentDefaultList.value,
  ])

  const allSeasonList = computed(() => {
    const { default: defaultList, custom: customList } =
      materialOptions.seasonList
    return [...newSeasonList, ...defaultList, ...customList]
  })

  const specOptions = reactive({
    seasonList: computed(() => ({
      scrollAreaMaxHeight: 'max-h-72',
      blockList: [
        {
          blockTitle: t('RR0258'),
          menuList: newSeasonList
            .concat(materialOptions.seasonList?.custom || [])
            .map((season) => ({
              selectValue: season.name,
              title: season.name,
            })),
        },
        {
          menuList:
            materialOptions.seasonList?.default.map((season) => ({
              selectValue: season.name,
              title: season.name,
            })) || [],
        },
      ],
    })),
    contentList: computed(() => ({
      scrollAreaMaxHeight: 'max-h-72',
      blockList: [
        {
          blockTitle: t('RR0258'),
          menuList: contentCustomList.value.map((content) => ({
            selectValue: content.name,
            title: content.name,
          })),
        },
        {
          menuList: contentDefaultList.value.map((content) => ({
            selectValue: content.name,
            title: content.name,
          })),
        },
      ],
    })),
    featureList: computed(() => ({
      scrollAreaMaxHeight: 'max-h-72',
      blockList: [
        {
          blockTitle: t('RR0258'),
          menuList: featureList.concat([]).map((feature) => ({
            title: feature,
            selectValue: feature,
          })),
        },
      ],
    })),
    descriptionList: computed(() => ({
      scrollAreaMaxHeight: 'max-h-72',
      blockList: [
        { blockTitle: t('RR0258'), menuList: descriptionMenuCustomList.value },
        { menuList: descriptionMenuDefaultList.value },
      ],
    })),
    finishList: computed(() => ({
      scrollAreaMaxHeight: 'max-h-72',
      blockList: [
        {
          blockTitle: t('RR0258'),
          menuList: newFinishList
            .concat(materialOptions.finishList.custom || [])
            .map((finish) => ({
              title: finish.name,
              selectValue: finish,
            })),
        },
        {
          menuList:
            materialOptions.finishList.default.map((finish) => ({
              title: finish.name,
              selectValue: finish,
            })) || [],
        },
      ],
    })),
    certificateList: computed(() => ({
      blockList: [
        {
          menuList:
            materialOptions.certificateList.map(({ name, certificateId }) => ({
              title: name,
              selectValue: certificateId,
            })) || [],
        },
      ],
    })),
  })

  const addSeasonOption = (seasonName: string) => {
    newSeasonList.push({
      seasonId: null,
      name: seasonName,
    })
  }

  const addFeatureOption = (featureName: string) => {
    featureList.push(featureName)
  }

  const addDescriptionOption = (descriptionName: string) => {
    if (!currentSideMaterialType.value) {
      throw new Error('currentSideMaterialType is null')
    }

    newDescriptionList[currentSideMaterialType.value].custom.push({
      descriptionId: null,
      name: descriptionName,
    })
  }

  const addFinishOption = (finishName: string) => {
    newFinishList.push({
      finishId: null,
      name: finishName,
    })
  }

  const addContentOption = (contentName: string) => {
    newContentList.push({
      contentId: null,
      name: contentName,
    })
  }

  const addNewTag = (newMenu: string, source: MenuTree) => {
    source.blockList[0].menuList.push({
      title: newMenu,
      selectValue: newMenu,
    })
  }

  return {
    specOptions,
    allContentList,
    allSeasonList,
    menuTreePublicTag,
    menuTreePrivateTag,
    addSeasonOption,
    addFeatureOption,
    addDescriptionOption,
    addFinishOption,
    addContentOption,
    addNewTag,
  }
}

export default useMaterialDynamicMenu

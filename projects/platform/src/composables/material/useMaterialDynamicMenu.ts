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
// type 1:public, 2:private
import { MaterialOptionsTagListDefaultInnerTypeEnum } from '@frontier/platform-web-sdk'
import { MaterialType } from '@frontier/platform-web-sdk'
import { MATERIAL_SIDE_TYPE } from '@/utils/constants'
import type useMaterialSchema from '@/composables/material/useMaterialSchema'
import type { MenuTree } from '@frontier/ui-component'

type Nullable<T> = { [K in keyof T]: T[K] | null }

export interface DescriptionListByType {
  default: Nullable<MaterialDescription>[]
  custom: Nullable<MaterialDescription>[]
}

const useMaterialDynamicMenu = (
  materialFormValues: z.infer<ReturnType<typeof useMaterialSchema>>,
  materialOptions: MaterialOptions,
  currentMaterialSide: Ref<MATERIAL_SIDE_TYPE>
) => {
  const { t } = useI18n()
  const materialFormValuesInternalInfoTagList =
    materialFormValues.internalInfo.tagList
  const newPrivateTagList = reactive<Nullable<string>[]>([])
  const materialFormValuesTagInfoTagList = materialFormValues.tagInfo.tagList
  const newPublicTagList = reactive<Nullable<string>[]>([])
  const publicTagCustomList = computed(() => {
    const customList: any = []
    materialOptions.tagList.custom.map((item) => {
      if (item.type === MaterialOptionsTagListDefaultInnerTypeEnum.PUBLIC) {
        customList.push(item.name)
      }
    })
    // 去除 選擇和顯示 的重複顯示問題
    return (
      Array.from(
        new Set([
          ...newPublicTagList,
          ...materialFormValuesTagInfoTagList,
          ...customList,
        ])
      ).map((tag) => ({
        title: tag,
        selectValue: tag,
      })) || []
    )
  })
  const publicTagDefaultList = computed(() => {
    const defaultList: any = []
    materialOptions.tagList.default.map((item) => {
      if (item.type === MaterialOptionsTagListDefaultInnerTypeEnum.PUBLIC) {
        defaultList.push(item.name)
      }
    })
    return Array.from(new Set([...defaultList])).map((tag) => ({
      title: tag,
      selectValue: tag,
    }))
  })
  const menuTreePublicTag = computed(() => ({
    blockList: [
      {
        blockTitle: t('RR0258'),
        menuList: publicTagCustomList.value || [],
      },
      {
        menuList: publicTagDefaultList.value || [],
      },
    ],
  }))

  const privateTagCustomList = computed(() => {
    const customList: any = []
    materialOptions.tagList.custom.map((item) => {
      if (item.type === MaterialOptionsTagListDefaultInnerTypeEnum.PRIVATE) {
        customList.push(item.name)
      }
    })
    // 去除 選擇和顯示 的重複顯示問題
    return (
      Array.from(
        new Set([
          ...newPrivateTagList,
          ...materialFormValuesInternalInfoTagList,
          ...customList,
        ])
      ).map((tag) => ({
        title: tag,
        selectValue: tag,
      })) || []
    )
  })
  const privateTagDefaultList = computed(() => {
    const defaultList: any = []
    materialOptions.tagList.default.map((item) => {
      if (item.type === MaterialOptionsTagListDefaultInnerTypeEnum.PRIVATE) {
        defaultList.push(item.name)
      }
    })
    return Array.from(new Set([...defaultList])).map((tag) => ({
      title: tag,
      selectValue: tag,
    }))
  })
  const menuTreePrivateTag = computed(() => ({
    blockList: [
      {
        blockTitle: t('RR0258'),
        menuList: privateTagCustomList.value || [],
      },
      {
        menuList: privateTagDefaultList.value || [],
      },
    ],
  }))

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
        return null
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
  const addNewPublicTag = (contentName: string) => {
    newPublicTagList.push(contentName)
  }
  const addNewPrivateTag = (contentName: string) => {
    newPrivateTagList.push(contentName)
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
    addNewPublicTag,
    addNewPrivateTag,
  }
}

export default useMaterialDynamicMenu

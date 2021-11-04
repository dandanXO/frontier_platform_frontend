import { useI18n } from 'vue-i18n'
// import { computed } from '@vue/runtime-core'

export default function useSort (material) {
  const { t } = useI18n()

  const SORT_BY = {
    CREATE_DATE: 0,
    LAST_UPDATE: 1,
    MATERIAL_NO_A_Z: 2,
    RELEVANCE: 99
  }

  const createDate = {
    name: t('RR0065'),
    value: SORT_BY.CREATE_DATE
  }

  const lastUpdate = {
    name: t('RR0066'),
    value: SORT_BY.LAST_UPDATE
  }

  const materialNoA2Z = {
    name: t('RR0067'),
    value: SORT_BY.MATERIAL_NO_A_Z
  }

  const relevance = {
    name: t('RR0070'),
    value: SORT_BY.RELEVANCE
  }

  const sort = (materialList, sortBy) => {
    const tempArr = [...materialList]
    const { CREATE_DATE, LAST_UPDATE, MATERIAL_NO_A_Z, RELEVANCE } = SORT_BY

    switch (sortBy) {
      case CREATE_DATE:
        tempArr.sort((a, b) => b.createDate - a.createDate)
        break
      case LAST_UPDATE:
        tempArr.sort((a, b) => a.createDate - b.createDate)
        break
      case MATERIAL_NO_A_Z:
        tempArr.sort((a, b) => {
          const itemA = a.materialNo?.toUpperCase()
          const itemB = b.materialNo?.toUpperCase()
          if (itemA < itemB) {
            return -1
          }
          if (itemA > itemB) {
            return 1
          }
          return 0
        })
        break
      case RELEVANCE:
        break
    }
    return tempArr
  }

  return {
    sort,
    createDate,
    lastUpdate,
    materialNoA2Z,
    relevance
  }
}

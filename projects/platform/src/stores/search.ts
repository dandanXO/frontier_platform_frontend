import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import searchApi from '@/apis/search'
import {
  PaginationReqSortEnum,
  type PaginationRes,
  type SearchAITag,
} from '@frontier/platform-web-sdk'
import { getEnumTextValueMap } from '@/utils/mapping'
import { SortByText } from '@/utils/enumText'
import { useRoute } from 'vue-router'

export const useSearchStore = defineStore('search', () => {
  const route = useRoute()
  const keyword = ref<string | null>(null)
  const setKeyword = (k: string | null) => (keyword.value = k)
  const tagList = ref<SearchAITag[]>([])
  const setTagList = (tags: SearchAITag[]) => (tagList.value = tags)
  const selectedTagList = ref<SearchAITag[]>([])
  const setSelectedTagList = (tags: SearchAITag[]) =>
    (selectedTagList.value = tags)
  const sort = ref<PaginationReqSortEnum>(PaginationReqSortEnum.LAST_UPDATE)
  const setSort = (s: PaginationReqSortEnum) => (sort.value = s)
  const sortOption = computed(() =>
    getEnumTextValueMap<typeof PaginationReqSortEnum>(
      SortByText,
      PaginationReqSortEnum
    )
  )
  const isShowMatch = ref(false)
  const setIsShowMatch = (isMatch: boolean) => (isShowMatch.value = isMatch)

  const getAITags = async () => {
    if (!keyword.value) {
      return
    }

    const { data } = await searchApi.searchGetAiTagsPost({
      searchKeyword: keyword.value,
    })
    const tagList = data.result?.tagList ?? []
    const tempSelectedTagList = selectedTagList.value.filter((selectedTag) =>
      tagList.some((tag) => tag.name === selectedTag.name)
    )
    setTagList(tagList)
    setSelectedTagList(tempSelectedTagList)
  }

  const paginationRes = ref<PaginationRes>()
  const setPaginationRes = (res: PaginationRes) => (paginationRes.value = res)

  const getSearchLog = () => {
    const rank = route.query.rank ?? null
    if (!rank || !keyword.value) {
      return null
    }

    return {
      keyword: keyword.value,
      rank: Number(rank),
    }
  }

  return {
    keyword,
    setKeyword,
    tagList,
    setTagList,
    selectedTagList,
    setSelectedTagList,
    sort,
    setSort,
    isShowMatch,
    setIsShowMatch,
    paginationRes,
    setPaginationRes,
    getAITags,
    sortOption,
    getSearchLog,
  }
})

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

export const useSearchStore = defineStore('search', () => {
  const keyword = ref('')
  const setKeyword = (k: string) => (keyword.value = k)
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
    if (keyword.value === '') {
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
  }
})

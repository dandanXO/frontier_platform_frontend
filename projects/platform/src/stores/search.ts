import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import searchApi from '@/apis/search'
import {
  PaginationReqSortEnum,
  type S3UploadedObject,
  type PaginationRes,
  type SearchAITag,
} from '@frontier/platform-web-sdk'
import { getEnumTextValueMap } from '@/utils/mapping'
import { SortByText } from '@/utils/enumText'
import { uploadFileToS3 } from '@/utils/fileUpload'

interface ImageData extends S3UploadedObject {
  url: string
}

export const useSearchStore = defineStore('search', () => {
  const route = useRoute()
  const keyword = ref<string | null>(null)
  const imageInput = ref<ImageData>()
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

  const setImageInput = async (file: File) => {
    const { s3UploadId, fileName } = await uploadFileToS3(file, file.name)

    imageInput.value = {
      url: URL.createObjectURL(file),
      fileName,
      s3UploadId,
    }
  }

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

  const paginationRes = ref<PaginationRes>({
    isShowMatch: false,
    currentPage: 1,
    perPageCount: 40,
    totalCount: 0,
    totalPage: 1,
    sort: 1,
  })
  const setPaginationRes = (res: PaginationRes) => (paginationRes.value = res)

  const getSearchLog = () => {
    const dummyDefaultRank = -1
    const rank = route.query.rank ?? dummyDefaultRank
    if (!keyword.value) {
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
    imageInput,
    setImageInput,
    getAITags,
    sortOption,
    getSearchLog,
  }
})

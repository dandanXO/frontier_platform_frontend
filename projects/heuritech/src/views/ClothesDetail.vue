<template lang="pug">
div(class="pt-5 pl-10 pr-3 flex gap-x-5")
  div(class="w-1/5 flex flex-col gap-y-1 flex-shrink-0")
    h4(class="text-h5") {{ clothes?.title }}
    h5(class="line-clamp-4") {{ clothes?.description }} description description description description description description description description description description description description description description description description description description
    clothes-image#clothes-image(v-bind="clothes")
    router-link(to="/" class="self-start rounded text-grey-100 px-3 py-1 bg-heuritech") Back
  div(class="flex-grow")
    div(class="flex items-center h-9 gap-x-3")
      div(class="flex items-center")
        span(class="text-body1") Search from: &nbsp
        f-label(
          :class="[searchFrom === SEARCH_FROM.PUBLIC ? '!bg-heuritech !text-grey-0' : 'hover:!bg-heuritech hover:!text-grey-0 !text-heuritech !bg-grey-0']"
          @click="switchSearchFrom(SEARCH_FROM.PUBLIC)"
        ) Public
        span &nbsp&nbsp
        f-label(
          :class="[searchFrom === SEARCH_FROM.ASSETS ? '!bg-heuritech !text-grey-0' : 'hover:!bg-heuritech hover:!text-grey-0 !text-heuritech !bg-grey-0']"
          @click="switchSearchFrom(SEARCH_FROM.ASSETS)"
        ) Org's Assets
      div(class="flex items-center")
        span(class="text-body1") Search mode: &nbsp
        f-label(
          :class="[searchMode === SEARCH_MODE.SIMILARITY ? '!bg-heuritech !text-grey-0' : 'hover:!bg-heuritech hover:!text-grey-0 !text-heuritech !bg-grey-0']"
          @click="switchSearchMode(SEARCH_MODE.SIMILARITY)"
        ) Similarity
        span &nbsp&nbsp
        f-label(
          :class="[searchMode === SEARCH_MODE.KEYWORD ? '!bg-heuritech !text-grey-0' : 'hover:!bg-heuritech hover:!text-grey-0 !text-heuritech !bg-grey-0']"
          @click="switchSearchMode(SEARCH_MODE.KEYWORD)"
        ) Keyword
      div(class="w-px h-1/2 bg-grey-600")
      div(v-if="searchMode === SEARCH_MODE.SIMILARITY" class="flex items-center gap-x-1")
        div(
          v-for="color in colorList"
          :key="color"
          class="w-9 h-9 rounded overflow-hidden cursor-pointer"
          :class="{ 'border-[3px] border-heuritech': color === currentColor }"
          @click="searchByColor(color)"
        )
          img(:src="getColorImageUrl(color)" class="object-contain object-center")
      f-input-text(
        v-if="searchMode === SEARCH_MODE.KEYWORD"
        v-model:textValue="searchKeyword"
        prependIcon="search"
        placeholder="keyword"
        size="md"
        class="w-80"
      )
    div(:style="{ height: scrollContainerHeight + 'px' }" class="mt-2 overflow-y-auto")
      template(v-if="!isFetching")
        div(
          v-if="materialList.length === 0"
          class="h-full flex items-center justify-center"
        )
          p Not result found, Try another keyword !
        div(v-else class="grid grid-cols-3 md:grid-cols-5 gap-y-1 gap-x-3 mr-3")
          div(v-for="material in materialList" :key="material.frontierNo")
            div(
              class="aspect-square rounded shadow-2 border border-grey-200 cursor-pointer"
              @click="openMaterialDetailCarousel(material.frontierNo)"
            )
              img(:src="material.coverImg" class="w-full h-full object-cover rounded")
            span(
              class="text-body2 cursor-pointer"
              @click="openMaterialDetailCarousel(material.frontierNo)"
            ) {{ material.frontierNo }}
      div(v-else class="h-full flex items-center justify-center")
        f-svg-icon(iconName="loading" class="text-heuritech" size="120")
  div(
    v-if="isOpeningLoginModal"
    class="w-screen h-screen bg-grey-900/70 fixed inset-0 z-50 flex items-center justify-center"
  )
    div(class="w-100 p-15 bg-grey-0 rounded flex flex-col items-center gap-y-3 relative")
      f-svg-icon(
        iconName="close"
        class="absolute right-4 top-4 text-grey-600 cursor-pointer"
        @click="isOpeningLoginModal = false"
      )
      img(class="w-35" src="@/assets/images/frontier_logo.png")
      div(class="w-full h-px bg-grey-200 my-3")
      f-input-text(
        v-model:textValue="email"
        prependIcon="mail"
        placeholder="Email"
        class="w-full"
      )
      f-input-password(
        v-model:textValue="password"
        placeholder="Password"
        class="w-full"
      )
      f-button(size="lg" class="w-full" @click="login" :disabled="!email || !password") LOGIN
  material-detail-carousel(
    v-if="isOpenCarousel"
    :materialList="materialList"
    :initialFrontierNo="selectedFrontierNo"
    @close="isOpenCarousel = false"
  )
</template>

<script setup lang="ts">
import clothesJSON from '@/assets/clothes.json'
import type { Clothes } from '@/types'
import type { Material } from '@frontier/platform-web-sdk'
import ClothesImage from '@/components/ClothesImage.vue'
import MaterialDetailCarousel from '@/components/MaterialDetailCarousel.vue'

import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  fetchMaterialListFromAssets,
  fetchMaterialListFromPublic,
} from '@/apis'
import debounce from 'debounce'

const props = defineProps<{
  clothesId: string
}>()

const route = useRoute()
const router = useRouter()

const scrollContainerHeight = ref(window.innerHeight - 180)
const clothesList: Clothes[] = clothesJSON
const currentColor = ref(route.query.color as string)

watch(
  () => route.query.color,
  (newColor) => {
    isOpenCarousel.value = false
    searchByColor(newColor as string)
  }
)

const clothes = computed(
  () => clothesList.find((clothes) => clothes.clothesId === props.clothesId)!
)
const colorList = computed(
  () => new Set(clothes.value.mapAreaList.map((area) => area.color))
)
const getColorImageUrl = (color: string) => {
  return new URL(
    `/src/assets/images/${clothes.value.clothesId}/${color}.png`,
    import.meta.url
  ).href
}

enum SEARCH_FROM {
  PUBLIC = 1,
  ASSETS = 2,
}
const searchFrom = ref(SEARCH_FROM.PUBLIC)
const switchSearchFrom = (v: SEARCH_FROM) => {
  if (v === SEARCH_FROM.ASSETS && !hasLogin.value) {
    isOpeningLoginModal.value = true
    return
  }
  searchFrom.value = v
}

enum SEARCH_MODE {
  SIMILARITY = 1,
  KEYWORD = 2,
}
const searchMode = ref(SEARCH_MODE.SIMILARITY)
const switchSearchMode = (v: SEARCH_MODE) => {
  searchMode.value = v
  if (v === SEARCH_MODE.KEYWORD) {
    searchKeyword.value = ''
    fetchMaterialList()
  }
}

const searchedMaterialList = ref<Material[]>([])
const materialList = computed(() =>
  searchMode.value === SEARCH_MODE.KEYWORD
    ? searchedMaterialList.value.map((material) => ({
        frontierNo: material.frontierNo!,
        coverImg: material.coverImg!,
      }))
    : clothes.value.materialList
        .filter((material) => material.color === currentColor.value)
        .filter((material) => {
          if (searchFrom.value === SEARCH_FROM.PUBLIC) {
            return material.isPublic
          } else {
            return !material.isPublic
          }
        })
        .map((material) => ({
          frontierNo: material.frontierNo,
          coverImg: material.imageUrl,
        }))
)

const isFetching = ref(false)

const searchKeyword = ref('')
const fetchMaterialList = async () => {
  isFetching.value = true
  let response
  try {
    if (searchFrom.value === SEARCH_FROM.PUBLIC) {
      response = await fetchMaterialListFromPublic(searchKeyword.value)
    } else {
      response = await fetchMaterialListFromAssets(searchKeyword.value)
    }
    searchedMaterialList.value = response.data.result.material as Material[]
  } catch (e) {
    console.log(e)
  } finally {
    isFetching.value = false
  }
}
const debounceFetchMaterialList = debounce(fetchMaterialList, 500)

watch([searchKeyword, searchFrom], () => {
  if (searchMode.value === SEARCH_MODE.KEYWORD) {
    debounceFetchMaterialList()
  }
})

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))

const searchByColor = async (color: string) => {
  isFetching.value = true
  currentColor.value = color
  await router.push({
    name: route.name!,
    query: {
      ...route.query,
      color,
    },
  })
  await sleep(500)
  isFetching.value = false
}

const isOpeningLoginModal = ref(false)
const hasLogin = ref(sessionStorage.getItem('hasLogin') === 'true')
const email = ref('')
const password = ref('')
const login = () => {
  isOpeningLoginModal.value = false
  hasLogin.value = true
  sessionStorage.setItem('hasLogin', 'true')
  searchFrom.value = SEARCH_FROM.ASSETS
}

const isOpenCarousel = ref(false)
const selectedFrontierNo = ref('')
const openMaterialDetailCarousel = (frontierNo: string) => {
  selectedFrontierNo.value = frontierNo
  isOpenCarousel.value = true
}
</script>

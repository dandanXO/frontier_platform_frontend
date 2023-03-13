<template lang="pug">
div(
  class="w-118.5 h-screen fixed z-sidebar right-0 bg-grey-100 drop-shadow-4 flex flex-col"
)
  //- Header
  div(class="w-full h-17.5 pl-4 pr-5 bg-grey-0 border-b border-grey-150 flex items-center")
    template(v-if="!isEditingDigitalThreadName")
      f-svg-icon(
        iconName="arrow_back"
        size="20"
        class="text-grey-600 hover:text-primary-400"
        tooltip="Show all threads"
      )
      div(class="w-px h-6 bg-grey-150 mx-4")
      div(
        class="flex-grow flex items-center"
        @mouseenter="isHoverHeader = true"
        @mouseleave="isHoverHeader = false"
      )
        div(class="flex-shrink pr-2.5")
          f-svg-icon(iconName="sticker_thread" size="20" class="text-grey-900")
        p(
          class="text-body1 font-bold line-clamp-1"
          :class="[isCreatingDigitalThread ? 'text-grey-300' : 'text-grey-900 flex-grow']"
        ) {{ digitalThread.digitalThreadName }}
        div(class="flex-shrink pl-4 flex items-center gap-x-4")
          f-svg-icon(
            v-if="isHoverHeader"
            iconName="create"
            size="20"
            class="text-grey-600 hover:text-primary-400"
            :tooltip="$t('TT0003')"
            @click="openDigitalThreadNameEditor"
          )
          f-svg-icon(
            v-if="!isCreatingDigitalThread"
            iconName="summary"
            size="20"
            class="text-grey-600 hover:text-primary-400"
            :tooltip="$t('TT0067')"
            @click="openModalDigitalThreadSummary"
          )
      f-svg-icon(
        iconName="clear"
        size="20"
        class="text-grey-600 hover:text-primary-400 ml-4"
        tooltip="Close"
        @click="$store.dispatch('sticker/closeStickerDrawer')"
      )
    template(v-else)
      f-input-text(v-model:textValue="tempDigitalThreadName" class="flex-grow")
      f-button(
        type="primary"
        size="sm"
        class="ml-3 mr-2"
        :disabled="tempDigitalThreadName === ''"
        @click="saveDigitalThreadName"
      ) {{ $t('UU0018') }}
      f-button(
        type="text"
        size="sm"
        @click="isEditingDigitalThreadName = false"
      ) {{ $t('UU0002') }}
  div(
    class="w-full h-28 px-8 pt-3 pb-2.5 bg-grey-0 drop-shadow-4"
    :key="currentMaterialId"
  )
    //- Material Info
    div(class="flex items-center gap-x-4")
      div(class="w-13 h-13 rounded overflow-hidden")
        img(v-defaultImg class="w-full h-full" src="https://picsum.photos/50")
      div(class="flex-grow h-11")
        p(class="pb-2 text-body2 font-bold text-grey-800") {{ `#${material.materialNo}` }}
        div(class="flex items-center gap-x-2")
          img(class="w-5 h-5 rounded-full" :src="material.unitLogo")
          p(class="text-caption text-grey-800") {{ material.unitName }}
    //- Control Bar
    div(class="pt-2.5 flex items-center gap-x-2")
      f-input-select(
        v-model:selectValue="filterAddTo"
        :dropdownMenuTree="menuAddTo"
        class="w-30"
        size="sm"
      )
      div(class="w-px py-2 box-content bg-grey-150")
      div(
        class="px-2.5 h-6 rounded-[20px] flex justify-center items-center gap-x-0.5 cursor-pointer"
        :class="[isStarred ? 'bg-primary-0' : 'bg-grey-100']"
        @click="!isCreatingDigitalThread && (isStarred = !isStarred)"
      )
        f-svg-icon(
          iconName="starred"
          size="14"
          :class="[isCreatingDigitalThread ? 'text-grey-200' : 'text-yellow-400']"
        )
        span(
          :class="{ 'text-grey-200': isCreatingDigitalThread, 'text-grey-800': !isCreatingDigitalThread && !isStarred, 'text-primary-400': isStarred }"
          class="text-body2"
        ) {{ 'Starred' }}
        span(v-if="isStarred" class="pl-1 text-caption fond-bold text-primary-500") {{ digitalThread.stickerStatistics.starredQty }}
      div(class="px-2 h-6 rounded-[20px] bg-grey-100 flex items-center")
        f-svg-icon(iconName="filter" size="16" class="text-grey-800")
  //- Content
  f-scrollbar-container(class="flex-grow pt-4")
    //- Button: Add a sticker
    div(v-if="!isAddingSticker" class="pl-8 pr-10.5")
      div(
        class="relative w-full h-16 bg-grey-0 rounded-md overflow-hidden drop-shadow-2 cursor-pointer"
        @click="isAddingSticker = true"
      )
        div(class="absolute top-0 left-0 w-1 h-full bg-forestgreen-300")
        div(class="pl-7.5 h-full flex items-center")
          f-svg-icon(iconName="add" size="20" class="text-forestgreen-300")
          span(class="text-body2 font-bold text-grey-800 pl-3") {{ $t('TT0092') }}
    //- Default intro
    div(v-if="isCreatingDigitalThread && !isAddingSticker" class="pl-8 pr-10.5")
      div(class="pt-10")
        img(src="@/assets/images/image_sticker_empty.png" class="w-72.5 ml-15")
        i18n-t(
          keypath="TT0004"
          tag="p"
          class="text-h6 font-bold text-grey-300 text-center pb-6"
          scope="global"
        )
          template(#TT0092)
            span(class="text-grey-800") {{ $t('TT0092') }}
        p(class="text-body2 leading-1.6 text-grey-400 text-center") {{ $t('TT0005') }}
    //- State - Normal
    template(v-else)
      div(v-if="isAddingSticker" class="pl-8 pr-7")
        sticker-create(
          :isCreatingDigitalThread="isCreatingDigitalThread"
          :digitalThreadName="digitalThread.digitalThreadName"
          @close="isAddingSticker = false"
        )
      div(class="pt-3 pl-8 pr-10.5 flex flex-col gap-y-3")
        sticker-card(
          v-for="sticker in stickerList"
          :key="sticker.stickerId"
          :sticker="sticker"
        )
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import StickerCreate from '@/components/sticker/StickerCreate.vue'
import { STICKER_ADD_TO } from '@/utils/constants.js'
import StickerCard from '@/components/sticker/StickerCard.vue'

const store = useStore()
const { t } = useI18n()

const currentMaterialId = computed(
  () => store.getters['sticker/currentMaterialId']
)
const material = computed(() => store.getters['sticker/material'])
const digitalThread = computed(() => store.getters['sticker/digitalThread'])
const stickerList = computed(() => digitalThread.value.stickerList)
const isHoverHeader = ref(false)
const isCreatingDigitalThread = computed(() => stickerList.value.length === 0) // 全新的 digital thread 尚未建立任何一個 sticker
const isAddingSticker = ref(false)

const isEditingDigitalThreadName = ref(false)
const tempDigitalThreadName = ref('')
const openDigitalThreadNameEditor = () => {
  isEditingDigitalThreadName.value = true
  tempDigitalThreadName.value = digitalThread.value.digitalThreadName
}
const saveDigitalThreadName = () => {
  isEditingDigitalThreadName.value = false
  digitalThread.value.digitalThreadName = tempDigitalThreadName.value

  if (!isCreatingDigitalThread.value) {
    /**
     * @Todo
     */
    // call digital-thread/update/digital-thread-name
  }
}

const filterAddTo = ref(STICKER_ADD_TO.ALL)
const isStarred = ref(false)

const menuAddTo = computed(() => ({
  blockList: [
    {
      menuList: [
        {
          title: 'All',
          selectValue: STICKER_ADD_TO.ALL,
          icon: 'all',
        },
        {
          title: t('TT0009'),
          selectValue: STICKER_ADD_TO.EXTERNAL,
          icon: 'external',
        },
        {
          title: t('TT0010'),
          selectValue: STICKER_ADD_TO.INTERNAL,
          icon: 'internal',
        },
      ],
    },
  ],
}))

onMounted(async () => {
  await store.dispatch('sticker/fetchStickerDrawerData')
})

watch(
  () => digitalThread.value,
  () => {
    store.commit('sticker/UPDATE_digitalThread', digitalThread.value)
  },
  {
    deep: true,
  }
)

const openModalDigitalThreadSummary = () => {
  console.log('openModalDigitalThreadSummary')
}
</script>

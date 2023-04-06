<template lang="pug">
div(class="fixed w-118.5 h-screen z-sidebar right-0")
  div(class="relative z-1 w-full h-full bg-grey-100 shadow-4 flex flex-col")
    //- Header
    div(
      class="w-full h-17.5 pl-4 pr-5 bg-grey-0 border-b border-grey-150 flex items-center"
    )
      f-svg-icon(
        iconName="arrow_back"
        size="20"
        class="text-grey-200"
        tooltip="Show all threads"
      )
      div(class="w-px h-6 bg-grey-150 mx-4")
      div(class="flex-grow flex items-center")
        f-svg-icon(iconName="sticker_thread" size="20" class="text-grey-900")
        p(class="flex-grow pl-2.5 text-body1 font-bold line-clamp-1 text-grey-300") Untitled
        f-svg-icon(
          iconName="clear"
          size="20"
          class="text-grey-600 hover:text-primary-400 ml-4 cursor-pointer"
          tooltip="Close"
          @click="closeStickerDrawer"
        )
    div(class="w-full h-28 px-8 pt-3 pb-2.5 bg-grey-0 shadow-4")
      //- Material Info
      div(class="flex items-center gap-x-4")
        img(
          v-defaultImg
          class="flex-shrink-0 w-13 h-13 rounded overflow-hidden"
          :src="material.coverImg"
        )
        div(class="flex-grow h-11")
          p(class="pb-2 flex items-center text-body2 text-grey-800")
            span(class="font-bold line-clamp-1") {{ material.materialNo }}
          div(class="flex items-center gap-x-2")
            f-avatar(:imageUrl="material.unitLogo" type="org" size="xs")
            span(class="text-caption text-grey-800") {{ material.unitName }}
      //- Filter
      div(class="pt-2.5 flex items-center gap-x-2")
        f-select-dropdown(
          v-model:selectValue="addTo"
          :dropdownMenuTree="menuAddTo"
          class="w-30"
          size="sm"
        )
        div(class="w-px py-2 box-content bg-grey-150")
        //- isStarred
        div(
          class="px-2.5 h-6 rounded-[20px] flex justify-center items-center gap-x-0.5 bg-grey-100"
        )
          f-svg-icon(iconName="starred" size="14" class="text-grey-200")
          span(class="text-body2 text-grey-200") {{ 'Starred' }}
        //- Advance Filter Panel
        div(class="px-2 h-6 rounded-[20px] bg-grey-100 flex items-center")
          f-svg-icon(iconName="filter" size="16" class="text-grey-800")
    //- Content
    f-scrollbar-container(class="flex-grow")
      div(class="py-4")
        //- Button: Add a sticker
        div(class="pl-8 pr-10.5")
          div(class="relative w-full h-16 rounded-md overflow-hidden shadow-2 bg-grey-50")
            div(class="absolute top-0 left-0 w-1 h-full bg-forestgreen-300")
            div(class="pl-7.5 h-full flex items-center")
              f-svg-icon(iconName="add" size="20" class="text-forestgreen-300")
              span(class="text-body2 font-bold pl-3 text-grey-200") {{ $t('TT0092') }}
        div(class="pt-23.5 px-16.5 flex flex-col items-center gap-y-4")
          f-button(size="lg" @click="goToLogin") {{ $t('AA0001') }}
          p(class="text-body2 text-grey-600 leading-1.6 text-center") {{ $t('TT0108') }}
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { STICKER_ADD_TO, SIGNUP_SOURCE } from '@/utils/constants'
import { useRouter } from 'vue-router'

const store = useStore()
const { t } = useI18n()
const router = useRouter()

const addTo = ref(STICKER_ADD_TO.ALL)

const material = computed(() => store.getters['sticker/material'])

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

const closeStickerDrawer = () => {
  store.commit('sticker/SET_isReceivedShareStickerDrawerOpen', false)
}

const goToLogin = () => {
  router.push({
    name: 'SignIn',
    query: {
      signupSourceType: SIGNUP_SOURCE.RECEIVED_SHARE,
      redirect: window.location.pathname,
    },
  })
}

const hasLogin = computed(() => store.getters['receivedShare/hasLogin'])
watch(
  () => hasLogin.value,
  () => {
    if (hasLogin.value) {
      closeStickerDrawer()
      store.dispatch('sticker/openStickerDrawer', {
        materialId: material.value.materialId,
        drawerOpenFromLocationList:
          store.getters['sticker/drawerOpenFromLocationList'],
        drawerOpenFromLocationType:
          store.getters['sticker/drawerOpenFromLocationType'],
      })
    }
  },
  {
    immediate: true,
  }
)
</script>

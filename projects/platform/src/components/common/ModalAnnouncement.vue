<!-- <template lang="pug">
div(
  ref="refAnnouncement"
  class="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-grey-900/40 z-100"
  @click="closeAnnouncement"
)
  div(class="w-192.5 h-119.5 bg-grey-0 rounded relative flex overflow-hidden" @click.stop)
    f-svg-icon(
      iconName="clear"
      class="absolute cursor-pointer top-5 right-5 text-grey-600"
      @click="closeAnnouncement"
    )
    div(class="h-full w-70 shrink-0")
      img(:src="contentList[activeContentIndex].leftSideImg")
    div(class="flex-grow pt-8 pl-10.5 pr-5.5")
      div(class="flex flex-col pr-9 gap-y-2")
        h3(class="font-bold text-caption text-primary-400") {{ $t('TT0115') }}
        h3(class="text-h3/1.3 text-grey-900 font-medium") {{ $t('TT0132') }}
        p(class="text-body2/1.6 text-grey-900") {{ $t('TT0174') }}
          span(
            class="cursor-pointer text-cyan-400"
            @click="store.dispatch('helper/pushModal', { component: 'modal-thread-board-feature-reminder' })"
          ) {{ ' ' + $t('RR0275') }}
      div(class="flex flex-col pt-8 gap-y-2")
        div(
          v-for="(content, index) in contentList"
          :key="index"
          class="flex p-4 rounded-lg cursor-pointer gap-x-3 hover:bg-grey-150 hover:outline outline-grey-150 outline-1"
          :class="activeContentIndex === index ? 'bg-grey-50 outline' : ''"
          @click="activeContentIndex = index"
        )
          f-svg-icon(
            :iconName="content.iconName"
            size="32"
            :class="{ [content.iconActiveClass]: activeContentIndex === index }"
          )
          div(class="")
            p(class="text-body2/1.6 text-grey-900 font-bold") {{ content.title }}
            p(class="text-body2/1.6 text-grey-600") {{ content.description }}
    f-button(
      class="absolute bottom-5 right-5"
      type="secondary"
      size="md"
      @click="closeAnnouncement"
    ) {{ $t('UU0094') }}
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import announcement1 from '@/assets/images/announcement/img_threadboard_announcement_01.png'
import announcement2 from '@/assets/images/announcement/img_threadboard_announcement_02.png'

const store = useStore()
const { t } = useI18n()

interface Content {
  iconName: string
  iconActiveClass: string
  title: string
  description: string
  leftSideImg: string
}

const activeContentIndex = ref(0)

const contentList = computed<Content[]>(() => [
  {
    iconName: 'board',
    iconActiveClass: 'text-primary-300',
    title: t('TT0132'),
    description: t('TT0175'),
    leftSideImg: announcement1,
  },
  {
    iconName: 'workflow_stage',
    iconActiveClass: 'text-cyan-300',
    title: t('TT0176'),
    description: t('TT0177'),
    leftSideImg: announcement2,
  },
])

const refAnnouncement = ref<HTMLElement>()

</script> -->

<template>
  <ModalAnnouncementV2
    :content="[
      {
        img: announcement1,
        title: t('RR0578'),
        description: t('RR0579'),
        secondaryBtnText: t('UU0155'),
        primaryBtnText: t('RR0453'),
      },
      {
        img: announcement2,
        title: t('RR0580'),
        description: t('RR0581'),
        secondaryBtnText: t('UU0155'),
        primaryBtnText: t('UU0200'),
      },
      {
        img: announcement3,
        title: t('RR0582'),
        description: t('RR0583'),
        secondaryBtnText: t('UU0026'),
        primaryBtnText: t('UU0199'),
      },
    ]"
    :primaryBtnClick="closeAnnouncement"
    :secondaryBtnClick="closeAnnouncementSecondary"
    :onClose="() => 0"
  />
</template>

<script lang="ts" setup>
import announcement1 from '@/assets/images/announcement/custom_field_01.png'
import announcement2 from '@/assets/images/announcement/custom_field_02.png'
import announcement3 from '@/assets/images/announcement/custom_field_03.png'
import ModalAnnouncementV2 from '@/components/common/ModalAnnouncementV2.vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { OgType } from '@frontier/platform-web-sdk'

const { t } = useI18n()
const store = useStore()
const { goToAssetMaterialEdit } = useNavigation()
const materialId = ref<number>(0)

const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

onMounted(async () => {
  const payload = {
    pagination: {
      sort: 7,
      isShowMatch: false,
      targetPage: 1,
      perPageCount: 30,
    },
    search: {
      keyword: null,
      tagList: [],
    },
    filter: null,
  }
  const { data } = await ogBaseAssetsApi('getAssetMaterialSlimList', payload, {
    // cancelToken: cancelTokenSourceSlim.token,
  })

  if (data?.result?.materialList?.length) {
    materialId.value = data?.result?.materialList[0].materialId
  }
})

const closeAnnouncement = () => {
  goToAssetMaterialEdit(materialId.value, OgType.ORG)
  store.dispatch('user/readAnnouncement')
  store.commit('user/SET_isShowAnnouncement', false)
  store.dispatch('helper/closeModal')
}
const closeAnnouncementSecondary = () => {
  store.dispatch('user/readAnnouncement')
  store.commit('user/SET_isShowAnnouncement', false)
  store.dispatch('helper/closeModal')
}
</script>

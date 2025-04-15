<template lang="pug">
f-scrollbar-container(class="w-full h-full")
  div(class="ml-7.5 mt-7.5")
    global-breadcrumb-list(
      :breadcrumbList="locationList"
      @click:item="$event.goTo()"
    )
  div(class="w-full flex justify-center")
    div(class="w-full p-8")
      div(class="mt-9.5")
        div(class="flex justify-between")
          h3(
            class="text-h3 text-grey-900 pb-5 font-medium"
            data-cy="smart-upload-title"
          ) {{ $t('DD0138') }}
          div(class="flex flex-row items-center gap-x-4")
            f-input-switch(
              v-if="uploadPageUseBothUi"
              :inputValue="assetsStore.useNewAssetsView"
              @update:inputValue="changeViewSwitch"
              :label="$t('DD0139')"
              :innerClass="'text-primary-400'"
            )
            f-button(
              size="md"
              type="secondary"
              prependIcon="player_play"
              @click="openVideo"
            ) {{ $t('DD0140') }}
            f-button(
              size="md"
              @click="openModalUploadSettings"
              type="secondary"
              prependIcon="setting"
            ) {{ $t('DD0141') }}
      div(class="flex flex-row gap-x-4") 
        div(class="w-1/2 xl:w-5/12 flex flex-col gap-y-4") 
          div(
            @click="clickFileOption('2d_file')"
            class="bg flex flex-row justify-between gap-x-3 p-4 rounded-lg border border-grey-200"
            :class="[currentSelectedOption === fileOptionId['2d_file'] ? 'text-grey-0' : 'text-grey-700', { 'bg-active': currentSelectedOption === fileOptionId['2d_file'] }]"
          )
            div(class="flex flex-row flex-grow")
              f-svg-icon(
                iconName="picture"
                size="32"
                class="mr-5 mt-2"
                :class="[currentSelectedOption === fileOptionId['2d_file'] ? 'text-grey-0' : 'text-grey-800']"
              )
              div(class="flex-grow")
                p(class="font-bold text-base mb-1") {{ $t('DD0150') }}
                p(
                  class="text-sm border-b pb-3 mb-3"
                  :class="[currentSelectedOption === fileOptionId['2d_file'] ? 'text-grey-0' : 'text-grey-700']"
                ) {{ $t('DD0099') }}
                ul(
                  class="list-disc list-inside text-xs ml-1"
                  :class="[currentSelectedOption === fileOptionId['2d_file'] ? 'text-grey-0' : 'text-grey-700']"
                )
                  li {{ $t('RR0145') }}
                    i18n-t(keypath="DD0101" tag="span" class="font-bold")
                      template(#number) &nbsp; {{ bytesToSize(fileSizeMaxLimit) }}
                  li {{ $t('RR0244') }} &nbsp;
                    span(class="font-bold") {{ $t('DD0119') }}
                  li {{ $t('DD0146') }}&nbsp;
                    |
                    span(class="font-bold") 300 DPI
            div
              f-svg-icon(
                iconName="keyboard_arrow_right"
                size="32"
                :class="[currentSelectedOption === fileOptionId['2d_file'] ? 'text-grey-0' : 'text-grey-800']"
              )
          //- TODO hide wait back end api
          div(
            @click="clickFileOption('3d_file')"
            class="bg text-grey-0 flex flex-row justify-between gap-x-3 p-4 rounded-lg border border-grey-200"
            :class="[currentSelectedOption === fileOptionId['3d_file'] ? 'text-grey-0' : 'text-grey-700', { 'bg-active': currentSelectedOption === fileOptionId['3d_file'] }]"
          )
            div(class="flex flex-row flex-grow")
              f-svg-icon(
                iconName="3d_file"
                size="32"
                class="mr-5 mt-2"
                :class="[currentSelectedOption === fileOptionId['3d_file'] ? 'text-grey-0' : 'text-grey-800']"
              )
              div(class="flex-grow")
                p(
                  class="font-bold text-base mb-1"
                  :class="[currentSelectedOption === fileOptionId['3d_file'] ? 'text-grey-0' : 'text-grey-700']"
                ) {{ $t('DD0151') }}
                p(
                  class="text-sm border-b pb-3 mb-3"
                  :class="[currentSelectedOption === fileOptionId['3d_file'] ? 'text-grey-0' : 'text-grey-700']"
                ) {{ $t('DD0147') }}
                ul(
                  class="list-disc list-inside text-xs ml-1"
                  :class="[currentSelectedOption === fileOptionId['3d_file'] ? 'text-grey-0' : 'text-grey-700']"
                )
                  li {{ $t('RR0145') }}
                    i18n-t(keypath="DD0101" tag="span" class="font-bold")
                      template(#number) &nbsp; {{ bytesToSize(fileSizeMaxLimit) }}
            div
              f-svg-icon(
                iconName="keyboard_arrow_right"
                size="32"
                :class="[currentSelectedOption === fileOptionId['3d_file'] ? 'text-grey-0' : 'text-grey-800']"
              )
          div(
            @click="clickFileOption('Spreadsheet')"
            class="bg text-grey-0 flex flex-row justify-between gap-x-3 p-4 rounded-lg border border-grey-200"
            :class="[currentSelectedOption === fileOptionId['Spreadsheet'] ? 'text-grey-0' : 'text-grey-700', { 'bg-active': currentSelectedOption === fileOptionId['Spreadsheet'] }]"
          )
            div(class="flex flex-row")
              f-svg-icon(
                iconName="sheetFile"
                size="32"
                class="mr-5 mt-2"
                :class="[currentSelectedOption === fileOptionId['Spreadsheet'] ? 'text-grey-0' : 'text-grey-800']"
              )
              div
                p(
                  class="font-bold text-base mb-1"
                  :class="[currentSelectedOption === fileOptionId['Spreadsheet'] ? 'text-grey-0' : 'text-grey-700']"
                ) {{ $t('DD0152') }}
                p(
                  class="text-sm pb-3 mb-3"
                  :class="[currentSelectedOption === fileOptionId['Spreadsheet'] ? 'text-grey-0' : 'text-grey-500']"
                ) {{ $t('DD0148') }}
            div
              f-svg-icon(
                iconName="keyboard_arrow_right"
                size="32"
                :class="[currentSelectedOption === fileOptionId['Spreadsheet'] ? 'text-grey-0' : 'text-grey-800']"
              )
        div(class="w-1/2 xl:w-7/12 h-full") 
          upload-area(
            :currentOption="currentSelectedOption"
            v-if="showUploadArea"
          )
</template>

<script setup lang="ts">
import useNavigation from '@/composables/useNavigation'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useAssetsStore } from '@/stores/assets'
import { onMounted, nextTick } from 'vue'
import { track, bytesToSize } from '@frontier/lib'
import {
  TRACKER_ADDITIONAL_PROPERTIES,
  TRACKER_PREFIX,
  fileOptionId,
} from '@frontier/constants'
import UploadArea from '@/components/assets/UploadArea.vue'
import { hasShownWelcomeModal } from '@/utils/storage'

type option = '2d_file' | '3d_file' | 'Spreadsheet'

const TRACKER_ID = 'Advanced View Upload Assets'
const { t } = useI18n()
const assetsStore = useAssetsStore()
const store = useStore()

const { goToAssets, goToMaterialUpload } = useNavigation()
const uploadPageUseBothUi = computed(
  () => store.getters['permission/uploadPageUseBothUi']
)
if (!assetsStore.useNewAssetsView) {
  goToMaterialUpload()
}

const currentSelectedOption = ref<option>('2d_file')
const fileSizeMaxLimit = computed(
  () => store.getters['organization/materialAttachmentUploadSizeLimit']
)

const isNewOrgId = computed(
  () => store.getters['permission/uploadPageUseNewUi']
)

const openModalUploadSettings = () => {
  store.dispatch(
    'helper/openModal',
    { component: 'modal-upload-assets-settings' },
    { root: true }
  )
}

const locationList = computed(() => {
  return [
    {
      name: t('RR0008'),
      goTo: goToAssets,
    },
    {
      name: t('DD0138'),
      goTo: goToMaterialUpload,
    },
  ]
})
const showUploadArea = ref(true)
const openVideo = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-video-show',
    properties: {
      videoUrl: 'https://www.youtube.com/embed/DPCAHtG90Gk?autoplay=1',
      title: '',
    },
  })
}
const changeViewSwitch = (e: boolean) => {
  assetsStore.switchCreateAssetsView()
  if (!e) {
    goToMaterialUpload()
  }
}
const clickFileOption = async (type: option) => {
  currentSelectedOption.value = fileOptionId[type]
  const prefixTrackerId = `Advanced View`
  const trackerId: Partial<Record<option, string>> = {
    '2d_file': 'Upload 2D Material',
    '3d_file': 'Upload 3D Material',
  }

  if (trackerId[type]) {
    track({
      eventName: [TRACKER_PREFIX.CHOOSE, prefixTrackerId, trackerId[type]].join(
        ' '
      ),
      properties: {
        [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]:
          assetsStore.viewMode,
      },
    })
  }
  showUploadArea.value = false
  await nextTick()
  showUploadArea.value = true
}

const checkAndShowWelcomeModal = () => {
  if (uploadPageUseBothUi.value) {
    return
  }
  if (!hasShownWelcomeModal.value) {
    if (isNewOrgId.value) {
      openWelcomeModal(isNewOrgId.value ? 'new' : 'old')
    }
    hasShownWelcomeModal.value = true
  }
}
const openWelcomeModal = (type: 'old' | 'new') => {
  store.dispatch(
    'helper/openModalBehavior',
    {
      component: type === 'new' ? 'modal-welcome' : 'modal-welcome2',
    },
    { root: true }
  )
}
onMounted(() => {
  checkAndShowWelcomeModal()
  track({
    eventName: [TRACKER_PREFIX.START_FLOW, TRACKER_ID].join(' '),
    properties: {
      [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]:
        assetsStore.viewMode,
    },
  })
})
</script>

<style lang="scss" scoped>
.bg-active {
  background: radial-gradient(
    100% 564.06% at 0% 0%,
    #2cac8f 0%,
    #2c9f71 28.26%,
    #278d5f 48.09%,
    #1b6f52 65.08%,
    #185e4b 87%
  );
  @apply border;
  @apply border-solid;
  @apply border-primary-800;
}
</style>

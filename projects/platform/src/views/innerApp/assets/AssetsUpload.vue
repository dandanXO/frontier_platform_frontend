<template lang="pug">
f-scrollbar-container(class="w-full h-full")
  div(class="ml-7.5 mt-7.5")
    global-breadcrumb-list(
      :breadcrumbList="locationList"
      @click:item="$event.goTo()"
    )
  div(class="w-full h-full flex justify-center")
    div(class="w-240")
      div(class="ml-5 mt-15.5")
        div(class="flex justify-between")
          h3(
            class="text-h3 text-grey-900 pb-5 font-medium"
            data-cy="smart-upload-title"
          ) {{ $t('DD0001') }}
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
              @click="openModalUploadSettings"
              type="secondary"
              prependIcon="setting"
              data-cy="text-recognition-setting"
            ) {{ $t('DD0141') }}

        div(class="flex justify-between items-end")
          div(class="text-grey-900 text-body1 leading-1.6")
            p {{ $t('DD0079') }}
            p {{ $t('DD0080') }}
          f-tooltip-toggle(placement="bottom" :triggerText="$t('DD0081')")
            template(#slot:tooltip-toggle-content)
              i18n-t(
                keypath="DD0010"
                tag="div"
                class="pb-7.5 text-caption/1.3 text-grey-50"
                scope="global"
              )
                template(#DD0111)
                  span {{ $t('DD0111') }}
              img(src="@/assets/images/back_side.png")
            template(#slot:tooltip-toggle-link)
              div(
                class="flex items-end gap-x-1 text-cyan-200 cursor-pointer text-caption/1.3"
                @click="printBackSideLabel"
              ) {{ $t('DD0115') }}
                f-svg-icon(iconName="open_in_new" size="14")
            template(#slot:tooltip-toggle-button="{ collapseTooltipToggle }")
              f-button(size="sm" @click="collapseTooltipToggle") {{ $t('UU0026') }}
      div(class="mt-8")
        div(class="grid grid-cols-3 gap-7.5")
          div
            div(class="border border-grey-250 rounded-md")
              div(class="h-64 flex items-end justify-center")
                img(src="@/assets/images/upload_step1.png" class="w-60")
              div(class="flex min-h-28 bg-grey-100 rounded-b-md p-4")
                div(
                  class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
                ) 1
                div(class="text-grey-900 text-body1 font-bold leading-1.6") {{ $t('DD0082') }}
            div(class="text-grey-900 pl-5 pt-6")
              p(class="text-body2 font-bold leading-1.6 mb-1.5") {{ $t('DD0072') }}
              ul(class="text-caption leading-1.6")
                li 1. {{ $t('DD0073') }}
                li 2. {{ $t('DD0074') }}
                li 3. {{ $t('DD0075') }}
          div
            div(class="border border-grey-250 rounded-md")
              div(class="h-64 flex items-end justify-center")
                img(src="@/assets/images/upload_step2.png" class="w-60")
              div(class="flex min-h-28 bg-grey-100 rounded-b-md p-4")
                div(
                  class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
                ) 2
                div(class="text-grey-900 text-body1 font-bold leading-1.6") {{ $t('DD0083') }}
            div(class="pl-5 pt-6 font-bold leading-1.6 text-body2")
              p(class="text-grey-900 mb-1.5") {{ $t('DD0086') }}:
              p(class="text-primary-400") {{ ogUploadMaterialEmail }}
          div
            div(class="border border-grey-250 rounded-md")
              div(class="h-64 flex items-end justify-center")
                img(src="@/assets/images/upload_step3.png" class="w-60")
              div(class="flex min-h-28 bg-grey-100 rounded-b-md p-4")
                div(
                  class="mr-2 flex-shrink-0 bg-grey-0 text-grey-250 rounded-full w-6 h-6 flex items-center justify-center"
                ) 3
                div(class="text-grey-900 text-body1 font-bold leading-1.6")
                  div {{ $t('DD0084') }}
                  i18n-t(keypath="DD0085" tag="div" scope="global")
                    template(#RR0008)
                      span(
                        class="text-cyan-400 underline cursor-pointer"
                        @click="goToAssets()"
                      ) {{ $t('RR0008') }}
        div(class="pt-26 pb-18")
          div(class="text-h6 font-bold text-grey-600 pb-5") {{ $t('DD0087') }}
          div(class="grid gap-3")
            template(
              v-for="option in alternativeUploadOptions"
              :key="option.id"
            ) 
              div(
                class="flex py-6 px-7.5 cursor-pointer border border-grey-250 rounded"
                :data-cy="option.testId"
                @click="option.action"
              )
                f-svg-icon(:iconName="option.icon" size="32" class="text-primary-400")
                div(class="flex-grow flex justify-between")
                  div(class="grid gap-3 pl-7.5")
                    div(class="text-body1 font-bold text-grey-900") {{ option.title }}
                    div(class="text-caption text-grey-600") {{ option.content }}
                  div(
                    v-if="option.id === 'manual-upload'"
                    class="w-40 border-l border-grey-150 pl-5"
                  )
                    p(class="text-caption2/1.3 text-grey-400") {{ $t('DD0120') }}
                    a(
                      href="https://www.shimaseiki.com/product/design/software/"
                      target="_blank"
                      @click.stop
                    )
                      img(:src="APEXFIZ" alt="APEXFIZ" class="w-21")
</template>

<script setup lang="ts">
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useAssetsStore } from '@/stores/assets'
import useCurrentUnit from '@/composables/useCurrentUnit'
import usePrint from '@/composables/material/usePrint'
import APEXFIZ from '@/assets/images/APEXFIZ.png'
import type { Organization } from '@frontier/platform-web-sdk'
import { onMounted } from 'vue'
import { track } from '@frontier/lib'
import {
  TRACKER_ADDITIONAL_PROPERTIES,
  TRACKER_PREFIX,
} from '@frontier/constants'
import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'

const TRACKER_ID = 'Upload Assets'

const { t } = useI18n()
const store = useStore()

const {
  goToAssets,
  goToMaterialUpload,
  goToMaterialCreate,
  goToAssetsMaterialCreate,
  goToAssetMaterialSpreadSheet,
} = useNavigation()
const assetsStore = useAssetsStore()

const uploadPageUseBothUi = computed(
  () => store.getters['permission/uploadPageUseBothUi']
)
if (assetsStore.useNewAssetsView && uploadPageUseBothUi.value) {
  goToMaterialCreate()
}
const { ogUploadMaterialEmail } = useCurrentUnit()
const { printBackSideLabel } = usePrint()
const openModalSmartUpload = () => {
  track({
    eventName: `${TRACKER_PREFIX.CHOOSE} Upload an Existing Image`,
    properties: {
      [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]:
        assetsStore.viewMode,
    },
  })
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-smart-upload',
  })
}

const openModalUploadSettings = () => {
  store.dispatch(
    'helper/openModal',
    { component: 'modal-upload-assets-settings' },
    { root: true }
  )
}
const isNewOrgId = computed(
  () => store.getters['permission/uploadPageUseNewUi']
)
const org = computed<Organization>(
  () => store.getters['organization/organization']
)

const alternativeUploadOptions = [
  {
    id: 'smart-upload',
    icon: 'image_file',
    title: t('DD0088'),
    content: t('DD0089'),
    action: openModalSmartUpload,
    testId: 'smart-upload',
  },
  {
    id: 'manual-upload',
    icon: 'add_box_outline',
    title: t('DD0116'),
    content: t('DD0117'),
    action: () => {
      track({
        eventName: `${TRACKER_PREFIX.CHOOSE} Create Asset`,
        properties: {
          [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]:
            assetsStore.viewMode,
        },
      })
      goToAssetsMaterialCreate()
    },
    testId: 'manual-upload',
  },
  {
    id: 'mass-upload',
    icon: 'multiple_file',
    title: t('DD0092'),
    content: t('DD0093'),
    action: () => {
      track({
        eventName: `${TRACKER_PREFIX.CHOOSE} Mass Upload`,
        properties: {
          [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]:
            assetsStore.viewMode,
        },
      })
      goToAssetMaterialSpreadSheet()
    },
    testId: 'mass-upload',
  },
]
const changeViewSwitch = (e: boolean) => {
  assetsStore.switchCreateAssetsView()
  if (e) {
    goToMaterialCreate()
  }
}
const locationList = computed(() => {
  return [
    {
      name: t('RR0008'),
      goTo: goToAssets,
    },
    {
      name: t('DD0045'),
      goTo: goToMaterialUpload,
    },
  ]
})

onMounted(() => {
  const roleId = store.getters['organization/orgUser/orgUser'].roleID
  const permissionList = PERMISSION_MAP[roleId]
  if (!permissionList.includes(FUNC_ID.ROUTER_ASSET_CREATED)) {
    goToAssets()
  }
  track({
    eventName: [TRACKER_PREFIX.START_FLOW, TRACKER_ID].join(' '),
    properties: {
      [TRACKER_ADDITIONAL_PROPERTIES.CREATE_MATERIAL_MODE]:
        assetsStore.viewMode,
    },
  })
})
</script>

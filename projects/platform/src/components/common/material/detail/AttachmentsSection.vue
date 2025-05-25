<template lang="pug">
div(class="flex flex-col gap-5")
  f-tabs(
    v-if="isInternalUser"
    :tabList="tabList"
    keyField="id"
    :type="TAB_TYPE.LINE"
    @switch="switchTab"
    tabItemContainerStyle="flex-1 justify-center items-center"
    tabListContainerStyle=""
  )

  template(v-if="currentTabId === TAB_ID.PUBLIC")
    div(class="flex flex-col p-2" v-if="!material.multimediaList.length")
      p(class="text-sm primary-inverse text-center") {{ $t('RR0563') }}
    div(class="flex flex-wrap gap-5" v-else)
      attachment-file(
        v-for="(attachment, index) in material.multimediaList"
        :key="attachment.fileId"
        :thumbnailUrl="attachment.thumbnailUrl"
        :originalUrl="attachment.originalUrl"
        :extension="attachment.extension"
        :displayFileName="attachment.displayFileName"
        @click="openAttachmentExternalViewMode(index)"
      )
  template(v-if="currentTabId === TAB_ID.PRIVATE")
    div(class="flex flex-col p-2" v-if="!material.internalInfo?.attachmentList?.length")
      p(class="text-sm primary-inverse text-center") {{ $t('RR0563') }}
    div(class="flex flex-wrap gap-5" v-else)
      attachment-file(
        v-for="(attachment, index) in material.internalInfo?.attachmentList"
        :key="attachment.fileId"
        :thumbnailUrl="attachment.thumbnailUrl"
        :originalUrl="attachment.originalUrl"
        :extension="attachment.extension"
        :displayFileName="attachment.displayFileName"
        @click="openAttachmentViewMode(index)"
      )
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { type Material } from '@frontier/platform-web-sdk'
import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import { FUNC_ID, PERMISSION_MAP } from '@/utils/constants'
import useAttachmentUpdate from '@/composables/material/useAttachmentUpdate'
import useMultimediaUpdate from '@/composables/material/useMultimediaUpdate'
import useMaterial from '@/composables/material/useMaterial'
import AttachmentFile from './AttachmentFile.vue'

enum TAB_ID {
  PUBLIC = 0,
  PRIVATE = 1,
}
interface Tab {
  id: TAB_ID
  name: string
}

const props = defineProps<{ material: Material }>()
const store = useStore()
const { t } = useI18n()

const { attachmentViewModeList } = useMaterial(ref(props.material))
const currentTabId = ref<TAB_ID>(TAB_ID.PUBLIC)

const roleId = computed(
  () => store.getters['organization/orgUser/orgUser'].roleID
)
const permissionList = PERMISSION_MAP[roleId.value]
const isInternalUser = permissionList.includes(FUNC_ID.ASSET_VIEW_INTTERNAL)

const tabList = computed<Tab[]>(() => {
  const list = [
    {
      id: TAB_ID.PUBLIC,
      name: t('FF0030'),
    },
  ]

  if (isInternalUser) {
    list.push({
      id: TAB_ID.PRIVATE,
      name: t('FF0031'),
    })
  }
  return list
})

const switchTab = (tab: Tab) => {
  currentTabId.value = tab.id
}

const multimediaViewModeFileList = computed(() =>
  props.material.multimediaList.map((m) => ({
    id: m.fileId,
    originalUrl: m.originalUrl,
    displayUrl: m.originalUrl,
    thumbnailUrl: m.thumbnailUrl,
    displayName: m.displayFileName,
    extension: m.extension,
  }))
)

const openAttachmentViewMode = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: attachmentViewModeList,
      },
    },
  })
}

const openAttachmentExternalViewMode = (index: number) => {
  store.dispatch('helper/pushModal', {
    component: 'modal-view-mode',
    properties: {
      viewModeService: {
        startIndex: index,
        fileList: multimediaViewModeFileList,
      },
    },
  })
}
</script>

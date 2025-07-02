<template lang="pug">
div(class="flex flex-col")
  f-tabs(
    v-if="isInternalUser"
    :tabList="tabList"
    keyField="id"
    :type="TAB_TYPE.LINE"
    @switch="switchTab"
    tabItemContainerStyle="flex-1 justify-center items-center"
    tabListContainerStyle=""
    :version="VERSION.V2"
  )
  template(v-if="currentTab === TAB_ID.PUBLIC")
    div(class="flex flex-wrap gap-2" v-if="publicTags?.length")
      f-tag(
        v-for="(tag, index) in publicTags"
        :key="`tags-${index}`"
        size="md"
        :clickable="false"
      ) {{ tag }}
    div(class="flex flex-row items-center justify-center gap-2 p-2" v-else)
      p(class="text-sm primary-inverse text-center") {{ $t('RR0562') }}
      f-button(type="secondary" size="sm" :version="VERSION.V2") {{ $t('RR0602') }}
  template(v-if="currentTab === TAB_ID.PRIVATE")
    div(class="flex flex-wrap gap-2" v-if="privateTags?.length")
      f-tag(
        v-for="(tag, index) in privateTags"
        :key="`tags-${index}`"
        size="md"
        :clickable="false"
      ) {{ tag }}
    div(class="flex flex-row items-center justify-center gap-2 p-2" v-else)
      p(class="text-sm primary-inverse text-center") {{ $t('RR0562') }}
      f-button(
        type="secondary"
        size="sm"
        :version="VERSION.V2"
        @click="editMaterial.func(material)"
      ) {{ $t('RR0602') }}
</template>

<script setup lang="ts">
import { TYPE as TAB_TYPE } from '@frontier/ui-component/src/FTabs/FTabs.vue'
import useTagSection, { TAB_ID } from '@/composables/material/useTagsSection'
import { VERSION } from '@frontier/constants'
import useAssets from '@/composables/useAssets'
import type { Material } from '@frontier/platform-web-sdk'

defineProps<{
  material: Material
}>()

const {
  privateTags,
  publicTags,
  tabList,
  isInternalUser,
  currentTab,
  switchTab,
} = useTagSection()

const { editMaterial } = useAssets()
</script>

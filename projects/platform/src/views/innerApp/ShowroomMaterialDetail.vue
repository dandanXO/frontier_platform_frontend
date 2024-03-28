<template lang="pug">
material-detail-external-inner(
  :material="material"
  :nodeMeta="nodeMeta"
  :locationList="locationList"
  :publishedDate="nodeMeta.publicDate ?? undefined"
  @clone="publicLibraryClone([nodeMeta.nodeId], nodeMeta.isCanClone, $t('II0008'))"
)
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import MaterialDetailExternalInner from '@/components/common/material/detail/external/MaterialDetailExternalInner.vue'
import useNavigation from '@/composables/useNavigation'
import usePublicLibrary from '@/composables/usePublicLibrary'
import { useShowroomStore } from '@/stores/showroom'
import { useSearchStore } from '@/stores/search'

const props = defineProps<{
  showroomId: string
  nodeId: string
}>()

const { t } = useI18n()
const { getSearchLog } = useSearchStore()
const { ogBaseShowroomApi } = useShowroomStore()
const { goToPublicLibrary, goToShowroom } = useNavigation()
const { publicLibraryClone } = usePublicLibrary()

const [resShowroom, resShowroomMaterial] = await Promise.all([
  ogBaseShowroomApi('getShowroom', {
    showroomId: Number(props.showroomId),
  }),
  ogBaseShowroomApi('getShowroomMaterial', {
    nodeId: Number(props.nodeId),
    searchLog: getSearchLog(),
  }),
])
const showroom = resShowroom.data.result.showroom
const { material, nodeMeta } = toRefs(
  reactive(resShowroomMaterial.data.result.workspaceNodeMaterial)
)
const locationList = computed(() => {
  return [
    {
      name: t('RR0003'),
      goTo: () => {
        goToPublicLibrary()
      },
    },
    {
      name: showroom.subtitle,
      goTo: () => {
        goToShowroom({}, showroom.showroomId)
      },
    },
    ...nodeMeta.value.locationList.map(({ name, nodeId }, index, array) => {
      if (index !== array.length - 1) {
        return {
          name,
          goTo: () => {
            goToShowroom({}, showroom.showroomId, nodeId)
          },
        }
      } else {
        return {
          name: material.value.itemNo!,
          goTo: () => {},
        }
      }
    }),
  ]
})
</script>

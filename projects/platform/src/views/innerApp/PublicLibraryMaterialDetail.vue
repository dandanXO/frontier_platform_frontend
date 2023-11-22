<template lang="pug">
material-detail-inner-external(
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
import MaterialDetailInnerExternal from '@/components/common/material/detail/external/MaterialDetailInnerExternal.vue'
import useNavigation from '@/composables/useNavigation'
import usePublicLibrary from '@/composables/usePublicLibrary'
import { usePublicLibraryStore } from '@/stores/publicLibrary'
import { useSearchStore } from '@/stores/search'

const props = defineProps<{
  nodeId: string
}>()

const { t } = useI18n()
const { ogBasePublicLibraryApi } = usePublicLibraryStore()
const { goToPublicLibrary } = useNavigation()
const { getSearchLog } = useSearchStore()
const { publicLibraryClone } = usePublicLibrary()

const res = await ogBasePublicLibraryApi('getPublicLibraryMaterial', {
  nodeId: Number(props.nodeId),
  searchLog: getSearchLog(),
})
const { material, nodeMeta } = toRefs(
  reactive(res.data.result.workspaceNodeMaterial)
)

const locationList = computed(() => {
  return [
    {
      name: t('RR0003'),
      goTo: () => {
        goToPublicLibrary()
      },
    },
    ...nodeMeta.value.locationList.map(({ name, nodeId }, index, array) => {
      if (index !== array.length - 1) {
        return {
          name,
          goTo: () => {
            goToPublicLibrary({}, nodeId)
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

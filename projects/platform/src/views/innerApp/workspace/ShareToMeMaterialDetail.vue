<template lang="pug">
material-detail-external-inner(
  :material="material"
  :nodeMeta="nodeMeta"
  :locationList="locationList"
  :publishedDate="shareInfo.shareDate"
  @clone="shareToMeClone(Number(sharingId), [nodeMeta.nodeId], nodeMeta.isCanClone, $t('II0008'))"
)
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import MaterialDetailExternalInner from '@/components/common/material/detail/external/MaterialDetailExternalInner.vue'
import useNavigation from '@/composables/useNavigation'
import useShareToMe from '@/composables/useShareToMe'
import { useShareToMeStore } from '@/stores/shareToMe'
import { useSearchStore } from '@/stores/search'

const props = defineProps<{
  sharingId: string
  nodeId: string
}>()

const { t } = useI18n()
const { ogBaseShareToMeApi } = useShareToMeStore()
const { goToShareToMe } = useNavigation()
const { shareToMeClone } = useShareToMe()
const { getSearchLog } = useSearchStore()

const res = await ogBaseShareToMeApi('getShareToMeMaterial', {
  sharingId: Number(props.sharingId),
  nodeId: Number(props.nodeId),
  searchLog: getSearchLog(),
})
const { material, nodeMeta, shareInfo } = toRefs(
  reactive(res.data.result.shareNodeMaterial)
)

const locationList = computed(() => {
  return [
    {
      name: t('RR0010'),
      goTo: () => {
        goToShareToMe()
      },
    },
    ...nodeMeta.value.locationList.map(({ name, nodeId }, index, array) => {
      if (index !== array.length - 1) {
        return {
          name,
          goTo: () => {
            goToShareToMe({}, Number(props.sharingId), nodeId)
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

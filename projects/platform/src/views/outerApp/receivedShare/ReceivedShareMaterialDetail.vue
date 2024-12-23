<template lang="pug">
material-detail-external-outer(
  :material="material"
  :nodeMeta="nodeMeta"
  :locationList="locationList"
)
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useOuterStore } from '@/stores/outer'
import useNavigation from '@/composables/useNavigation'
import MaterialDetailExternalOuter from '@/components/common/material/detail/external/MaterialDetailExternalOuter.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { checkU3mImageExist } from '@/utils/3dViewer/checkU3mImageExist'

const router = useRouter()

const props = defineProps<{
  sharingKey: string
  nodeId: string
}>()

const { goToReceivedShare } = useNavigation()
const outerStore = useOuterStore()
const { getReceivedShareMaterial } = outerStore

await getReceivedShareMaterial(props.sharingKey, Number(props.nodeId))
const material = computed(() => outerStore.material!)
const nodeMeta = computed(() => outerStore.nodeMeta!)
const store = useStore()

onMounted(async () => {
  if (router.currentRoute.value.query.open3d === 'true') {
    const isCustomU3mExist = !(await checkU3mImageExist(
      material.value.customU3m
    ))
    store.dispatch('helper/openModalBehavior', {
      component: store.getters['permission/isShowNew3DViewer']
        ? 'modal-3d-viewer-react'
        : 'modal-3d-viewer',
      properties: {
        material: material.value,
        materialId: material.value.materialId,
        u3m: isCustomU3mExist ? material.value.customU3m : material.value.u3m,
      },
    })
  }
})

const locationList = computed(() => {
  return nodeMeta.value.locationList.map(({ name, nodeId }, index, array) => {
    if (index !== array.length - 1) {
      return {
        name,
        goTo: () => {
          goToReceivedShare(props.sharingKey, nodeId)
        },
      }
    } else {
      return {
        name: material.value.itemNo!,
        goTo: () => {},
      }
    }
  })
})
</script>

<template lang="pug">
div
  material-detail-internal(
    :material="material"
    :breadcrumbList="breadcrumbList"
    class="mx-auto w-230 pb-25"
  )
</template>

<script setup>
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import MaterialDetailInternal from '@/components/common/material/detail/internal/MaterialDetailInternal.vue'

// temp
import { useAssetsStore } from '@/stores/assets'
import { storeToRefs } from 'pinia'
const assetsStore = useAssetsStore()
const { material } = storeToRefs(assetsStore)

const props = defineProps({
  nodeKey: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { parsePath, prefixPath } = useNavigation()

// await store.dispatch('workspace/getWorkspaceMaterial', {
//   nodeKey: props.nodeKey,
//   rank: Number(route.query.rank),
// })

// const material = computed(() => store.getters['workspace/material'])
const breadcrumbList = computed(() => {
  const defaultWorkspaceNodeKey =
    store.getters['workspace/defaultWorkspaceNodeKey']
  return [
    {
      name: t('FF0001'),
      path: parsePath(
        `${prefixPath.value}/workspace/${defaultWorkspaceNodeKey}`
      ),
    },
    ...store.getters['workspace/materialBreadcrumbList'].map(
      ({ name, nodeKey }, index, array) => {
        if (index !== array.length - 1) {
          return {
            name,
            path: parsePath(`${prefixPath.value}/workspace/${nodeKey}`),
          }
        } else {
          return {
            name: material.value.itemNo,
            path: parsePath(`${prefixPath.value}/workspace/material/:nodeKey`),
          }
        }
      }
    ),
  ]
})
</script>

<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    material-detail-external-header(
      :breadcrumbList="breadcrumbList"
      :material="material"
      @clone="publicCloneByMaterial(nodeKey, publish.isCanClone)"
    )
      template(#caption)
        i18n-t(
          keypath="II0002"
          tag="p"
          class="text-caption text-grey-600"
          scope="global"
        )
          template(#displayName) {{ publish.displayName }}
    material-detail-external(
      :material="material"
      :isCanDownloadU3M="publish.isCanDownloadU3M"
    )
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'
import MaterialDetailExternalHeader from '@/components/common/material/detail/MaterialDetailExternalHeader.vue'

const props = defineProps({
  nodeKey: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { parsePath } = useNavigation()
const { publicCloneByMaterial } = usePublicLibrary()

await store.dispatch('publicLibrary/getPublicMaterial', {
  nodeKey: props.nodeKey,
  rank: Number(route.query.rank),
})

const material = computed(() => store.getters['publicLibrary/material'])
const publish = computed(() => store.getters['publicLibrary/materialPublish'])
const breadcrumbList = computed(() => {
  return [
    {
      name: t('II0001'),
      path: parsePath('/:orgNo/public-library'),
    },
    ...store.getters['publicLibrary/materialBreadcrumbList'].map(
      ({ name, nodeKey }, index, array) => {
        if (index !== array.length - 1) {
          return {
            name,
            path: parsePath(`/:orgNo/public-library/${nodeKey}`),
          }
        } else {
          return {
            name: material.value.materialNo,
            path: parsePath('/:orgNo/public-library/material/:nodeKey'),
          }
        }
      }
    ),
  ]
})
</script>

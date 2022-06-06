<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    breadcrumb(class="pt-12 pb-9" :breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{ `${material.materialNo} ${material.description}` }}
        svg-icon(iconName="clone" class="text-black-700 cursor-pointer" size="24" @click="publicCloneByMaterial(nodeKey, publish.isCanClone)")
      i18n-t(keypath="II0002" tag="p" class="text-caption text-black-700")
        template(#displayName) {{ publish.displayName }}
    material-detail-external(:material="material" :isCanDownloadU3M="publish.isCanDownloadU3M")
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import usePublicLibrary from '@/composables/usePublicLibrary'
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'

const props = defineProps({
  nodeKey: {
    type: String,
    required: true
  }
})

const { t } = useI18n()
const store = useStore()
const { parsePath } = useNavigation()
const { publicCloneByMaterial } = usePublicLibrary()

await store.dispatch('publicLibrary/getPublicMaterial', { nodeKey: props.nodeKey })

const material = computed(() => store.getters['publicLibrary/material'])
const publish = computed(() => store.getters['publicLibrary/materialPublish'])
const breadcrumbList = computed(() => {
  return [
    {
      name: t('II0001'),
      path: parsePath('/:orgNo/public-library')
    },
    ...store.getters['publicLibrary/materialBreadcrumbList'].map(({ name, nodeKey }, index, array) => {
      if (index !== array.length - 1) {
        return {
          name,
          path: parsePath(`/:orgNo/public-library/${nodeKey}`)
        }
      } else {
        return {
          name: material.value.materialNo,
          path: parsePath('/:orgNo/public-library/material/:nodeKey')
        }
      }
    })
  ]
})
</script>

<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    breadcrumb(class="pt-12 pb-9" :breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{`${material.materialNo} ${material.description}`}}
        svg-icon(iconName="clone" class="text-black-700 cursor-pointer" size="24" @click="clone")
      i18n-t(keypath="II0002" tag="p" class="text-caption text-black-700")
        template(#displayName) {{publish.displayName}}
    material-detail-external(:material="material" :publish="publish")
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import usePublicLibrary from '@/composables/usePublicLibrary'
import MaterialDetailExternal from '@/components/layout/materialDetail/MaterialDetailExternal.vue'

export default {
  name: 'PublicLibraryMaterialDetail',
  components: {
    MaterialDetailExternal
  },
  async setup () {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const { parsePath } = useNavigation()
    const { cloneNode } = usePublicLibrary()
    const [workspaceNodeLocation, workspaceNodeId] = route.params.nodeKey.split('-')

    const { publish, breadcrumbList: tempBreadCrumbList } = await store.dispatch('publicLibrary/getPublicMaterial', { workspaceNodeId, workspaceNodeLocation })

    const material = computed(() => store.getters['material/material'])
    const breadcrumbList = computed(() => {
      const list = [
        {
          name: t('II0001'),
          path: parsePath('/:orgNo/public-library')
        }
      ]
      for (let i = 0; i <= tempBreadCrumbList.length - 1; i++) {
        const { name, workspaceNodeId, workspaceNodeLocation } = tempBreadCrumbList[i]
        if (i !== tempBreadCrumbList.length - 1) {
          list.push({
            name,
            path: parsePath(`/:orgNo/public-library?workspaceNodeId=${workspaceNodeId}&workspaceNodeLocation=${workspaceNodeLocation}`)
          })
        } else {
          list.push({
            name: material.value.materialNo,
            path: parsePath('/:orgNo/public-library/:nodeKey')
          })
        }
      }
      return list
    })
    const clone = () => cloneNode.func(route.params.nodeKey)

    return {
      breadcrumbList,
      material,
      publish,
      clone
    }
  }
}

</script>

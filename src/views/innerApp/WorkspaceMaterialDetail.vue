<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    breadcrumb(:breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)" class="pt-12 pb-9")
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-primary font-bold line-clamp-1 pr-3") {{ `${material.materialNo} ${material.description}` }}
        svg-icon(iconName="create" class="text-black-700 cursor-pointer" size="24" @click="editMaterial.func(material)")
      p(class="text-caption text-black-700") {{ $t("EE0014") }} : {{ lastUpdateDate }}
    material-detail-internal(:material="material")
</template>

<script>
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useWorkspace from '@/composables/useWorkspace'
import MaterialDetailInternal from '@/components/layout/materialDetail/MaterialDetailInternal.vue'
import dayjs from 'dayjs'

export default {
  name: 'WorkspaceMaterialDetail',
  components: {
    MaterialDetailInternal
  },
  props: {
    nodeKey: {
      type: String,
      required: true
    }
  },
  async setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const { editMaterial } = useWorkspace()
    const { parsePath } = useNavigation()

    await store.dispatch('workspace/getWorkspaceMaterial', { nodeKey: props.nodeKey })

    const material = computed(() => store.getters['workspace/material'])
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const breadcrumbList = computed(() => {
      const materialBreadcrumbList = store.getters['workspace/materialBreadcrumbList']
      const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
      const list = [
        {
          name: t('FF0001'),
          path: parsePath(`${prefix}/workspace`)
        }
      ]
      for (let i = 0; i <= materialBreadcrumbList.length - 1; i++) {
        const { name, nodeKey } = materialBreadcrumbList[i]
        if (i !== materialBreadcrumbList.length - 1) {
          list.push({
            name,
            path: parsePath(`${prefix}/workspace?nodeKey=${nodeKey}`)
          })
        } else {
          list.push({
            name: material.value.materialNo,
            path: parsePath(`${prefix}/workspace/:nodeKey`)
          })
        }
      }
      return list
    })

    const lastUpdateDate = computed(() => {
      const tempUpdateDate = dayjs.unix(material.value.updateDate).format('MM/DD/YYYY hh:mm A')
      return tempUpdateDate.slice(0, 10) + ' at ' + tempUpdateDate.slice(10)
    })

    return {
      material,
      editMaterial,
      breadcrumbList,
      lastUpdateDate
    }
  }
}
</script>

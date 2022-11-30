<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    f-breadcrumb(
      :breadcrumbList="breadcrumbList"
      @click:item="$router.push($event.path)"
      class="pt-12 pb-9"
    )
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-grey-900 font-bold line-clamp-1 pr-3") {{ `${material.materialNo} ${material.description}` }}
        f-svg-icon(
          iconName="create"
          class="text-grey-600 cursor-pointer"
          size="24"
          @click="editMaterial(material.materialId, material.sourceAssetLocation)"
        )
      p(class="text-caption text-grey-600") {{ $t('EE0014') }} : {{ lastUpdateDate }}
    material-detail-internal(:material="material")
</template>

<script setup>
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import useWorkspace from '@/composables/useWorkspace'
import MaterialDetailInternal from '@/components/common/material/detail/MaterialDetailInternal.vue'
import dayjs from 'dayjs'

const props = defineProps({
  nodeKey: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { editMaterial } = useWorkspace()
const { parsePath, prefixPath } = useNavigation()

await store.dispatch('workspace/getWorkspaceMaterial', {
  nodeKey: props.nodeKey,
  rank: Number(route.query.rank),
})

const material = computed(() => store.getters['workspace/material'])
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
            name: material.value.materialNo,
            path: parsePath(`${prefixPath.value}/workspace/material/:nodeKey`),
          }
        }
      }
    ),
  ]
})

const lastUpdateDate = computed(() => {
  const tempUpdateDate = dayjs
    .unix(material.value.updateDate)
    .format('YYYY/MM/DD hh:mm A')
  return tempUpdateDate.slice(0, 10) + ' at ' + tempUpdateDate.slice(10)
})
</script>

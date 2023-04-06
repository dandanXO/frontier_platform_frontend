<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    f-breadcrumb(
      class="pt-12 pb-9"
      :breadcrumbList="breadcrumbList"
      @click:item="$router.push($event.path)"
    )
    div(class="pb-7.5")
      div(class="flex items-center pb-2")
        h5(class="text-h5 text-grey-900 font-bold line-clamp-1 pr-3") {{ `${material.materialNo} ${material.description}` }}
        f-svg-icon(
          iconName="clone"
          class="text-grey-600 cursor-pointer"
          size="24"
          @click="publicCloneByMaterial(nodeKey, publish.isCanClone)"
        )
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
import usePublicLibrary from '@/composables/usePublicLibrary'
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'

const props = defineProps({
  showroomId: {
    type: String,
  },
  nodeKey: {
    type: String,
    required: true,
  },
})

const { t } = useI18n()
const store = useStore()
const { parsePath } = useNavigation()
const { publicCloneByMaterial } = usePublicLibrary()

await Promise.all([
  store.dispatch('showroom/getShowroom', { showroomId: props.showroomId }),
  store.dispatch('showroom/getShowroomMaterial', { nodeKey: props.nodeKey }),
])

const showroom = computed(() => store.getters['showroom/showroom'])
const material = computed(() => store.getters['showroom/material'])
const publish = computed(() => store.getters['showroom/materialPublish'])
const breadcrumbList = computed(() => {
  return [
    {
      name: t('II0001'),
      path: parsePath('/:orgNo/public-library'),
    },
    {
      name: showroom.value.title,
      path: parsePath('/:orgNo/showroom/:showroomId'),
    },
    ...store.getters['showroom/materialBreadcrumbList'].map(
      ({ name, nodeKey }, index, array) => {
        if (index !== array.length - 1) {
          return {
            name,
            path: parsePath(`/:orgNo/showroom/:showroomId/${nodeKey}`),
          }
        } else {
          return {
            name: material.value.materialNo,
            path: parsePath('/:orgNo/showroom/:showroomId/material/:nodeKey'),
          }
        }
      }
    ),
  ]
})
</script>

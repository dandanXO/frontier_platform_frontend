<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    f-breadcrumb(:breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)" class="pt-12 pb-9")
    div(class="pb-7.5")
      div(class="flex items-start pb-2")
        h5(class="text-h5 text-primary font-bold leading-1.6 pr-3 break-words") {{ `${material.materialNo} ${material.description}` }}
        f-tooltip
          template(#trigger)
            f-svg-icon(iconName="create" class="text-black-700 hover:text-brand cursor-pointer" size="24" @click="goToAssetMaterialEdit(material)")
          template(#content)
            p {{ $t("RR0054") }}
      p(class="text-caption text-black-700") {{ $t("EE0014") }} : {{ lastUpdateDate }}
    material-detail-internal(:material="material")
</template>

<script>
import useNavigation from '@/composables/useNavigation'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import MaterialDetailInternal from '@/components/common/material/detail/MaterialDetailInternal.vue'
import dayjs from 'dayjs'

export default {
  name: 'AssetsMaterialDetail',
  components: {
    MaterialDetailInternal
  },
  async setup () {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const { parsePath, goToAssetMaterialEdit } = useNavigation()

    await store.dispatch('assets/getMaterial', { materialId: route.params.materialId })

    const material = computed(() => store.getters['assets/material'])
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const breadcrumbList = computed(() => {
      const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
      return [
        {
          name: t('DD0044'),
          path: parsePath(`${prefix}/assets`)
        },
        {
          name: material.value.materialNo,
          path: parsePath(`${prefix}/assets/:materialId`)
        }
      ]
    })
    const lastUpdateDate = computed(() => {
      const tempUpdateDate = dayjs.unix(material.value.updateDate).format('YYYY/MM/DD hh:mm A')
      return tempUpdateDate.slice(0, 10) + ' at ' + tempUpdateDate.slice(10)
    })

    return {
      material,
      breadcrumbList,
      goToAssetMaterialEdit,
      lastUpdateDate
    }
  }
}
</script>

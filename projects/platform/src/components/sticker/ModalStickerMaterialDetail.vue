<template lang="pug">
modal-behavior(
  :header="$t('QQ0085', { materialNo: material.materialNo })"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  div(class="box-content w-203 px-21")
    div(class="pb-4")
      p(class="text-h5 text-grey-900 font-bold line-clamp-1 !break-all pb-2.5") {{ `${material.materialNo} ${material.description}` }}
      div(class="flex items-center gap-x-1")
        f-avatar(type="org" :imageUrl="material.unitLogo" size="md")
        i18n-t(
          keypath="II0002"
          tag="p"
          class="text-caption text-grey-600"
          scope="global"
        )
          template(#displayName) {{ material.unitName }}
    material-detail-external(:material="material" :isCanDownloadU3M="false")
</template>

<script setup>
import MaterialDetailExternal from '@/components/common/material/detail/MaterialDetailExternal.vue'

defineProps({
  material: {
    type: Object,
    required: true,
  },
})
</script>

<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      breadcrumb(:breadcrumbList="breadcrumbList" @click:item="$router.push($event.path)")
    div
      block-material-image
      block-material-information(:validations="validations")
      block-material-inventory(:validations="validations")
      block-material-pricing(:validations="validations")
      block-material-attachment
      div(class="flex justify-center items-center pt-17.5")
        div(class="grid grid-cols-2 gap-x-2")
          btn(size="md" type="secondary" class="h-10" @click="cancel") {{ $t("UU0002") }}
          btn(size="md" class="h-10" @click="updateMaterial") {{ $t("UU0018") }}
</template>

<script setup>
import BlockMaterialImage from '@/components/assets/material/edit/BlockMaterialImage.vue'
import BlockMaterialInformation from '@/components/assets/material/edit/BlockMaterialInformation.vue'
import BlockMaterialInventory from '@/components/assets/material/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/material/edit/BlockMaterialPricing.vue'
import BlockMaterialAttachment from '@/components/assets/material/edit/BlockMaterialAttachment.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import useMaterialValidation from '@/composables/useMaterialValidation'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const { parsePath, goToAssets } = useNavigation()
const { validations, validate } = useMaterialValidation()

const isConfirmedToLeave = ref(false)

const routeLocation = computed(() => store.getters['helper/routeLocation'])
const breadcrumbList = computed(() => {
  const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
  return [
    {
      name: t('DD0044'),
      path: parsePath(`${prefix}/assets`)
    },
    {
      name: t('EE0037'),
      path: parsePath(`${prefix}/assets/:materialId/edit`)
    }
  ]
})

const updateMaterial = async () => {
  if (validate()) {
    return
  }
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/updateMaterial')
  store.dispatch('helper/closeModalLoading')
  isConfirmedToLeave.value = true
  goToAssets()
}

const cancel = async () => {
  store.dispatch('helper/pushModalConfirm', {
    type: 1,
    header: t('EE0045'),
    content: t('EE0046'),
    primaryBtnText: t('UU0001'),
    primaryBtnHandler: () => {
      isConfirmedToLeave.value = true
      goToAssets()
    },
    secondaryBtnText: t('UU0002')
  })
}

onBeforeRouteLeave(async () => {
  if (isConfirmedToLeave.value) {
    return true
  }

  const result = await new Promise((resolve) => {
    store.dispatch('helper/openModalConfirm', {
      type: 1,
      header: t('EE0045'),
      content: t('EE0046'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: resolve.bind(undefined, 'confirm'),
      secondaryBtnText: t('UU0002'),
      secondaryBtnHandler: resolve.bind(undefined, 'cancel')
    })
  })

  return result === 'confirm'
})

await store.dispatch('assets/getMaterialOptions')
await store.dispatch('assets/getMaterial', { materialId: route.params.materialId })
</script>

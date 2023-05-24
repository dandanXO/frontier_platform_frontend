<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-260 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      global-breadcrumb-list(
        :breadcrumbList="breadcrumbList"
        @click:item="$router.push($event.path)"
      )
    div
      block-material-image
      block-material-information(:invalidation="invalidation")
      block-material-inventory(:invalidation="invalidation")
      block-material-pricing(:invalidation="invalidation")
      block-material-additional-info
      div(class="flex justify-center items-center pt-17.5")
        div(class="grid grid-cols-2 gap-x-2")
          f-button(size="md" type="secondary" class="h-10" @click="cancel") {{ $t('UU0002') }}
          f-button(
            size="md"
            class="h-10"
            :disabled="isInvalid"
            @click="updateMaterial"
          ) {{ $t('UU0018') }}
</template>

<script setup>
import BlockMaterialImage from '@/components/assets/edit/BlockMaterialImage.vue'
import BlockMaterialInformation from '@/components/assets/edit/BlockMaterialInformation.vue'
import BlockMaterialInventory from '@/components/assets/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/edit/BlockMaterialPricing.vue'
import BlockMaterialAdditionalInfo from '@/components/assets/edit/BlockMaterialAdditionalInfo.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import useMaterialValidation from '@/composables/useMaterialValidation'
import { computed, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import scrollTo from '@/utils/scrollTo'
import { NOTIFY_TYPE } from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const route = useRoute()
const { parsePath, goToAssetMaterialDetail } = useNavigation()
const material = computed(() => store.getters['assets/material'])
const { invalidation, validate, isInvalid } = useMaterialValidation(material)

const isConfirmedToLeave = ref(false)

const routeLocation = computed(() => store.getters['helper/routeLocation'])
const breadcrumbList = computed(() => {
  const prefix = routeLocation.value === 'org' ? '/:orgNo' : '/:orgNo/:groupId'
  return [
    {
      name: t('DD0044'),
      path: parsePath(`${prefix}/assets`),
    },
    {
      name: material.value.materialNo,
      path: parsePath(`${prefix}/assets/:materialId`),
    },
    {
      name: t('EE0037'),
      path: parsePath(`${prefix}/assets/:materialId/edit`),
    },
  ]
})

const updateMaterial = async () => {
  if (!validate()) {
    scrollTo('block-material-information')
    return
  }
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/updateMaterial')
  store.dispatch('helper/closeModalLoading')
  isConfirmedToLeave.value = true
  goToAssetMaterialDetail(material.value)
  notify.showNotifySnackbar({ messageText: t('EE0164') })
}

const cancel = async () => {
  store.dispatch('helper/pushModalConfirm', {
    type: NOTIFY_TYPE.WARNING,
    header: t('EE0045'),
    contentText: t('EE0046'),
    primaryBtnText: t('UU0001'),
    primaryBtnHandler: () => {
      isConfirmedToLeave.value = true
      goToAssetMaterialDetail(material.value)
    },
    secondaryBtnText: t('UU0002'),
  })
}

onBeforeRouteLeave(async () => {
  if (isConfirmedToLeave.value) {
    return true
  }

  const result = await new Promise((resolve) => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('EE0045'),
      contentText: t('EE0046'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: resolve.bind(undefined, 'confirm'),
      secondaryBtnText: t('UU0002'),
      secondaryBtnHandler: resolve.bind(undefined, 'cancel'),
    })
  })

  return result === 'confirm'
})

await store.dispatch('assets/getMaterialOptions')
await store.dispatch('assets/getMaterial', {
  materialId: route.params.materialId,
})
</script>

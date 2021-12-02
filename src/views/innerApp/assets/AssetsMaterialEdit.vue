<template lang="pug">
div(class="w-full h-full flex justify-center")
  div(class="w-230 h-fit pb-25")
    div(class="pt-12 pb-9 flex justify-between")
      breadcrumbs(:breadcrumbsList="breadcrumbsList" @click:item="$router.push($event.path)")
    div
      block-material-image
      block-material-information(:validations="validations")
      block-material-inventory(:validations="validations")
      block-material-pricing(:validations="validations")
      block-material-attachment
      div(class="flex justify-center items-center pt-17.5")
        div(class="grid grid-cols-2 gap-x-2")
          btn(size="md" type="secondary" class="h-10" @click="cancel") {{$t('UU0002')}}
          btn(size="md" class="h-10" @click="updateMaterial") {{$t('UU0018')}}
</template>

<script>
import BlockMaterialImage from '@/components/assets/material/edit/BlockMaterialImage.vue'
import BlockMaterialInformation from '@/components/assets/material/edit/BlockMaterialInformation.vue'
import BlockMaterialInventory from '@/components/assets/material/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/material/edit/BlockMaterialPricing.vue'
import BlockMaterialAttachment from '@/components/assets/material/edit/BlockMaterialAttachment'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import useMaterialValidation from '@/composables/useMaterialValidation'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'AssetsMaterialEdit',
  components: {
    BlockMaterialImage,
    BlockMaterialInformation,
    BlockMaterialInventory,
    BlockMaterialPricing,
    BlockMaterialAttachment
  },
  async setup () {
    const { t } = useI18n()
    const store = useStore()
    const route = useRoute()
    const { parsePath, goToAssets } = useNavigation()
    const { validations, validate } = useMaterialValidation()

    await store.dispatch('material/getMaterialOptions')
    await store.dispatch('material/getMaterial', { materialId: route.params.materialId })

    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const breadcrumbsList = computed(() => {
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
      await store.dispatch('material/updateMaterial')
      store.dispatch('helper/closeModalLoading')
      goToAssets()
    }

    const cancel = async () => {
      store.dispatch('helper/pushModalConfirm', {
        title: t('EE0045'),
        content: t('EE0046'),
        secondaryText: t('UU0001'),
        secondaryHandler: goToAssets,
        primaryText: t('UU0002')
      })
    }

    return {
      validations,
      updateMaterial,
      cancel,
      breadcrumbsList
    }
  }
}
</script>

<template lang="pug">
div(class="flex justify-center pt-31")
  fullscreen-header(
    :title="$t('EE0037')"
    :primaryText="$t('reuse.save')"
    :primaryHandler="primaryHandler"
    :secondaryHandler="secondaryHandler"
    :primaryCloseAfterHandle="false"
    :secondaryCloseAfterHandle="false"
  )
  div(class="w-230 h-fit pb-25")
    block-material-image
    block-material-information(:validations="validations")
    block-material-inventory(:validations="validations")
    block-material-pricing(:validations="validations")
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import BlockMaterialImage from '@/components/assets/material/edit/BlockMaterialImage.vue'
import BlockMaterialInformation from '@/components/assets/material/edit/BlockMaterialInformation.vue'
import BlockMaterialInventory from '@/components/assets/material/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/material/edit/BlockMaterialPricing.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import useMaterialValidation from '@/composables/useMaterialValidation'

export default {
  name: 'MaterialEdit',
  components: {
    FullscreenHeader,
    BlockMaterialImage,
    BlockMaterialInformation,
    BlockMaterialInventory,
    BlockMaterialPricing
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const { location, goToAssets } = useNavigation()
    const { validations, validate } = useMaterialValidation()

    store.dispatch('material/getMaterialOptions', { location: location.value })

    const updateMaterial = async () => {
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('material/updateMaterial', { location: location.value })
      store.dispatch('helper/closeModalLoading')
      store.dispatch('helper/clearModalPipeline')
      goToAssets()
    }

    const primaryHandler = async () => {
      if (validate()) {
        return
      }
      await updateMaterial()
    }

    const secondaryHandler = async () => {
      store.dispatch('helper/pushModalConfirm', {
        title: t('EE0045'),
        content: t('EE0046'),
        secondaryText: t('reuse.confirm'),
        secondaryHandler: () => {
          store.dispatch('helper/closeFullscreen')
        },
        primaryText: t('reuse.cancel')
      })
    }

    return {
      validations,
      primaryHandler,
      secondaryHandler
    }
  }
}
</script>

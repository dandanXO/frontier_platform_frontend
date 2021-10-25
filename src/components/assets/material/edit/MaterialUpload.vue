<template lang="pug">
div(class="flex justify-center pt-31")
  fullscreen-header(
    :title="$t('DD0012')"
    :primaryText="$t('reuse.create')"
    :primaryHandler="primaryHandler"
    :secondaryHandler="secondaryHandler"
    :primaryCloseAfterHandle="false"
    :secondaryCloseAfterHandle="false"
  )
    template(#left)
      btn(size="sm" type="secondary" class="ml-5") {{$t('reuse.massUpdate')}}
  div(class="w-230 h-fit pb-25")
    block-material-information(:validations="validations")
    block-material-inventory(:validations="validations")
    block-material-pricing(:validations="validations")
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import BlockMaterialInformation from '@/components/assets/material/edit/BlockMaterialInformation.vue'
import BlockMaterialInventory from '@/components/assets/material/edit/BlockMaterialInventory.vue'
import BlockMaterialPricing from '@/components/assets/material/edit/BlockMaterialPricing.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'
import useMaterial from '@/composables/useMaterial'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'MaterialUpload',
  components: {
    FullscreenHeader,
    BlockMaterialInformation,
    BlockMaterialInventory,
    BlockMaterialPricing
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const { location } = useNavigation()
    const { validations, validate } = useMaterial()
    const tempMaterialId = uuidv4()

    store.dispatch('material/resetMaterial')
    store.dispatch('material/getMaterialOptions', { location: location.value })

    const createMaterial = async () => {
      await store.dispatch('material/createMaterial', { location: location.value, tempMaterialId })
      store.dispatch('helper/replaceFullScreen', {
        component: 'material-upload-success'
      })
    }

    const primaryHandler = async () => {
      if (validate()) {
        return
      }
      await createMaterial()
    }

    const secondaryHandler = async () => {
      store.dispatch('helper/pushModalConfirm', {
        title: t('DD0033'),
        content: t('DD0034'),
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

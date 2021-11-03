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
    div(class="pb-15 mb-5 border-b border-black-400")
      div(class="h-16 flex items-center")
        h5(class="text-h5 text-primary font-bold pr-1.5") {{$t('DD0063')}}
      div(class="pl-15")
        input-container(:label="$t('DD0062')" class="relative z-12")
          div(class="flex items-center gap-x-3")
            input-select(
              v-model:selectValue="material.isDoubleSideMaterial"
              :options="optionSingleOrDouble"
              keyOptionDisplay="name"
              keyOptionValue="value"
              class="w-50"
            )
            input-select(
              v-if="!material.isDoubleSideMaterial"
              v-model:selectValue="material.sideType"
              :options="optionSideType"
              keyOptionDisplay="name"
              keyOptionValue="value"
              class="w-25"
            )
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
import useMaterialValidation from '@/composables/useMaterialValidation'
import { v4 as uuidv4 } from 'uuid'
import { SIDE_TYPE } from '@/utils/constants'
import { computed } from 'vue'

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
    const { validations, validate } = useMaterialValidation()
    const tempMaterialId = uuidv4()
    const material = computed(() => store.getters['material/material'])

    const optionSideType = [
      {
        name: t('DD0048'),
        value: SIDE_TYPE.FACE
      },
      {
        name: t('DD0049'),
        value: SIDE_TYPE.BACK
      }
    ]

    const optionSingleOrDouble = [
      {
        name: t('DD0014'),
        value: true
      },
      {
        name: t('DD0061'),
        value: false
      }
    ]

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

    store.dispatch('material/resetMaterial')
    store.dispatch('material/getMaterialOptions', { location: location.value })

    return {
      validations,
      primaryHandler,
      secondaryHandler,
      optionSideType,
      optionSingleOrDouble,
      material
    }
  }
}
</script>

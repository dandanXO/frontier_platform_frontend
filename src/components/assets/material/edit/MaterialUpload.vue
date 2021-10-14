<template lang="pug">
div(class="flex justify-center pt-31")
  fullscreen-header(
    :title="$t('DD0012')"
    :primaryText="$t('reuse.create')"
    :primaryHandler="primaryHandler"
    :secondaryHandler="secondaryHandler"
  )
    template(#left)
      btn(size="sm" type="secondary" class="ml-5") {{$t('reuse.massUpdate')}}
  div(class="w-230 h-fit pb-25")
    block-material-information
</template>

<script>
import FullscreenHeader from '@/components/layout/FullScreenHeader.vue'
import BlockMaterialInformation from '@/components/assets/material/edit/BlockMaterialInformation.vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'MaterialUpload',
  components: {
    FullscreenHeader,
    BlockMaterialInformation
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()

    const primaryHandler = () => {
      console.log('primary')
    }

    const secondaryHandler = async () => {
      return new Promise((resolve, reject) => {
        store.dispatch('helper/pushModalConfirm', {
          title: t('DD0033'),
          content: t('DD0034'),
          secondaryText: t('UU0024'),
          secondaryHandler: reject,
          primaryText: t('reuse.save'),
          primaryHandler: () => {
            resolve()
          }
        })
      })
    }

    return {
      primaryHandler,
      secondaryHandler
    }
  }
}
</script>

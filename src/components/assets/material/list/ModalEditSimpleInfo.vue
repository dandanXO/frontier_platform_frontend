<template lang="pug">
div(class="w-227")
  overlay-scrollbar-container(class="max-h-142 border-t border-b border-black-400 px-8 py-7.5")
    component(:is="blockId" :validations='validations')
  div(class="h-25 flex justify-center items-center")
    div(class="grid grid-cols-2 gap-x-3")
      btn(size="md" type="secondary" @click="closeModal") {{$t('UU0002') }}
      btn(size="md" @click="updateMaterial") {{$t('UU0018')}}
</template>

<script>
import { useStore } from 'vuex'
import useMaterialValidation from '@/composables/useMaterialValidation'
import SimpleInventory from '@/components/assets/material/list/SimpleInventory'
import SimplePrice from '@/components/assets/material/list/SimplePrice'
import SimpleSpec from '@/components/assets/material/list/SimpleSpec'
import SimpleTag from '@/components/assets/material/list/SimpleTag'

export default {
  name: 'ModalEditInventory',
  components: {
    SimpleInventory,
    SimplePrice,
    SimpleSpec,
    SimpleTag
  },
  props: {
    blockId: {
      type: String
    }
  },
  async setup () {
    const store = useStore()
    const { validations, validate } = useMaterialValidation()

    const closeModal = () => { store.dispatch('helper/closeModal') }

    const updateMaterial = async () => {
      if (validate()) {
        return
      }
      store.dispatch('helper/pushModalLoading')
      await store.dispatch('material/updateMaterial')
      store.dispatch('helper/clearModalPipeline')
    }

    await store.dispatch('material/getMaterialOptions')
    await store.dispatch('code/getCountryList')

    return {
      validations,
      updateMaterial,
      closeModal
    }
  }
}
</script>

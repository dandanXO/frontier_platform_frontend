<template lang="pug">
modal-behavior(
  :header="$t('DD0042')"
  :primaryBtnText="$t('UU0082')"
  :secondaryBtnText="$t('UU0026')"
  @click:primary="openModalMassUpload"
  @click:secondary="closeModalBehavior"
)
  div(class="w-94")
    f-scrollbar-container(class="max-h-89.5")
      div(
        v-for="(error, index) in errorList"
        class="flex gap-3 border-grey-200 py-2.5 text-body2 text-grey-900 leading-1.6"
        :class="{ 'border-b': index !== errorList.length - 1 }"
      )
        div(class="w-27 font-bold flex-shrink-0 break-all") {{ error.key }}
        div {{ error.value }}
</template>

<script setup>
import { useStore } from 'vuex'

defineProps({
  errorList: {
    type: Array,
    required: true,
  },
})

const store = useStore()

const openModalMassUpload = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-mass-upload',
  })
}
const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')
</script>

<template lang="pug">
div(v-if="isModalConfirmOpen" class="fixed inset-0  z-index:modal-confirm  w-screen h-screen bg-black-900 bg-opacity-70 flex justify-center items-center")
  div(class="w-100 bg-black-0 rounded")
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center" :class="[{'border-b border-black-400': header !== ''}]")
      p(v-if="header !== ''" class="text-body1 text-primary") {{header}}
      svg-icon(iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="closeModalConfirm")
    div(class="px-8 flex flex-col items-center")
      h6(class="text-h6 text-primary font-bold pb-4") {{title}}
      p(class="text-body2 text-primary text-center line-height-1.6") {{content}}
    div(class="h-25 flex justify-center items-center")
      div(v-if="hasDefineSecondaryHandler" class="grid grid-cols-2 gap-x-3")
        btn(size="md" type="secondary" class="h-10" @click="secondaryHandler") {{secondaryText}}
        btn(size="md" class="h-10" @click="primaryHandler") {{hasDefinePrimaryHandler ? primaryText : $t('b.cancel')}}
      btn(v-else size="md" class="h-10" @click="primaryHandler") {{primaryText}}
</template>

<script>
import { toRefs } from 'vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
export default {
  name: 'ModalConfirm',
  setup () {
    const store = useStore()
    const isModalConfirmOpen = computed(() => store.getters['helper/isModalConfirmOpen'])
    const modalConfirmComponent = computed(() => store.getters['helper/modalConfirmComponent'])
    const { header, title, content, primaryText, secondaryText } = toRefs(modalConfirmComponent.value)
    const hasDefinePrimaryHandler = computed(() => typeof modalConfirmComponent.value.primaryHandler === 'function')
    const hasDefineSecondaryHandler = computed(() => typeof modalConfirmComponent.value.secondaryHandler === 'function')
    const closeModalConfirm = () => store.dispatch('helper/closeModalConfirm')

    const primaryHandler = async () => {
      if (hasDefinePrimaryHandler.value) {
        await modalConfirmComponent.value.primaryHandler()
      }
      closeModalConfirm()
    }

    const secondaryHandler = async () => {
      if (hasDefineSecondaryHandler.value) {
        await modalConfirmComponent.value.secondaryHandler()
      }
      closeModalConfirm()
    }

    return {
      isModalConfirmOpen,
      header,
      title,
      content,
      primaryText,
      secondaryText,
      closeModalConfirm,
      primaryHandler,
      secondaryHandler,
      hasDefineSecondaryHandler,
      hasDefinePrimaryHandler
    }
  }
}
</script>

<template lang="pug">
div(class="fixed inset-0  z-index:modal-confirm  w-screen h-screen bg-black-900 bg-opacity-70 flex justify-center items-center")
  div(class="w-100 bg-black-0 rounded")
    div(class="h-12 pl-8 pr-3 grid grid-flow-col items-center" :class="[{'border-b border-black-400': header !== ''}]")
      p(v-if="header !== ''" class="text-body1 text-primary") {{header}}
      svg-icon(iconName="close" size="24" class="justify-self-end cursor-pointer text-black-700" @click="closeModalConfirm")
    div(class="px-8 flex flex-col items-center")
      h6(class="text-h6 text-primary font-bold pb-4") {{title}}
      p(class="text-body2 text-primary text-center line-height-1.6") {{content}}
    div(class="h-25 flex justify-center items-center")
      div(v-if="hasDefineSecondaryHandler" class="grid grid-cols-2 gap-x-3")
        btn(size="md" type="secondary" class="h-10" @click="innerSecondaryHandler") {{secondaryText}}
        btn(size="md" class="h-10" @click="innerPrimaryHandler") {{hasDefinePrimaryHandler ? primaryText : $t('b.cancel')}}
      btn(v-else size="md" class="h-10" @click="innerPrimaryHandler") {{primaryText}}
</template>

<script>
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'
export default {
  name: 'ModalConfirm',
  props: {
    header: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    primaryText: {
      type: String,
      default: ''
    },
    primaryHandler: {
      type: Function
    },
    secondaryText: {
      type: String,
      default: ''
    },
    secondaryHandler: {
      type: Function
    }
  },
  setup (props) {
    const store = useStore()
    const hasDefinePrimaryHandler = computed(() => typeof props.primaryHandler === 'function')
    const hasDefineSecondaryHandler = computed(() => typeof props.secondaryHandler === 'function')

    const closeModalConfirm = () => store.dispatch('helper/closeModalConfirm')

    const innerPrimaryHandler = async () => {
      if (hasDefinePrimaryHandler.value) {
        await props.primaryHandler()
      }
      closeModalConfirm()
    }

    const innerSecondaryHandler = async () => {
      if (hasDefineSecondaryHandler.value) {
        await props.secondaryHandler()
      }
      closeModalConfirm()
    }

    return {
      closeModalConfirm,
      innerPrimaryHandler,
      innerSecondaryHandler,
      hasDefineSecondaryHandler,
      hasDefinePrimaryHandler
    }
  }
}
</script>

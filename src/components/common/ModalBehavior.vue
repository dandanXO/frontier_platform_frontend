<template lang="pug">
div(class="fixed inset-0 z-modal w-screen h-screen bg-black-900/30 flex justify-center items-center")
  div(class="w-screen h-screen" @click="closable && closeModalBehavior()")
  div(class="absolute w-fit bg-black-0 rounded card-show py-5")
    div(class="px-5 pb-5 flex justify-between border-b border-black-200")
      p(class="text-body2 font-bold text-primary") {{ header }}
      svg-icon(v-if="closable" iconName="close" size="20" class="cursor-pointer text-black-700" @click="closeModalBehavior")
    div(class="px-5 pt-5 pb-10")
      slot(name="default")
    div(class="px-5 h-13.5 border-t border-black-200 flex items-end")
      div(class="w-full flex justify-between")
        div(class="flex items-center text-caption leading-1.6")
          slot(name="note") 
        div(class="grid grid-flow-col gap-x-2.5")
          btn(v-if="textBtnText !== ''" :size="btnSize" type="text" :disabled="textBtnDisabled" @click="$emit('click:text')") {{ textBtnText }}
          btn(v-if="secondaryBtnText !== ''" :size="btnSize" type="secondary" :disabled="secondaryBtnDisabled" @click="$emit('click:secondary')") {{ secondaryBtnText }}
          btn(v-if="primaryBtnText !== ''" :size="btnSize" type="primary" :disabled="primaryBtnDisabled" @click="$emit('click:primary')") {{ primaryBtnText }}
</template>

<script>
export default {
  name: 'ModalBehavior'
}
</script>

<script setup>
import { useStore } from 'vuex'

defineEmits(['click:primary', 'click:secondary', 'click:text'])
defineProps({
  header: {
    type: String,
    required: true
  },
  closable: {
    type: Boolean,
    default: true
  },
  btnSize: {
    type: String,
    default: 'sm',
    validator: (v) => ['sm', 'md'].includes(v)
  },
  primaryBtnText: {
    type: String,
    default: ''
  },
  primaryBtnDisabled: {
    type: Boolean,
    default: false
  },
  secondaryBtnText: {
    type: String,
    default: ''
  },
  secondaryBtnDisabled: {
    type: Boolean,
    default: false
  },
  textBtnText: {
    type: String,
    default: ''
  },
  textBtnDisabled: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')

</script>

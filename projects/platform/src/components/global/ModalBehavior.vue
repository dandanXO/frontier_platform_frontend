<template lang="pug">
div(
  class="fixed inset-0 z-modal w-screen h-screen bg-grey-900/40 flex justify-center items-center"
)
  div(class="w-screen h-screen" @click="closable && closeModalBehavior()")
  div(class="absolute w-min bg-grey-0 rounded card-show py-5")
    div(class="h-8.5 px-5 pb-5 flex justify-between items-start border-b border-grey-100")
      p(class="text-body2 font-bold text-grey-900") {{ header }}
      f-svg-icon(
        v-if="closable"
        iconName="clear"
        size="20"
        class="cursor-pointer text-grey-600"
        @click="closeModalBehavior"
      )
    f-scrollbar-container(class="px-5 pt-5 pb-10 w-fit max-h-103 box-content relative")
      slot(name="default")
    div(class="px-5 h-13.5 border-t border-grey-100 flex items-end")
      div(class="w-full flex justify-between")
        div(class="flex items-center text-caption leading-1.6")
          slot(name="note")
        div(class="flex items-center gap-x-2.5")
          f-button(
            v-if="textBtnText !== ''"
            :size="btnSize"
            type="text"
            :prependIcon="textBtnIcon"
            :disabled="textBtnDisabled"
            data-cy="modal-behavior_text"
            @click="$emit('click:text')"
          ) {{ textBtnText }}
          f-button(
            v-if="secondaryBtnText !== ''"
            :size="btnSize"
            type="secondary"
            :prependIcon="secondaryBtnIcon"
            :disabled="secondaryBtnDisabled"
            data-cy="modal-behavior_secondary"
            @click="$emit('click:secondary')"
          ) {{ secondaryBtnText }}
          f-button(
            v-if="primaryBtnText !== ''"
            :size="btnSize"
            type="primary"
            :prependIcon="primaryBtnIcon"
            :disabled="primaryBtnDisabled"
            data-cy="modal-behavior_primary"
            @click="$emit('click:primary')"
          ) {{ primaryBtnText }}
</template>

<script>
export default {
  name: 'ModalBehavior',
}
</script>

<script setup>
import { useStore } from 'vuex'

defineEmits(['click:primary', 'click:secondary', 'click:text'])
defineProps({
  header: {
    type: String,
    required: true,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  btnSize: {
    type: String,
    default: 'sm',
    validator: (v) => ['sm', 'md'].includes(v),
  },
  primaryBtnText: {
    type: String,
    default: '',
  },
  primaryBtnIcon: {
    type: String,
    default: '',
  },
  primaryBtnDisabled: {
    type: Boolean,
    default: false,
  },
  secondaryBtnText: {
    type: String,
    default: '',
  },
  secondaryBtnIcon: {
    type: String,
    default: '',
  },
  secondaryBtnDisabled: {
    type: Boolean,
    default: false,
  },
  textBtnText: {
    type: String,
    default: '',
  },
  textBtnIcon: {
    type: String,
    default: '',
  },
  textBtnDisabled: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()
const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')
</script>

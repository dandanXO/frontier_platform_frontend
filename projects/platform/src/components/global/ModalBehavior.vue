<template lang="pug">
div(
  class="fixed inset-0 z-modal w-screen h-screen bg-grey-900/40 flex justify-center items-center"
)
  div(class="w-screen h-screen" @click="closable && closeModalBehavior()")
  div(
    class="absolute w-min rounded card-show shadow-32"
    :data-cy="testId"
    :class="[theme === THEME.DARK ? 'bg-grey-800' : 'bg-grey-0', needFullScreen ? 'w-screen h-screen' : '', displayHeader ? 'pt-5' : '', animation ? 'modal-animation' : '']"
  )
    div(
      v-if="displayHeader"
      class="h-8.5 px-5 pb-5 flex justify-between items-start border-b"
      :class="[theme === THEME.DARK ? 'border-grey-700' : 'border-grey-100']"
      data-cy="modal-how-to-scan-header"
    )
      p(
        class="text-body2 font-bold"
        :class="[theme === THEME.DARK ? 'text-grey-100' : 'text-grey-900']"
      ) {{ header }}
      f-svg-icon(
        v-if="closable"
        iconName="clear"
        size="20"
        class="cursor-pointer text-grey-600"
        @click="closeModalBehavior"
      )
    f-scrollbar-container(class="px-5 pt-5 pb-10 w-fit max-h-115 box-content relative")
      slot(name="default")
    div(
      v-if="footer && !usingCustomFooter"
      class="p-5 h-18.5 border-content border-t flex items-center"
      :class="[theme === THEME.DARK ? 'border-grey-700' : 'border-grey-100']"
    )
      div(class="w-full flex justify-between")
        div(class="flex items-center text-caption leading-1.6")
          slot(name="note")
        div(class="flex items-center gap-x-2.5")
          f-button(
            v-if="textBtnText !== ''"
            :theme="theme"
            :size="btnSize"
            type="text"
            :prependIcon="textBtnIcon"
            :disabled="textBtnDisabled"
            data-cy="modal-behavior_text"
            @click="$emit('click:text')"
          ) {{ textBtnText }}
          f-button(
            v-if="secondaryBtnText !== ''"
            :theme="theme"
            :size="btnSize"
            type="secondary"
            :prependIcon="secondaryBtnIcon"
            :disabled="secondaryBtnDisabled"
            data-cy="modal-behavior_secondary"
            @click="$emit('click:secondary')"
          ) {{ secondaryBtnText }}
          f-button(
            v-if="primaryBtnText !== ''"
            :theme="theme"
            :size="btnSize"
            type="primary"
            :prependIcon="primaryBtnIcon"
            :disabled="primaryBtnDisabled"
            data-cy="modal-behavior_primary"
            @click="$emit('click:primary')"
          ) {{ primaryBtnText }}
    slot(v-if="usingCustomFooter" name="custom-footer")
</template>

<script>
export default {
  name: 'ModalBehavior',
}
</script>

<script setup>
import { useStore } from 'vuex'
import { THEME } from '@/utils/constants'
import { string } from 'zod'

defineEmits(['click:primary', 'click:secondary', 'click:text'])
defineProps({
  theme: {
    type: String,
    default: THEME.LIGHT,
  },
  header: {
    type: String,
    required: true,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  displayHeader: {
    type: Boolean,
    default: true,
  },
  btnSize: {
    type: String,
    default: 'sm',
    validator: (v) => ['sm', 'md'].includes(v),
  },
  needFullScreen: {
    type: Boolean,
    default: false,
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
  animation: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: Boolean,
    default: true,
  },
  testId: {
    type: String,
    default: 'modal-behavior-content',
  },
  usingCustomFooter: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()
const closeModalBehavior = () => store.dispatch('helper/closeModalBehavior')
</script>

<style scoped>
.modal-animation {
  animation: modal-in 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation-delay: 300ms;
  animation-fill-mode: both;
}

@keyframes modal-in {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

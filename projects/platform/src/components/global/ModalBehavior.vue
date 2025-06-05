<template lang="pug">
div(
  v-if="version === 'v2'"
  class="fixed inset-0 flex items-center justify-center w-screen h-screen z-modal bg-grey-900/70"
)
  div(class="w-screen h-screen" @click="closable && closeModalBehavior()")
  div(
    class="absolute flex flex-col items-center gap-6 p-6 rounded-xl bg-grey-0 shadow-32"
    :class="modalClass"
  )
    div(class="flex justify-between w-full pb-6 border-b border-grey-200")
      div(class="flex items-center gap-2")
        f-button(
          v-if="showBackButton && page > 0"
          @click="$emit('click:back')"
          type="text"
        )
          f-svg-icon(iconName="arrow_back" size="24" class="text-grey-900")
        p(class="text-xl font-bold") {{ header }}
      f-button(@click="closeModalBehavior" type="text" v-if="closable")
        f-svg-icon(iconName="close_medium" size="24" class="text-grey-900")
    div(class="flex flex-col items-center justify-between flex-1 w-full gap-6")
      slot(name="default")
      div(
        v-if="secondaryBtnText || primaryBtnText"
        class="flex gap-4"
        :class="actionBtnFullWidth ? 'w-full' : 'w-fit ml-auto'"
      )
        f-button(
          v-if="secondaryBtnText !== ''"
          class="flex-1 p-2 text-sm !font-bold"
          :class="[secondaryBtnDisabled ? '' : '!border-green-200-v1 text-green-500-v1']"
          :theme="theme"
          :size="btnSize"
          type="secondary"
          :prependIcon="secondaryBtnIcon"
          :disabled="secondaryBtnDisabled"
          data-cy="modal-behavior_secondary"
          @click="$emit('click:secondary')"
        ) {{ secondaryBtnText }}
        f-button(
          class="flex-1 p-2 text-sm !font-bold transition-all"
          :class="[primaryBtnDisabled ? '' : 'bg-green-500-v1 hover:bg-green-500-v1 hover:brightness-110 ']"
          v-if="primaryBtnText !== ''"
          :theme="theme"
          :size="btnSize"
          type="primary"
          :prependIcon="primaryBtnIcon"
          :disabled="primaryBtnDisabled"
          data-cy="modal-behavior_primary"
          @click="$emit('click:primary')"
        ) {{ primaryBtnText }}
div(
  v-else
  class="fixed inset-0 flex items-center justify-center w-screen h-screen z-modal bg-grey-900/40"
)
  div(class="w-screen h-screen" @click="closable && closeModalBehavior()")
  div(
    class="absolute rounded w-min card-show shadow-32"
    :data-cy="testId"
    :class="[theme === THEME.DARK ? 'bg-grey-800' : 'bg-grey-0', needFullScreen ? 'w-screen h-screen' : '', displayHeader ? 'pt-5' : '', animation ? 'modal-animation' : '']"
  )
    div(
      v-if="displayHeader"
      class="px-5 pb-4 flex justify-between items-center gap-4 border-b border-primary-border"
      data-cy="modal-how-to-scan-header"
    )
      p(
        class="font-bold text-grey-950-v1 text-lg"
        :class="[theme === THEME.DARK ? 'text-grey-100' : 'text-grey-900']"
      ) {{ header }}
      f-svg-icon(
        v-if="closable"
        iconName="clear"
        size="24"
        class="cursor-pointer text-grey-900-v1"
        @click="closeModalBehavior"
      )
    f-scrollbar-container(class="box-content relative px-5 pt-5 pb-5 w-fit max-h-115")
      slot(name="default")
    div(
      v-if="footer && !usingCustomFooter"
      class="p-5 h-18.5 border-content border-t flex items-center border-primary-border"
    )
      div(class="flex justify-between w-full")
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
import { THEME, VERSION } from '@/utils/constants'
import { string } from 'zod'

defineEmits(['click:primary', 'click:secondary', 'click:text', 'click:back'])
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
  version: {
    type: String,
    default: 'v1',
  },
  showBackButton: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Number,
    default: 0,
  },
  modalClass: {
    type: String,
    default: '',
  },
  actionBtnFullWidth: {
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

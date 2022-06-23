<template lang="pug">
div(class="fixed inset-0 z-modal-confirm  w-screen h-screen bg-black-900/30 flex justify-center items-center" @click="closeModalConfirm")
  div(class="w-104 max-h-125 min-h-54 px-8 py-6 bg-black-0 rounded flex flex-col" @click.stop)
    div(class="h-9 pb-3.5 flex items-center")
      svg-icon(:iconName="getIconName" :class="[getIconColor]" size="22")
      p(class="text-body1 font-bold pl-3") {{ header }}
    overlay-scrollbar-container(class="max-h-92.5 flex-grow pl-8.5")
      p(v-if="!!contentText" class="text-body2 leading-1.6" v-html="contentText")
      component(v-else :is="contentComponent")
    div(class="h-11.5 pt-3 flex justify-between")
      div
        p(v-if="!!noteText" class="flex items-center text-caption leading-1.6" v-html="noteText")
        component(v-else :is="noteComponent")
      div(class="grid grid-flow-col gap-x-2.5")
        btn(v-if="textBtnText !== ''" size="sm" type="text" @click="textHandler") {{ textBtnText }}
        btn(v-if="secondaryBtnText !== ''" size="sm" type="secondary" @click="secondaryHandler") {{ secondaryBtnText }}
        btn(v-if="primaryBtnText !== ''" size="sm" type="primary" @click="primaryHandler") {{ primaryBtnText }}
</template>

<script setup>
import { MODAL_CONFIRM_TYPE } from '@/utils/constants.js'
import { computed } from 'vue'
import { useStore } from 'vuex'
import useNavigation from '@/composables/useNavigation'

const store = useStore()
const { parsePath } = useNavigation()
const props = defineProps({
  header: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    default: MODAL_CONFIRM_TYPE.SUCCESS,
    validator: (v) => Object.keys(MODAL_CONFIRM_TYPE).map(key => MODAL_CONFIRM_TYPE[key]).includes(v)
  },
  contentText: {
    type: String
  },
  contentComponent: {
    type: Object
  },
  noteText: {
    type: String
  },
  noteComponent: {
    type: Object,
  },
  primaryBtnText: {
    type: String,
    default: ''
  },
  primaryBtnHandler: {
    type: Function,
  },
  closeAfterPrimaryBtnHandler: {
    type: Boolean,
    default: true
  },
  afterPrimaryBtnHandler: {
    type: Function,
  },
  secondaryBtnText: {
    type: String,
    default: ''
  },
  secondaryBtnHandler: {
    type: Function,
  },
  closeAfterSecondaryBtnHandler: {
    type: Boolean,
    default: true
  },
  afterSecondaryBtnHandler: {
    type: Function,
  },
  textBtnText: {
    type: String,
    default: ''
  },
  textBtnHandler: {
    type: Function,
  },
  closeAfterTextBtnHandler: {
    type: Boolean,
    default: true
  },
  afterTextBtnHandler: {
    type: Function,
  }
})

const { INFO, WARNING, SUCCESS, ALERT } = MODAL_CONFIRM_TYPE

const getIconName = computed(() => {
  const map = {
    [INFO]: 'error_outline',
    [WARNING]: 'error_outline',
    [SUCCESS]: 'check_circle_outline',
    [ALERT]: 'warning_amber_round',
  }
  return map[props.type]
})

const getIconColor = computed(() => {
  const map = {
    [INFO]: 'text-assist-light-blue',
    [WARNING]: 'text-assist-light-yellow',
    [SUCCESS]: 'text-brand',
    [ALERT]: 'text-warn',
  }
  return map[props.type]
})

const closeModalConfirm = () => store.dispatch('helper/closeModalConfirm')

const primaryHandler = async () => {
  !!props.primaryBtnHandler && await props.primaryBtnHandler()
  props.closeAfterPrimaryBtnHandler && closeModalConfirm()
  !!props.afterPrimaryBtnHandler && await props.afterPrimaryBtnHandler()
}
const secondaryHandler = async () => {
  !!props.secondaryBtnHandler && await props.secondaryBtnHandler()
  props.closeAfterSecondaryBtnHandler && closeModalConfirm()
  !!props.afterSecondaryBtnHandler && await props.afterSecondaryBtnHandler()
}
const textHandler = async () => {
  !!props.textBtnHandler && await props.textBtnHandler()
  props.closeAfterTextBtnHandler && closeModalConfirm()
  !!props.afterTextBtnHandler && await props.afterTextBtnHandler()
}

</script>

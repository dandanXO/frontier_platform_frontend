<template lang="pug">
modal-behavior(
  :header="$t('FF0093')"
  :primaryBtnText="$t('FF0092')"
  :primaryBtnDisabled="actionBtnDisabled"
  @click:primary="sendEmail"
  @click:secondary="closeModal"
  btnSize="md"
  version="v2"
)
  div(class="w-full min-h-31.5")
    div(class="mb-4" v-if="!props.showEmail")
      f-input-text(
        :label="$t('FF0094')"
        v-model:textValue="emailSubject"
        ref="emailInput"
        placeholder="name@mail.com"
        required
        class="w-full"
        :rules="[$inputRules.required(), $inputRules.email()]"
      )
    div(class="")
      f-input-textarea(
        v-model:textValue="emailBody"
        :label="textAreaLabel"
        :placeholder="$t('RR0510')"
        height="146"
        required
      )
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import type {
  Material,
  NodeChild,
  MainMaterial,
  ShareNodeChild,
} from '@frontier/platform-web-sdk'
import { useNotifyStore } from '@/stores/notify'
import { VERSION } from '@frontier/lib'

// Props interface for email contact modal
export interface PropsModalEmailContact {
  node?: NodeChild | ShareNodeChild
  showEmail?: boolean
  material: Material
  metaData?: {
    unitName: string
  }
  showReachOutEmailCategory?: number
}

const props = defineProps<PropsModalEmailContact>()
const store = useStore()
const { t } = useI18n()

const emailInput = ref()

const emailSubject = ref('')
const emailBody = ref('')
const notify = useNotifyStore()

const sendEmail = async () => {
  const _email = emailSubject?.value || store.getters['user/email']
  let _frontierNo = ''
  if (props.material.faceSide?.isMainSide) {
    _frontierNo = props.material.faceSide?.frontierNo
  } else if (props.material.backSide?.isMainSide) {
    _frontierNo = props.material.backSide?.frontierNo
  } else {
    _frontierNo =
      (props.material as unknown as MainMaterial)?.mainSide?.frontierNo || ''
  }

  store
    .dispatch('user/contactSend', {
      category: props.showReachOutEmailCategory || 0,
      email: _email,
      message: emailBody.value,
      frontierNo: _frontierNo,
    })
    .then(() => {
      notify.showNotifySnackbar({
        messageText: t('FF0097'),
        title: t('FF0098'),
        version: VERSION.V2,
        hasCloseButton: false,
        delay: 5000,
      })
    })
    .catch((err) => {})

  store.dispatch('helper/closeModalBehavior')
}

const actionBtnDisabled = computed(() => {
  return (
    emailInput?.value?.isError ||
    (!props.showEmail && !emailSubject.value) ||
    !emailBody.value
  )
})
const textAreaLabel = computed(() => {
  return t('RR0509', {
    organizationorgroupname: props.node?.nodeMeta?.unitName || props.metaData?.unitName || '',
  })
})
const closeModal = () => store.dispatch('helper/closeModalBehavior')
</script>

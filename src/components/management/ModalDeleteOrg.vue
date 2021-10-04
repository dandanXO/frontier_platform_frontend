<template lang="pug">
div(class="w-100")
  div(class="px-8")
    h6(class="text-h6 text-primary font-bold pb-4 text-center") {{$t('b.deleteOrg')}}
    i18n-t(keypath="b.enterOrgNameToDelete" tag="p" class="text-primary text-center pb-4")
      template(#orgName)
        br
        strong {{orgName}}
    div(class="pb-6 flex justify-center")
      input-text(v-model:textValue="confirmText" class="w-80" size="lg" :placeholder="orgName" :customErrorMsg="errorMsg")
    div(class="h-25 flex justify-center items-center")
      div(class="grid grid-cols-2 gap-x-3")
        btn(size="md" type="secondary" :disabled="confirmText.length === 0" @click="openModelDoubleConfirm") {{$t('reuse.confirm')}}
        btn(size="md" @click="closeModal") {{$t('reuse.cancel')}}
</template>
<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'ModalDeleteOrg',
  props: {
    orgName: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const router = useRouter()
    const store = useStore()
    const { t } = useI18n()
    const confirmText = ref('')
    const errorMsg = ref('')
    const openModelDoubleConfirm = () => {
      if (confirmText.value !== props.orgName) {
        errorMsg.value = t('err.orgNameIsWrong')
        return
      }
      store.dispatch('helper/pushModalConfirm', {
        title: t('b.deleteTheOrg'),
        content: t('b.afterDeleteOrg'),
        secondaryText: t('b.confirm'),
        secondaryHandler: async () => {
          await store.dispatch('organization/deleteOrg')
          store.dispatch('helper/clearModalPipeline')
          router.push('/')
        }
      })
    }

    const closeModal = () => {
      store.dispatch('helper/closeModal')
    }

    watch(
      () => confirmText.value,
      () => {
        if (confirmText.value === '') {
          errorMsg.value = ''
        }
      }
    )

    return {
      confirmText,
      errorMsg,
      closeModal,
      openModelDoubleConfirm
    }
  }
}
</script>

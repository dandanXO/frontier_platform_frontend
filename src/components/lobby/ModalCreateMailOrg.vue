<template lang="pug">
modal-behavior(
  :header="$t('AA0077')"
  :primaryBtnText="$t('UU0020')"
  :primaryBtnDisabled="!availableToCreateOrg"
  :secondaryBtnText="isOldOrg ? '' : $t('UU0004')"
  @click:primary="isOldOrg ? setOrgUploadMail() : createOrg()"
  @click:secondary="openModalCreateOrg"
)
  div(class="w-90")
    p(class="text-body2 text-primary leading-1.6 text-center pb-4") {{ $t("AA0078") }}
    div(class="flex items-center")
      input-text(
        v-model:textValue="uploadMaterialEmail"
        required
        class="w-58.5 mr-2"
        :customErrorMsg="errorMsg"
      )
        template(#errorMsg v-if="suggestEmailList.length > 0")
          p(v-if="suggestEmailList.length > 0" class="text-caption text-warn absolute pt-1 whitespace-nowrap") {{ $t("WW0029") }}
      p(class="text-body2 text-primary") {{ $t("AA0079") }}
    div(v-if="suggestEmailList.length > 0" class="pt-7.5 flex")
      p(class="text-body2 text-primary pr-2") {{ $t("AA0085") }}
      div
        p(v-for="email in suggestEmailList" class="text-body2 text-assist-blue pb-2.5") {{ email }}
</template>

<script setup>
import { ref } from 'vue'
import { computed, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

defineProps({
  isOldOrg: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const suggestEmailList = ref([])
const errorMsg = ref('')
const uploadMaterialEmail = computed({
  get: () => store.getters['organization/createForm'].uploadMaterialEmail,
  set: (v) => store.commit('organization/SET_createForm_uploadMaterialEmail', v)
})
const availableToCreateOrg = computed(() => uploadMaterialEmail.value !== '' && suggestEmailList.value.length === 0 && errorMsg.value.length === 0)

const openModalCreateOrg = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-org'
  })
}

const createOrg = async () => {
  store.dispatch('helper/pushModalLoading')
  const { success, message, result } = await store.dispatch('organization/createOrg')

  if (success) {
    store.dispatch('helper/clearModalPipeline')
    router.push({ name: 'PublicLibrary', params: { orgNo: store.getters['organization/organization'].orgNo } })
  } else if (result.availableEmailList?.length > 0) {
    suggestEmailList.value = result.availableEmailList
  } else {
    errorMsg.value = message.content
  }
  store.dispatch('helper/closeModalLoading')
}

const setOrgUploadMail = async () => {
  store.dispatch('helper/pushModalLoading')
  const { success, message, result } = await store.dispatch('organization/setOrgUploadMail', { uploadMaterialEmail: uploadMaterialEmail.value })

  if (success) {
    store.dispatch('helper/clearModalPipeline')
  } else if (result.availableEmailList?.length > 0) {
    suggestEmailList.value = result.availableEmailList
  } else {
    errorMsg.value = message.content
  }
  store.dispatch('helper/closeModalLoading')
}

watch(
  () => uploadMaterialEmail.value,
  () => {
    suggestEmailList.value.length = 0
    errorMsg.value = ''

    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/
    const emailAddress = `${uploadMaterialEmail.value}@textile.cloud`
    if (emailAddress.length > 60 || !re.test(emailAddress)) {
      errorMsg.value = t('WW0019')
    }
  }
)
</script>

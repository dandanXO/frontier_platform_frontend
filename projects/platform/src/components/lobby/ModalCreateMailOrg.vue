<template lang="pug">
modal-behavior(
  :header="$t('AA0077')"
  :primaryBtnText="$t('UU0020')"
  :primaryBtnDisabled="!availableToCreateOrg"
  :textBtnText="isOldOrg ? '' : $t('UU0004')"
  @click:primary="isOldOrg ? setOrgUploadMail() : createOrg()"
  @click:text="openModalCreateOrg"
)
  div(class="w-94 min-h-31.5")
    p(class="text-body2 text-grey-900 leading-1.6 pb-4") {{ $t("AA0078") }}
    div(class="flex items-center")
      f-input-text(
        v-model:textValue="uploadMaterialEmail"
        required
        class="w-68.5 mr-2"
        :customErrorMsg="errorMsg"
        :rules="[$inputRules.required()]"
        data-cy="modal-create-mail-org_email"
      )
        template(#slot:errorMsg v-if="suggestEmailList.length > 0")
          p(v-if="suggestEmailList.length > 0" class="text-caption text-red-400 absolute pt-1 whitespace-nowrap") {{ $t("WW0029") }}
      p(class="text-body2 text-grey-900") {{ $t("AA0079") }}
    div(v-if="suggestEmailList.length > 0" class="pt-7.5 flex")
      p(class="text-body2 text-grey-900 pr-2") {{ $t("AA0085") }}
      div(class="grid gap-y-2.5")
        p(v-for="email in suggestEmailList" class="text-body2 text-cyan-400") {{ email }}
</template>

<script setup>
import { ref } from 'vue'
import { computed, watch } from 'vue'
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
  try {
    store.dispatch('helper/pushModalLoading')
    await store.dispatch('organization/createOrg')
    store.dispatch('helper/clearModalPipeline')
    router.push({ name: 'PublicLibrary', params: { orgNo: store.getters['organization/organization'].orgNo } })
  } catch (error) {
    store.dispatch('helper/closeModalLoading')
    const { code, result } = error
    switch (code) {
      case 'ERR0029':
        suggestEmailList.value = result.availableEmailList
        break
      default:
        throw error
    }
  }
}

const setOrgUploadMail = async () => {
  try {
    store.dispatch('helper/pushModalLoading')
    await store.dispatch('organization/setOrgUploadMail', { uploadMaterialEmail: uploadMaterialEmail.value })
    store.dispatch('helper/clearModalPipeline')
  } catch (error) {
    store.dispatch('helper/closeModalLoading')
    const { code, result } = error
    switch (code) {
      case 'ERR0029':
        suggestEmailList.value = result.availableEmailList
        break
      default:
        throw error
    }
  }
}

watch(
  () => uploadMaterialEmail.value,
  () => {
    suggestEmailList.value.length = 0
    errorMsg.value = ''

    const allowed = /^[a-zA-Z0-9_.-]+$/
    const order = /^[a-zA-Z0-9]+([_.-]?[a-zA-Z0-9]+)*$/

    if (!allowed.test(uploadMaterialEmail.value)) {
      errorMsg.value = t('WW0114')
    } else if (!order.test(uploadMaterialEmail.value)) {
      errorMsg.value = t('WW0115')
    } else if (uploadMaterialEmail.value.length > 46) {
      errorMsg.value = t('WW0116')
    }
  }
)
</script>

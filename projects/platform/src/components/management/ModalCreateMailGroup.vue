<template lang="pug">
modal-behavior(
  :header="$t('BB0092')"
  :primaryBtnText="$t('UU0020')"
  :textBtnText="$t('UU0004')"
  :primaryBtnDisabled="!availableToCreateGroup"
  @click:primary="createGroup"
  @click:text="openModalCreateGroup"
)
  div(class="w-94 min-h-31.5")
    p(class="text-body2 text-grey-900 leading-1.6 pb-4") {{ $t("BB0093") }}
    div(class="flex items-center")
      f-input-text(
        v-model:textValue="uploadMaterialEmail"
        required
        class="w-68.5 mr-2"
        :customErrorMsg="errorMsg"
        :rules="[$inputRules.required()]"
        data-cy="modal-create-mail-group_email"
      )
        template(#slot:errorMsg v-if="suggestEmailList.length > 0")
          p(v-if="suggestEmailList.length > 0" class="text-caption text-red-400 absolute pt-1 whitespace-nowrap") {{ $t("WW0029") }}
      p(class="text-body2 text-grey-900") {{ $t("BB0094") }}
    div(v-if="suggestEmailList.length > 0" class="pt-7.5 flex")
      p(class="text-body2 text-grey-900 pr-2") {{ $t("BB0106") }}
      div(class="grid gap-y-2.5")
        p(v-for="email in suggestEmailList" class="text-body2 text-cyan-400") {{ email }}
</template>

<script setup>
import { ref } from 'vue'
import { computed, watch } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()
const router = useRouter()
const errorMsg = ref('')
const suggestEmailList = ref([])
const uploadMaterialEmail = computed({
  get: () => store.getters['group/createForm'].uploadMaterialEmail,
  set: (v) => store.commit('group/SET_createForm_uploadMaterialEmail', v)
})
const availableToCreateGroup = computed(() => uploadMaterialEmail.value !== '' && suggestEmailList.value.length === 0 && errorMsg.value.length === 0)
const groupId = computed(() => store.getters['group/group'].groupId)
const orgNo = computed(() => store.getters['organization/organization'].orgNo)

const openModalCreateGroup = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-group'
  })
}
const createGroup = async () => {
  try {
    store.dispatch('helper/pushModalLoading')
    await store.dispatch('group/createGroup')
    store.dispatch('helper/clearModalPipeline')
    router.push(`/${orgNo.value}/${groupId.value}/management/about`)
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

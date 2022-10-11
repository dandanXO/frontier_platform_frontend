<template lang="pug">
modal-behavior(
  :header="$t('AA0011')"
  :primaryBtnText="$t('UU0021')"
  :primaryBtnDisabled="!availableToCreateOrg"
  @click:primary="openModalCreateMailOrg"
)
  form(class="w-183.5")
    div(class="grid grid-cols-2 grid-rows-2 gap-x-7.5 gap-y-6")
      f-input-text(
        v-model:textValue="formData.orgName"
        required
        :rules="[$inputRules.required()]"
        :label="$t('AA0038')"
        :placeholder="$t('AA0039')"
        :customErrorMsg="isOrgNameExist ? $t('WW0001') : ''"
        @blur="checkOrgNameExist"
        data-cy="modal-create-org_name"
      )
      f-input-select(
        v-model:selectValue="formData.countryCode"
        :optionList="countryList"
        :label="$t('AA0036')"
        keyOptionDisplay="name"
        keyOptionValue="countryCode"
        searchBox
        :placeholder="$t('AA0037')"
        required
        @select="handleCountryCodeSelected"
        data-cy="modal-create-org_country"
      )
      f-input-radio-group(
        v-model:inputValue="formData.orgCategoryId"
        :label="$t('AA0069')"
        :optionList="orgCategoryList"
        keyOptionValue="orgCategoryId"
        required
        data-cy="modal-create-org_category"
      )
    div(class="flex items-center mb-5")
      div(class="text-caption font-bold text-grey-200 mr-4.5") {{ $t("RR0177") }}
      div(class="border-t border-grey-100 w-full")
    div(class="grid grid-cols-2 grid-rows-2 gap-x-7.5 gap-y-4")
      input-calling-code(
        v-model:textValue="formData.phone"
        v-model:countryCode="formData.phoneCountryCode"
        class="w-85"
        :label="$t('AA0071')"
        :placeholder="$t('AA0072')"
      )
      f-input-text(v-model:textValue="formData.address" :label="$t('AA0040')" :placeholder="$t('AA0041')")
      input-calling-code(
        v-model:textValue="formData.fax"
        v-model:countryCode="formData.faxCountryCode"
        class="w-85"
        :label="$t('AA0073')"
        :placeholder="$t('AA0074')")
</template>

<script setup>
import { useStore } from 'vuex'
import { computed, reactive, ref, watch } from 'vue'

const store = useStore()
const isOrgNameExist = ref(false)
const formData = reactive({ ...store.getters['organization/createForm'] })
const orgCategoryList = computed(() => store.getters['code/orgCategoryList'])
const countryList = computed(() => store.getters['code/countryList'])
const availableToCreateOrg = computed(() => formData.countryCode !== '' && formData.orgName !== '' && !isOrgNameExist.value)

watch(
  () => formData.orgName,
  () => {
    if (isOrgNameExist.value) {
      isOrgNameExist.value = false
    }
  }
)
const openModalCreateMailOrg = async () => {
  await checkOrgNameExist()

  if (isOrgNameExist.value) {
    return
  }

  store.commit('organization/SET_createForm', formData)
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-mail-org'
  })
}

const handleCountryCodeSelected = (option) => {
  formData.faxCountryCode = option
  formData.phoneCountryCode = option
}

const checkOrgNameExist = async () => {
  isOrgNameExist.value = formData.orgName !== '' && (await store.dispatch('organization/checkOrgNameExist', { orgName: formData.orgName }))
}
</script>

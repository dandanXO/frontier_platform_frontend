<template lang="pug">
div(class="w-101 px-8")
  h6(class="text-primary font-bold text-h6 pb-7.5 mb-2.5 border-b border-black-400 w-full text-center") {{$t('a.createOrg')}}
  p(class="text-caption text-black-600 text-right mb-1.5") {{$t('a.required')}}
  form(class="w-full grid gap-y-6")
    input-radio-group(
      v-model:inputValue="formData.orgCategoryId"
      :label="$t('a.orgType')"
      :optionList="orgCategoryList"
      keyOptionValue="orgCategoryId"
      required
    )
    input-select(
      v-model:selectValue="formData.countryCode"
      class="relative z-10"
      :options="countryList"
      :label="$t('a.country')"
      keyOptionDisplay="name"
      keyOptionValue="countryCode"
      searchBox
      :placeholder="$t('a.yourCountry')"
      required
    )
    input-text(
      v-model:textValue="formData.orgName"
      class="relative"
      required
      :label="$t('a.orgName')"
      :placeholder="$t('a.yourOrgName')"
      :customErrorMsg="isOrgNameExist ? $t('err.nameAlreadyExists') : ''"
      @blur="checkOrgNameExist")
    input-text(v-model:textValue="formData.address" :label="$t('a.orgAddress')" :placeholder="$t('a.yourOrgAddress')")
    input-calling-code(
      v-model:textValue="formData.phone"
      v-model:countryCode="formData.phoneCountryCode"
      class="relative z-9"
      width="340"
      :label="$t('a.phone')"
      :placeholder="$t('a.yourPhone')"
    )
    input-calling-code(
      v-model:textValue="formData.fax"
      v-model:countryCode="formData.faxCountryCode"
      class="relative z-8"
      width="340"
      :label="$t('a.fax')"
      :placeholder="$t('a.yourFax')")
  div(class="h-25 flex items-center")
    btn(size="lg" class="w-full" :disabled="!avaliableToCreateOrg" @click="openModalCreateMailOrg") {{$t('reuse.next')}}
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref, watch } from 'vue'
import InputCallingCode from '@/components/InputCallingCode'

export default {
  name: 'ModalCreateOrg',
  components: {
    InputCallingCode
  },
  setup () {
    const store = useStore()
    const isOrgNameExist = ref(false)
    const formData = reactive({ ...store.getters['organization/createForm'] })
    const orgCategoryList = computed(() => store.getters['code/orgCategoryList'])
    const countryList = computed(() => store.getters['code/countryList'])
    const avaliableToCreateOrg = computed(() => formData.countryCode !== '' && formData.orgName !== '' && !isOrgNameExist.value)

    watch(
      () => formData.orgName,
      () => {
        if (isOrgNameExist.value) {
          isOrgNameExist.value = false
        }
      }
    )
    const openModalCreateMailOrg = () => {
      store.commit('organization/SET_createForm', formData)
      store.dispatch('helper/openModal', {
        component: 'modal-create-mail-org'
      })
    }

    const checkOrgNameExist = async () => {
      isOrgNameExist.value = await store.dispatch('organization/checkOrgNameExist', { orgName: formData.orgName })
    }

    return {
      orgCategoryList,
      formData,
      countryList,
      avaliableToCreateOrg,
      checkOrgNameExist,
      isOrgNameExist,
      openModalCreateMailOrg
    }
  }
}
</script>

<template lang="pug">
div(class="w-193.5 px-8")
  h6(class="text-primary font-bold text-h6 pb-7.5 text-center") {{$t('AA0011')}}
  p(class="text-caption text-black-600 text-right mb-1") *{{$t('AA0031')}}
  form(class="grid grid-cols-2 grid-rows-3 gap-7.5 pb-4")
    input-text(
      v-model:textValue="formData.orgName"
      class="relative"
      required
      :label="$t('AA0038')"
      :placeholder="$t('AA0039')"
      :customErrorMsg="isOrgNameExist ? $t('WW0001') : ''"
      @blur="checkOrgNameExist"
    )
    input-radio-group(
      v-model:inputValue="formData.orgCategoryId"
      :label="$t('AA0069')"
      :optionList="orgCategoryList"
      keyOptionValue="orgCategoryId"
      required
    )
    input-select(
      v-model:selectValue="formData.countryCode"
      class="relative z-10"
      :options="countryList"
      :label="$t('AA0036')"
      keyOptionDisplay="name"
      keyOptionValue="countryCode"
      searchBox
      :placeholder="$t('AA0037')"
      required
    )
    input-calling-code(
      v-model:textValue="formData.phone"
      v-model:countryCode="formData.phoneCountryCode"
      class="relative z-9"
      width="340"
      :label="$t('AA0071')"
      :placeholder="$t('AA0072')"
    )
    input-text(v-model:textValue="formData.address" :label="$t('AA0040')" :placeholder="$t('AA0041')")
    input-calling-code(
      v-model:textValue="formData.fax"
      v-model:countryCode="formData.faxCountryCode"
      class="relative z-8"
      width="340"
      :label="$t('AA0073')"
      :placeholder="$t('AA0074')")
  btn-group(
    class="h-25"
    :primaryText="$t('UU0021')"
    :primaryButtonDisabled="!availableToCreateOrg"
    @click:primary="openModalCreateMailOrg"
    :secondaryButton="false"
  )
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, ref, watch } from 'vue'
import InputCallingCode from '@/components/InputCallingCode.vue'

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

      if (isOrgNameExist.value) { return }

      store.commit('organization/SET_createForm', formData)
      store.dispatch('helper/openModal', {
        component: 'modal-create-mail-org'
      })
    }

    const checkOrgNameExist = async () => {
      isOrgNameExist.value = formData.orgName !== '' && await store.dispatch('organization/checkOrgNameExist', { orgName: formData.orgName })
    }

    return {
      orgCategoryList,
      formData,
      countryList,
      availableToCreateOrg,
      checkOrgNameExist,
      isOrgNameExist,
      openModalCreateMailOrg
    }
  }
}
</script>

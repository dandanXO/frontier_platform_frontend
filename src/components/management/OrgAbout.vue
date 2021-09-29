<template lang="pug">
div(class="l:pt-16 pt-17.5")
  div(class="flex justify-center")
    div(class="w-40 l:mr-11 mr-15")
      div(class="flex flex-col items-center")
        div(class="relative")
          img(:src="logo" class="w-40 h-40 rounded-full bg-black-500")
          div(class="absolute flex justify-center items-center right-2 bottom-2 w-8 h-8 rounded-full bg-black-0 border-4 border-black-200 cursor-pointer"
            @click="openModalUpload()"
          )
            svg-icon(iconName="camera" size="20" class="text-black-700")
        div(class="flex items-center pt-4")
          p(class="text-caption text-primary") ID: {{organization.orgNo}}
          svg-icon(iconName="content_copy" size="14" class="text-black-700")
        p(class="pt-2.5 text-caption text-black-500 cursor-pointer") {{$t('reuse.delete')}}
    div(class="grid gap-y-8.5 relative")
      p(class="absolute text-caption text-black-500 right-0 -top-7 transform -translate-y-full") *{{$t('b.required')}}
      div(class="grid grid-cols-2 grid-rows-3 gap-y-7.5 l:gap-x-8 gap-x-15")
        input-label-color(
          v-model:labelColor="orgFormData.labelColor"
          v-model:textValue="orgFormData.orgName"
          :label="$t('b.orgName')"
          :customErrorMsg="isOrgNameExist ? $t('err.nameAlreadyExists') : ''"
          required
          class="w-85 relative z-11"
        )
        input-radio-group(
          v-model:inputValue="orgFormData.orgCategoryId"
          :label="$t('b.orgType')"
          :optionList="orgCategoryList"
          keyOptionValue="orgCategoryId"
          required
        )
        input-select(
          v-model:selectValue="orgFormData.countryCode"
          :options="countryList"
          :label="$t('b.country')"
          keyOptionDisplay="name"
          keyOptionValue="countryCode"
          searchBox
          class="relative z-10 w-85"
          required
        )
        input-text(v-model:textValue="orgFormData.address" :label="$t('b.orgAddress')" class="w-85" :placeholder="$t('b.yourAddress')")
        input-calling-code(
          v-model:textValue="orgFormData.phone"
          v-model:countryCode="orgFormData.phoneCountryCode"
          class="relative z-9"
          width="340"
          :label="$t('b.phone')"
          :placeholder="$t('b.yourPhone')"
        )
        input-calling-code(
          v-model:textValue="orgFormData.fax"
          v-model:countryCode="orgFormData.faxCountryCode"
          class="relative z-8"
          width="340"
          :label="$t('b.fax')"
          :placeholder="$t('b.faxNumber')"
        )
      btn(size="md" class="justify-self-end" :disabled="!avaliableToUpdateOrg" @click="updateOrg") {{$t('reuse.save')}}
</template>

<script>
import { computed, reactive, toRaw, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import InputCallingCode from '@/components/InputCallingCode'
import InputLabelColor from '@/components/InputLabelColor'
// import domToImage from 'dom-to-image'

export default {
  name: 'OrgAbout',
  components: {
    InputCallingCode,
    InputLabelColor
  },
  setup () {
    const store = useStore()
    const { t } = useI18n()

    const organization = computed(() => store.getters['organization/organization'])
    const logo = computed(() => store.getters['organization/orgLogo'])
    const { orgName, labelColor, orgCategoryId, address, countryCode, fax, faxCountryCode, phone, phoneCountryCode } = organization.value
    const countryList = computed(() => store.getters['code/countryList'])
    const orgCategoryList = computed(() => store.getters['code/orgCategoryList'])
    const orgFormData = reactive({ orgName, labelColor, orgCategoryId, address, countryCode, fax, faxCountryCode, phone, phoneCountryCode })
    const isOrgNameExist = ref(false)
    const avaliableToUpdateOrg = computed(() => orgFormData.orgName !== '' && !isOrgNameExist.value)
    const checkOrgNameExist = async () => {
      isOrgNameExist.value = await store.dispatch('organization/checkOrgNameExist', { orgName: orgFormData.orgName, orgId: organization.value.orgId })
    }

    const openModalUpload = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-upload',
        header: t('b.updateOrgLogo'),
        closeHandler: () => {
          store.commit('organization/orgLogo/SET_uploadStatus', 'none')
        }
      })
    }

    const updateOrg = async () => {
      try {
        if (orgFormData.orgName !== organization.value.orgName) {
          await checkOrgNameExist()
          if (isOrgNameExist.value) { return }
        }

        await store.dispatch('organization/updateOrg', toRaw(orgFormData))

        /**
         * @todo successful flash message
         */
      } catch (error) {
        console.log(error)
      }
    }

    watch(
      () => orgFormData.orgName,
      () => {
        if (isOrgNameExist.value) {
          isOrgNameExist.value = false
        }
      }
    )

    return {
      orgFormData,
      orgCategoryList,
      countryList,
      updateOrg,
      openModalUpload,
      isOrgNameExist,
      avaliableToUpdateOrg,
      organization,
      logo
    }
  }
}
</script>

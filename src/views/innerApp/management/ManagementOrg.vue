<template lang="pug">
template(v-if="tab === 'about'")
  div(class="l:pl-5 pl-19 2xl:pl-59 l:pt-16 pt-17.5")
    div(class="flex")
      div(class="w-40 l:mr-11 mr-15")
        div(class="flex flex-col items-center")
          img(:src="organization.logo" class="w-40 h-40 rounded-full bg-black-500")
          div(class="flex items-center pt-4")
            p(class="text-caption text-primary") ID: {{organization.orgNo}}
            svg-icon(iconName="content_copy" size="14" class="text-black-700")
          p(class="pt-2.5 text-caption text-black-500 cursor-pointer") {{$t('b.delete')}}
      div(class="grid gap-y-8.5 relative")
        p(class="absolute text-caption text-black-500 right-0 -top-7 transform -translate-y-full") *{{$t('b.required')}}
        div(class="grid grid-cols-2 grid-rows-3 gap-y-7.5 l:gap-x-8 gap-x-15")
          input-label-color(
            v-model:labelColor="orgFormData.labelColor"
            v-model:textValue="orgFormData.orgName"
            :label="$t('b.orgName')"
            :rules="[inputRules.required()]"
            :hasSlotContent="isOrgNameExist"
            required
            class="w-85 relative z-11"
          )
            template(#errorMsg v-if="isOrgNameExist")
              p(class="absolute text-warn text-caption pt-1") {{$t('reuse.nameAlreadyExists')}}
          div(class="grid gap-y-2 items-start w-85")
            div(class="flex text-body2 font-bold")
              i(class="text-warn") *
              p(class="text-primary") {{$t('b.orgType')}}
            div(class="flex justify-between")
              old-input-radio(v-for="type in orgCategoryList"
                v-model:inputValue="orgFormData.orgCategoryId"
                name="orgCategory"
                :value="type.orgCategoryId"
                :label="type.label"
              )
          div(class="grid gap-y-2 relative z-10 w-85")
            div(class="flex text-body2 font-bold")
              i(class="text-warn") *
              p(class="text-primary") {{$t('b.country')}}
            old-input-select(v-model:value="orgFormData.countryCode" :options="countryList" keyOptionDisplay="name" keyOptionValue="countryCode")
          input-text(v-model:value="orgFormData.address" :label="$t('b.orgAddress')" class="w-85" :placeholder="$t('b.yourAddress')")
          div(class="grid gap-y-2 relative z-9")
            p(class="text-primary font-bold text-body2") {{$t('b.phone')}}
            input-calling-code(v-model:value="orgFormData.phone" v-model:countryCode="orgFormData.phoneCountryCode" :placeholder="$t('b.yourPhone')")
          div(class="grid gap-y-2 relative z-8")
            p(class="text-primary font-bold text-body2") {{$t('b.fax')}}
            input-calling-code(v-model:value="orgFormData.fax" v-model:countryCode="orgFormData.faxCountryCode" :placeholder="$t('b.faxNumber')")
        btn(size="md" class="justify-self-end" :disabled="!avaliableToUpdateOrg" @click="updateOrg") {{$t('b.save')}}
</template>

<script>
import { computed, reactive, toRaw, watch, ref } from 'vue'
import { useStore } from 'vuex'
import InputCallingCode from '@/components/InputCallingCode'
import InputLabelColor from '@/components/InputLabelColor'
import inputRules from '@/utils/input-rules'

export default {
  name: 'ManagementOrg',
  components: {
    InputCallingCode,
    InputLabelColor
  },
  props: {
    tab: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const store = useStore()

    const countryList = computed(() => store.getters['code/countryList'])
    const organization = computed(() => store.getters['organization/organization'])
    const orgFormData = reactive({})
    const orgCategoryList = reactive([
      {
        label: 'Brand',
        orgCategoryId: 1
      },
      {
        label: 'Supplier',
        orgCategoryId: 2
      },
      {
        label: 'Designer',
        orgCategoryId: 3
      },
      {
        label: 'Other',
        orgCategoryId: 4
      }
    ])
    const isOrgNameExist = ref(false)
    const avaliableToUpdateOrg = computed(() => orgFormData.orgName !== '' && !isOrgNameExist.value)

    const resetOrgFormData = () => {
      const { orgName, labelColor, orgCategoryId, address, countryCode, fax, faxCountryCode, phone, phoneCountryCode } = organization.value
      Object.assign(orgFormData, { orgName, labelColor, orgCategoryId, address, countryCode, fax, faxCountryCode, phone, phoneCountryCode })
    }

    const checkOrgNameExist = async () => {
      isOrgNameExist.value = await store.dispatch('organization/checkOrgNameExist', { orgName: orgFormData.orgName, orgId: organization.value.orgId })
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
      () => props.tab,
      () => {
        if (props.tab === 'about') {
          resetOrgFormData()
        }
      },
      {
        immediate: true
      }
    )
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
      resetOrgFormData,
      updateOrg,
      inputRules,
      isOrgNameExist,
      avaliableToUpdateOrg,
      organization
    }
  }
}
</script>

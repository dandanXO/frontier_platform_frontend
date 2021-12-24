<template lang="pug">
div(class="l:pt-16 pt-17.5")
  div(class="flex justify-center")
    div(class="w-40 l:mr-11 mr-15")
      div(class="flex flex-col items-center")
        div(class="relative")
          img(:src="logo" class="w-40 h-40 rounded-full bg-black-500")
          div(class="absolute flex justify-center items-center right-2 bottom-2 w-8 h-8 rounded-full bg-black-0 border-4 border-black-200 cursor-pointer"
            @click="openModalUploadLogo"
          )
            svg-icon(iconName="camera" size="20" class="text-black-500 hover:text-brand")
        div(class="flex items-center pt-4 cursor-pointer" @click="copyText(organization.orgNo), $store.commit('helper/PUSH_message', $t('BB0038'))")
          p(class="text-caption text-primary") ID: {{organization.orgNo}}
          tooltip(placement="bottom")
            template(#trigger)
              svg-icon(iconName="content_copy" size="14" class="text-black-700")
            template(#content)
              p(class="text-caption text-primary px-3 py-1") {{$t('BB0056')}}
        p(class="pt-2.5 text-caption text-black-500 cursor-pointer" @click="openModalDelete") {{$t('UU0013')}}
    div(class="grid gap-y-8.5 relative")
      p(class="absolute text-caption text-black-500 right-0 -top-7 transform -translate-y-full") *{{$t('BB0073')}}
      div(class="grid grid-cols-2 grid-rows-3 gap-y-7.5 l:gap-x-8 gap-x-15")
        input-label-color(
          v-model:labelColor="orgFormData.labelColor"
          v-model:textValue="orgFormData.orgName"
          :label="$t('BB0068')"
          :customErrorMsg="isOrgNameExist ? $t('WW0001') : ''"
          required
          class="w-85 relative z-11"
        )
        input-radio-group(
          v-model:inputValue="orgFormData.orgCategoryId"
          :label="$t('BB0072')"
          :optionList="orgCategoryList"
          keyOptionValue="orgCategoryId"
          required
        )
        input-select(
          v-model:selectValue="orgFormData.countryCode"
          :options="countryList"
          :label="$t('BB0069')"
          keyOptionDisplay="name"
          keyOptionValue="countryCode"
          searchBox
          class="relative z-10 w-85"
          required
        )
        input-text(v-model:textValue="orgFormData.address" :label="$t('BB0078')" class="w-85" :placeholder="$t('BB0079')")
        input-calling-code(
          v-model:textValue="orgFormData.phone"
          v-model:countryCode="orgFormData.phoneCountryCode"
          class="relative z-9"
          width="340"
          :label="$t('BB0070')"
          :placeholder="$t('BB0071')"
        )
        input-calling-code(
          v-model:textValue="orgFormData.fax"
          v-model:countryCode="orgFormData.faxCountryCode"
          class="relative z-8"
          width="340"
          :label="$t('BB0080')"
          :placeholder="$t('BB0081')"
        )
      btn(size="md" class="justify-self-end" :disabled="!availableToUpdateOrg" @click="updateOrg") {{$t('UU0018')}}
</template>

<script>
import { computed, reactive, toRaw, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import InputCallingCode from '@/components/InputCallingCode'
import InputLabelColor from '@/components/InputLabelColor'
import copyText from '@/utils/copy-text'

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
    const availableToUpdateOrg = computed(() => orgFormData.orgName !== '' && !isOrgNameExist.value)
    const checkOrgNameExist = async () => {
      isOrgNameExist.value = await store.dispatch('organization/checkOrgNameExist', { orgName: orgFormData.orgName, orgId: organization.value.orgId })
    }

    const openModalUploadLogo = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-upload-logo',
        header: t('BB0032'),
        properties: {
          // pure logo no preprocessing
          image: organization.value.logo,
          removeHandler: async () => {
            await store.dispatch('organization/removeOrgLogo')
          },
          afterUploadHandler: (imageObj, cropRectSize) => {
            store.dispatch('helper/replaceModal', {
              component: 'modal-crop-image',
              header: t('BB0032'),
              properties: {
                image: imageObj,
                cropRectSize,
                afterCropHandler: async (cropImage, originalImage) => {
                  const formData = new FormData()
                  formData.append('orgId', store.getters['organization/orgId'])
                  formData.append('logo', cropImage)
                  formData.append('originalLogo', originalImage)
                  await store.dispatch('organization/updateOrgLogo', formData)
                }
              }
            })
          }
        }
      })
    }

    const openModalDelete = () => {
      store.dispatch('helper/openModal', {
        component: 'modal-delete-org-or-group'
      })
    }

    const updateOrg = async () => {
      try {
        if (orgFormData.orgName !== organization.value.orgName) {
          await checkOrgNameExist()
          if (isOrgNameExist.value) { return }
        }

        await store.dispatch('organization/updateOrg', toRaw(orgFormData))

        store.commit('helper/PUSH_message', t('BB0107'))
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
      openModalUploadLogo,
      openModalDelete,
      isOrgNameExist,
      availableToUpdateOrg,
      organization,
      logo,
      copyText
    }
  }
}
</script>

<template lang="pug">
div(class="pt-16 xl:pt-17.5")
  div(class="flex justify-center")
    div(class="w-40 mr-11 xl:mr-15")
      div(class="flex flex-col items-center")
        div(class="relative")
          img(:src="logo" class="w-40 h-40 rounded-full bg-black-500")
          div(class="absolute flex justify-center items-center right-2 bottom-2 w-8 h-8 rounded-full bg-black-0 border-4 border-black-200 cursor-pointer"
            @click="openModalUploadLogo"
          )
            svg-icon(iconName="camera" size="20" class="text-black-500 hover:text-brand")
        div(class="flex items-center pt-4 cursor-pointer" @click="copyText(organization.orgNo), $store.commit('helper/PUSH_message', $t('BB0038'))")
          p(class="text-caption text-primary") ID: {{ organization.orgNo }}
          tooltip(placement="bottom")
            template(#trigger)
              svg-icon(iconName="content_copy" size="14" class="text-black-700")
            template(#content)
              p(class="text-caption text-primary px-3 py-1") {{ $t("BB0056") }}
        p(v-permission="FUNC_ID.DELETE_ORG" v-if="!planType.ENT" class="pt-2.5 text-caption text-black-500 cursor-pointer" @click="openModalTypeTextToConfirm") {{ $t("UU0013") }}
    div(class="grid gap-y-8.5 relative")
      p(class="absolute text-caption text-black-500 right-0 -top-7 transform -translate-y-full") *{{ $t("RR0163") }}
      div(class="grid grid-cols-2 grid-rows-3 gap-y-7.5 gap-x-8 xl:gap-x-15")
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
      btn(size="md" class="justify-self-end" :disabled="!availableToUpdateOrg" @click="updateOrg") {{ $t("UU0018") }}
</template>

<script>
import { computed, reactive, toRaw, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import InputLabelColor from '@/components/management/InputLabelColor.vue'
import copyText from '@/utils/copy-text'
import { useRouter } from 'vue-router'
import usePlan from '@/composables/usePlan.js'
import { FUNC_ID } from '@/utils/constants.js'

export default {
  name: 'OrgAbout',
  components: {
    InputLabelColor
  },
  setup() {
    const store = useStore()
    const { t } = useI18n()
    const router = useRouter()
    const { openModalPaymentFail } = usePlan()

    const organization = computed(() => store.getters['organization/organization'])
    const planType = computed(() => store.getters['polling/planType'])
    const logo = computed(() => store.getters['organization/orgLogo'])
    const { orgName, labelColor, orgCategoryId, address, countryCode, fax, faxCountryCode, phone, phoneCountryCode } = organization.value
    const countryList = computed(() => store.getters['code/countryList'])
    const orgCategoryList = computed(() => store.getters['code/orgCategoryList'])
    const orgFormData = reactive({ orgName, labelColor, orgCategoryId, address, countryCode, fax, faxCountryCode, phone, phoneCountryCode })
    const isOrgNameExist = ref(false)
    const availableToUpdateOrg = computed(() => orgFormData.orgName !== '' && !isOrgNameExist.value)

    const openModalUploadLogo = () => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-upload-logo'
      })
    }

    const openModalTypeTextToConfirm = () => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-type-text-to-confirm',
        properties: {
          title: t('BB0028'),
          keypath: 'BB0064',
          slotName: 'orgName',
          slotValue: organization.value.orgName,
          errorMsg: t('WW0015'),
          confirmHandler: () => {
            store.dispatch('helper/openModalConfirm', {
              type: 1,
              header: t('BB0029'),
              content: t('BB0030'),
              primaryBtnText: t('UU0001'),
              afterPrimaryBtnHandler: async () => {
                const deleteOrg = async () => {
                  store.dispatch('helper/openModalLoading')
                  const { success } = await store.dispatch('organization/deleteOrg')
                  store.dispatch('helper/closeModalLoading')

                  if (success) {
                    await router.replace('/')
                  } else {
                    openModalPaymentFail()
                  }

                  return success
                }

                const {
                  result: { totalPrice, checkoutItemList }
                } = await store.dispatch('organization/getUnbilledInfo')

                if (checkoutItemList.length === 0) {
                  ;(await deleteOrg()) && store.commit('helper/PUSH_message', t('OO0101'))
                  return
                }

                store.dispatch('helper/openModal', {
                  component: 'modal-checkout-list',
                  properties: {
                    checkoutItemList,
                    totalPrice,
                    payHandler: async () => {
                      ;(await deleteOrg()) &&
                        store.dispatch('helper/openModal', {
                          component: 'modal-payment-success',
                          properties: {
                            title: t('OO0039'),
                            content: t('OO0101')
                          }
                        })
                    }
                  }
                })
              },
              secondaryBtnText: t('UU0002')
            })
          }
        }
      })
    }

    const updateOrg = async () => {
      if (orgFormData.orgName !== organization.value.orgName) {
        isOrgNameExist.value = await store.dispatch('organization/checkOrgNameExist', { orgName: orgFormData.orgName, orgId: organization.value.orgId })
        if (isOrgNameExist.value) {
          return
        }
      }

      await store.dispatch('organization/updateOrg', toRaw(orgFormData))

      store.commit('helper/PUSH_message', t('BB0107'))
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
      openModalTypeTextToConfirm,
      isOrgNameExist,
      availableToUpdateOrg,
      organization,
      logo,
      planType,
      copyText,
      FUNC_ID
    }
  }
}
</script>

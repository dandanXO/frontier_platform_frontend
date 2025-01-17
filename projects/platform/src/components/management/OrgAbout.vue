<template lang="pug">
div(class="pt-16 md:pt-17.5")
  div(class="flex justify-center")
    div(class="w-40 mr-11 md:mr-15")
      div(class="flex flex-col items-center")
        div(class="relative")
          f-avatar(:imageUrl="logo" size="4xl" type="org")
          div(
            class="group absolute right-2 bottom-2 w-7.5 h-7.5 flex justify-center items-center rounded-full bg-grey-0 cursor-pointer"
            @click="openModalUploadLogo"
          )
            div(
              class="flex justify-center items-center w-6.5 h-6.5 rounded-full bg-grey-0 shadow-2"
              v-permission="{ FUNC_ID: FUNC_ID.MANAGEMENT_ORG_EDIT, behavior: 'displayNone' }"
            )
              f-svg-icon(
                iconName="camera"
                size="20"
                class="text-grey-250 group-hover:text-primary-400"
              )
        div(class="flex items-center mt-4" @click="copyOrgId")
          p(class="text-caption text-grey-900 pr-1.5 cursor-pointer") ID: {{ organization.orgNo }}
          f-svg-icon(
            iconName="content_copy"
            size="14"
            class="text-grey-600 cursor-pointer"
            :tooltipMessage="$t('BB0056')"
          )
        p(
          v-permission="{ FUNC_ID: FUNC_ID.MANAGEMENT_GROUP_DELETE, behavior: 'deleteElement' }"
          v-if="!planType.ENT"
          class="pt-2.5 text-caption text-grey-250 cursor-pointer"
          @click="openModalTypeTextToConfirm"
          data-cy="org-about_delete"
        ) {{ $t('UU0013') }}
    div(class="grid gap-y-8.5 relative")
      p(
        class="absolute text-caption text-grey-250 right-0 -top-7 transform -translate-y-full"
      ) *{{ $t('RR0163') }}
      div(class="grid grid-cols-2 grid-rows-3 gap-y-7.5 gap-x-8 md:gap-x-15")
        div(class="flex gap-x-2 items-end")
          f-input-text(
            v-model:textValue="orgFormData.orgName"
            :label="$t('BB0068')"
            :hintError="isOrgNameExist ? $t('WW0001') : ''"
            required
            class="w-66"
            data-cy="org-about_name"
            :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
          )
          input-label-color(
            v-model:labelColor="orgFormData.labelColor"
            :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
          )
        f-input-radio-group(
          v-model:inputValue="orgFormData.orgCategoryId"
          :label="$t('BB0072')"
          :optionList="orgCategoryList"
          keyOptionValue="orgCategoryId"
          required
          data-cy="org-about_category"
          :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
        )
        f-select-dropdown(
          v-model:selectValue="orgFormData.countryCode"
          :dropdownMenuTree="countryMenuTree"
          :label="$t('BB0069')"
          class="w-85"
          required
          data-cy="org-about_country"
          :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
        )
        f-input-text(
          v-model:textValue="orgFormData.address"
          :label="$t('BB0078')"
          :hintError="isAddressMoreThan160Characters ? $t('WW0142', { limitNumber: 160 }) : ''"
          class="w-85"
          :placeholder="$t('BB0079')"
          :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
        )
        input-calling-code(
          v-model:textValue="orgFormData.phone"
          v-model:countryCode="orgFormData.phoneCountryCode"
          class="w-85"
          :label="$t('BB0070')"
          :placeholder="$t('BB0071')"
          :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
        )
        input-calling-code(
          v-model:textValue="orgFormData.fax"
          v-model:countryCode="orgFormData.faxCountryCode"
          class="w-85"
          :label="$t('BB0080')"
          :placeholder="$t('BB0081')"
          :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
        )
      f-button(
        v-permission="{ FUNC_ID: FUNC_ID.MANAGEMENT_ORG_EDIT, behavior: 'deleteElement' }"
        size="md"
        class="justify-self-end"
        :disabled="!availableToUpdateOrg"
        @click="updateOrg"
        data-cy="org-about_save"
      ) {{ $t('UU0018') }}
</template>

<script setup>
import { computed, reactive, toRaw, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import InputLabelColor from '@/components/management/InputLabelColor.vue'
import { copyText } from '@frontier/lib'
import { useRouter } from 'vue-router'
import usePlanOld from '@/composables/usePlanOld.js'
import { FUNC_ID, NOTIFY_TYPE, PERMISSION_MAP } from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'
import { disable } from 'mixpanel-browser'

const store = useStore()
const notify = useNotifyStore()
const { t } = useI18n()
const router = useRouter()
const { openModalPaymentFail } = usePlanOld()

const organization = computed(() => store.getters['organization/organization'])
const planType = computed(() => store.getters['polling/planType'])
const logo = computed(() => store.getters['organization/orgLogo'])
const {
  orgName,
  labelColor,
  orgCategoryId,
  address,
  countryCode,
  fax,
  faxCountryCode,
  phone,
  phoneCountryCode,
} = organization.value
const countryMenuTree = computed(() => store.getters['code/countryMenuTree'])
const orgCategoryList = computed(() => store.getters['code/orgCategoryList'])
const orgFormData = reactive({
  orgName,
  labelColor,
  orgCategoryId,
  address,
  countryCode,
  fax,
  faxCountryCode,
  phone,
  phoneCountryCode,
})
const isOrgNameExist = ref(false)
const availableToUpdateOrg = computed(
  () =>
    !!orgFormData.orgName &&
    !isOrgNameExist.value &&
    !isAddressMoreThan160Characters.value
)
const isAddressMoreThan160Characters = computed(
  () => !!orgFormData.address && orgFormData.address.length > 160
)
const roleId = store.getters['organization/orgUser/orgUser'].roleID
const permissionList = ref(PERMISSION_MAP[roleId])
const openModalUploadLogo = () => {
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-upload-thumbnail',
    properties: {
      header: t('BB0032'),
      thumbnail: logo.value,
      defaultImage: 'logo-default.png', // This file name is static
      updateHandler: async (croppedImage, originalImage) => {
        await store.dispatch('organization/updateOrgLogo', {
          logo: croppedImage,
          originalLogo: originalImage,
        })
      },
      removeHandler: async () => {
        await store.dispatch('organization/removeOrgLogo')
      },
    },
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
      confirmHandler: () => {
        store.dispatch('helper/openModalConfirm', {
          type: NOTIFY_TYPE.WARNING,
          header: t('BB0029'),
          contentText: t('BB0030'),
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
              result: { totalPrice, checkoutItemList },
            } = await store.dispatch('organization/getUnbilledInfo')

            if (checkoutItemList.length === 0) {
              ;(await deleteOrg()) &&
                notify.showNotifySnackbar({ messageText: t('OO0101') })
              return
            }

            store.dispatch('helper/openModalBehavior', {
              component: 'modal-checkout-list',
              properties: {
                checkoutItemList,
                totalPrice,
                payHandler: async () => {
                  ;(await deleteOrg()) &&
                    store.dispatch('helper/openModalConfirm', {
                      type: NOTIFY_TYPE.SUCCESS,
                      header: t('OO0039'),
                      contentText: t('OO0101'),
                      primaryBtnText: t('UU0031'),
                    })
                },
              },
            })
          },
          secondaryBtnText: t('UU0002'),
        })
      },
    },
  })
}

const updateOrg = async () => {
  if (orgFormData.orgName !== organization.value.orgName) {
    isOrgNameExist.value = await store.dispatch(
      'organization/checkOrgNameExist',
      { orgName: orgFormData.orgName, orgId: organization.value.orgId }
    )
    if (isOrgNameExist.value) {
      return
    }
  }

  await store.dispatch('organization/updateOrg', toRaw(orgFormData))

  notify.showNotifySnackbar({ messageText: t('BB0107') })
}

watch(
  () => orgFormData.orgName,
  () => {
    if (isOrgNameExist.value) {
      isOrgNameExist.value = false
    }
  }
)

watch(
  () => orgFormData.countryCode,
  () => {
    orgFormData.faxCountryCode = orgFormData.countryCode
    orgFormData.phoneCountryCode = orgFormData.countryCode
  },
  {
    immediate: true,
  }
)

const copyOrgId = () => {
  copyText(organization.value.orgNo)
  notify.showNotifySnackbar({ messageText: t('BB0038') })
}
</script>

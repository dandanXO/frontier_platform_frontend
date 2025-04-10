<template lang="pug">
div(class="px-54 py-16 h-full flex flex-col gap-8")
  div(class="flex gap-2.5")
    f-svg-icon(iconName="person_setting" size="32")
    p(class="text-2xl h-10 font-bold text-black") {{ $t('MA0001') }}
  div(class="border border-grey-200-v1 rounded-lg")
    div(class="border-b border-grey-200-v1 p-6 space-y-3")
      p(class="text-xl font-bold text-black") {{ $t('MA0002') }}
      p(class="text-sm text-grey-700-v1") {{ $t('MA0003') }}
    table(class="w-full")
      tbody
        tr
          td(class="border-b border-grey-200-v1 w-48 pl-6 py-5")
            p(class="text-sm text-secondary") {{ $t('MM0002') }}
          td(class="border-b border-grey-200-v1 pl-4 pr-6 py-5")
            div(
              class="flex gap-2 justify-between items-center border p-3 rounded-[4px] border-grey-400 focus-within:shadow-[0px_0px_0px_2px_rgba(138,221,244,1.00)]"
            )
              input(
                class="w-full outline-none text-sm leading-6"
                type="text"
                v-model="displayName"
              )
              f-button(
                @click="updateDisplayName"
                :disabled="!displayName"
                class="min-w-24 px-3 py-1 font-bold bg-green-500-v1 hover:bg-green-600-v1 text-sm leading-6"
              ) {{ $t('UU0018') }}
        tr
          td(class="w-48 pl-6 py-5 align-top")
            p(class="text-sm text-secondary") {{ $t('MA0004') }}
          td(class="pl-4 pr-6 py-5 align-top flex")
            div(class="relative")
              f-avatar(:imageUrl="avatar" size="2xl" type="user")
              div(
                class="absolute right-0 bottom-0 flex justify-center items-center w-6 h-6 bg-green-500-v1 rounded-[4px] cursor-pointer hover:opacity-80 transition-all"
                @click="openModalChangeAvatar"
              )
                f-svg-icon(iconName="photo_camera" size="14" class="text-white")

  div(class="border border-grey-200-v1 rounded-lg")
    div(class="border-b border-grey-200-v1 p-6 space-y-3")
      p(class="text-xl font-bold text-black") {{ $t('MA0005') }}
      p(class="text-sm text-grey-700-v1") {{ $t('MA0006') }}

    div(class="overflow-x-auto")
      table(class="w-full table-fixed")
        tbody
          tr
            td(
              class="border-b border-grey-200-v1 w-48 pl-6 py-5 align-top"
              :class="[isShowChangePassword ? 'bg-grey-50' : '']"
            )
              p(class="text-sm text-secondary") {{ $t('MM0025') }}
            td(
              class="border-b border-grey-200-v1 pl-4 pr-6 py-5 align-top"
              :class="[isShowChangePassword ? 'bg-grey-50' : '']"
            )
              div(
                v-if="!isShowChangePassword"
                class="flex gap-2 justify-between items-center"
              )
                div(class="flex gap-2 items-center")
                  p(class="text-grey-900-v1") ＊＊＊＊＊＊＊＊＊＊＊
                  //- span(class="text-xs text-cyan-500-v1 bg-cyan-50-v1 p-1") {{ $t('WW0189', { Date: dayjs.unix(mockPasswordLastChangedDate).format('MMM DD, YYYY') }) }}
                f-svg-icon(
                  iconName="chevron_down"
                  size="24"
                  @click="toggleChangePassword"
                  class="cursor-pointer"
                )
              div(v-else class="flex flex-col gap-4")
                div(class="flex gap-2 justify-between items-center")
                  div
                    //- span(class="text-xs text-cyan-500-v1 bg-cyan-50-v1 p-1") {{ $t('WW0189', { Date: dayjs.unix(mockPasswordLastChangedDate).format('MMM DD, YYYY') }) }}
                  f-svg-icon(
                    iconName="chevron_up"
                    size="24"
                    @click="toggleChangePassword"
                    class="cursor-pointer texr-grey-900-v1"
                  )
                div(class="flex flex-col gap-4")
                  div(class="flex flex-col gap-2")
                    label(class="font-bold text-sm") {{ $t('MM0026') }}
                    f-input-password(
                      v-model:textValue="currentPassword"
                      :class="isPasswordCorrect ? '' : 'mb-5'"
                      prependIcon=""
                      :hintError="isPasswordCorrect ? '' : $t('WW0074')"
                      @blur="verifyPassword"
                      version="v2"
                    )
                  div(class="flex flex-col gap-2")
                    label(class="font-bold text-sm") {{ $t('MM0027') }}
                    f-input-password(
                      v-model:textValue="newPassword"
                      prependIcon=""
                      version="v2"
                    )
                PasswordValidator(
                  v-model:isValid="isPasswordValid"
                  :password="newPassword"
                  class="pt-1"
                  version="v2"
                )
                f-button(
                  :disabled="!availableToChangePassword"
                  @Click="changePassword"
                  class="py-1.5 flex justify-center items-center !font-bold bg-green-500-v1 hover:bg-green-600-v1 text-sm disabled:bg-grey-400-v1"
                ) {{ $t('MM0025') }}
          tr
            td(class="border-b border-grey-200-v1 w-48 pl-6 py-5 align-top")
              p(class="text-sm text-secondary") {{ $t('BB0014') }}
            td(class="border-b border-grey-200-v1 pl-4 pr-6 py-5 align-top")
              div(class="flex flex-col gap-2")
                p(class="text-grey-900-v1") {{ user?.email }}
                div(
                  class="text-cyan-500-v1 bg-cyan-50-v1 p-3 flex gap-3 items-center rounded-lg"
                ) 
                  f-svg-icon(iconName="info" size="16")
                  p(class="text-sm") {{ $t('WW0187') }}
          tr
            td(class="w-48 pl-6 py-5 align-top")
              div(class="flex gap-1 items-center")
                div(class="text-sm text-secondary h-6") {{ $t('MA0007') }}
                f-tooltip(
                  :desc="$t('WW0201')"
                  :placement="TOOLTIP_PLACEMENT?.TOP"
                  :offset="[0, 8]"
                  classContent="w-[328px]"
                  class="self-center"
                  interactive
                  isDescHTML
                  theme="new-dark"
                )
                  template(#slot:tooltip-trigger)
                    f-svg-icon(iconName="help" size="16")
            td(class="flex items-start justify-between pl-4 pr-6 py-5 align-top")
              template(v-if="!isVerifying")
                div(class="flex-1 flex flex-col gap-3 w-full")
                  div(class="flex flex-row justify-between")
                    p(class="text-grey-900-v1" v-if="is2FaEnabledLocal") {{ $t('MA0017') }}
                    p(class="text-grey-900-v1" v-else) {{ $t('MA0008') }}
                    f-input-toggle(
                      :value="is2FaEnabledLocal"
                      @update:value="toggle2FA"
                      primaryColor="bg-[#065f46]"
                    )
                  template(v-if="isShowOTPInput")
                    div(
                      v-if="otpBlockedUI.isBlocked && otpBlockedUI.blockReason === OneTimePasswordStatusBlockReasonEnum.MAX_INPUT_ATTEMPT"
                      class="text-red-500-v1 bg-red-50-v1 p-3 flex flex-col gap-1 rounded-lg"
                    ) 
                      div(class="flex gap-3 items-center")
                        f-svg-icon(iconName="cancel_outline" size="24")
                        p(class="text-base font-bold") {{ $t('WW0200') }}
                      div(class="flex gap-3 items-center")
                        div(class="w-6")
                        p(class="text-sm text-grey-900-v1") {{ $t('WW0204') }}
                    div(
                      v-if="otpBlockedUI.isBlocked && otpBlockedUI.blockReason === OneTimePasswordStatusBlockReasonEnum.MAX_RESEND_ATTEMPT"
                      class="text-red-500-v1 bg-red-50-v1 p-3 flex flex-col gap-1 rounded-lg"
                    ) 
                      div(class="flex gap-3 items-center")
                        f-svg-icon(iconName="cancel_outline" size="24")
                        p(class="text-base font-bold") {{ $t('WW0208') }}
                      div(class="flex gap-3 items-center")
                        div(class="w-6")
                        p(class="text-sm text-grey-900-v1") {{ $t('WW0206') }}
                    template(
                      v-if="otpBlockedUI.blockReason !== OneTimePasswordStatusBlockReasonEnum.MAX_INPUT_ATTEMPT && otpBlockedUI.blockReason !== OneTimePasswordStatusBlockReasonEnum.MAX_RESEND_ATTEMPT"
                    )
                      div(
                        v-if="otpBlockedUI.blockReason !== OneTimePasswordStatusBlockReasonEnum.OTP_EXPIRED"
                        class="text-cyan-500-v1 bg-cyan-50-v1 p-3 flex flex-col gap-1 rounded-lg"
                      ) 
                        div(class="flex gap-3 items-center")
                          div(class="w-6 h-6 flex items-center justify-center")
                            f-svg-icon(iconName="info" size="22")
                          p(class="text-base font-bold") {{ $t('VC0003') }}
                        div(class="flex gap-3 items-center")
                          div(class="w-6")
                          p(class="text-sm text-grey-900") {{ $t('VC0002', { email: user?.email }) }}
                      div(
                        v-if="otpBlockedUI.isBlocked && otpBlockedUI.blockReason === OneTimePasswordStatusBlockReasonEnum.OTP_EXPIRED"
                        class="text-red-500-v1 bg-red-50-v1 p-3 flex flex-col gap-1 rounded-lg"
                      ) 
                        div(class="flex gap-3 items-center")
                          f-svg-icon(iconName="cancel_outline" size="22")
                          p(class="text-base font-bold") {{ $t('WW0196') }}
                        div(class="flex gap-3 items-center")
                          div(class="w-6")
                          p(class="text-sm text-grey-900-v1") {{ $t('WW0205') }}
                      div(
                        Class="w-full flex flex-col justify-center items-center gap-2"
                      )
                        InputOTP(
                          v-model:otpInputs="otpInputs"
                          v-model:isOtpValid="isOtpValid"
                          v-model:otpCode="otpCode"
                          :disabled="otpBlockedUI.isBlocked && otpBlockedUI.blockReason === OneTimePasswordStatusBlockReasonEnum.OTP_EXPIRED"
                          class="max-w-[18.75rem]"
                        )
                        p(v-if="counts.attempt" class="text-xs text-red-500-v1") {{ $t('WW0199', { otpAttempt: counts.attempt, otpAttemptLeft: maxCounts.attempt - counts.attempt }) }}
                        p(v-if="counts.resend" class="text-xs text-green-500-v1") {{ $t('WW0197', { attempt: counts.resend, attemptRemain: maxCounts.resend - counts.resend }) }}
                      f-button(
                        :disabled="disableResend"
                        class="py-1.5 flex justify-center items-center !font-bold bg-green-500-v1 hover:bg-green-600-v1 text-sm disabled:bg-grey-400-v1"
                        @click="onResend"
                      ) {{ $t('UU0051') }} ({{ countdown }})
              div(
                v-else
                class="w-full bg-green-50-v1 flex gap-4 items-center justify-center p-8 rounded-lg"
              )
                f-svg-icon(
                  iconName="loading"
                  size="38"
                  class="text-primary-500"
                  :style="{ minHeight: '28px' }"
                )
                p(class="text-sm") {{ $t('WW0192') }}
  Modal2FA(
    :isShowModal="isShowTurnOnModal"
    :closeModal="closeModal"
    :primaryButtonText="$t('UU0183')"
    :secondaryButtonText="$t('UU0185')"
    :onClickPrimary="handleTurnOn2FA"
    :onClickSecondary="closeModal"
    :title="$t('MA0015')"
    :description="$t('MA0016')"
    icon="verification_mail"
    type="success"
  )
  Modal2FA(
    :isShowModal="isShowTurnOffModal"
    :closeModal="closeModal"
    :primaryButtonText="$t('UU0188')"
    :secondaryButtonText="$t('UU0187')"
    :onClickPrimary="handleTurnOff2FA"
    :onClickSecondary="closeModal"
    :title="$t('MA0018')"
    :description="$t('MA0019')"
    type="danger"
  )
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'

import InputOTP from '@/components/common/InputOTP.vue'
import PasswordValidator from '@/components/account/PasswordValidator.vue'
import Modal2FA from './Modal2FA.vue'

import { TOOLTIP_PLACEMENT, VERSION } from '@frontier/constants'
import { useNotifyStore } from '@/stores/notify'
import { logout, redirectAfterLogout } from '@/utils/auth'
import { OneTimePasswordStatusBlockReasonEnum } from '@frontier/platform-web-sdk'

type Timeout = ReturnType<typeof setTimeout>

const store = useStore()
const notify = useNotifyStore()
const { t } = useI18n()

const user = computed(() => store.getters['user/user'])
const orgUser = computed(() => store.getters['organization/orgUser/orgUser'])
const avatar = computed(() => store.getters['organization/orgUser/avatar'])

const displayName = ref(orgUser.value.displayName)

const isShowChangePassword = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const isPasswordValid = ref(false)
const isPasswordCorrect = ref(true)

const isShowTurnOnModal = ref(false)
const isShowTurnOffModal = ref(false)
const otpInputs = ref(Array(6).fill(''))
const isOtpValid = ref(false)
const otpCode = ref('')
const countdownInterval = ref<Timeout>()
const countdown = ref('0:00')
const disableResend = ref(true)

const counts = ref({
  attempt: 0,
  resend: 0,
})

const maxCounts = ref<{ attempt: number; resend: number }>({
  attempt: 5,
  resend: 5,
})

const isVerifying = ref(false)
const isShowOTPInput = ref(false)

const mockPasswordLastChangedDate = 1733048100
const resendTime = ref(Date.now() + 60000)
const is2FaEnabledLocal = ref(false)
const availableToChangePassword = computed(
  () =>
    !!newPassword.value &&
    !!currentPassword.value &&
    isPasswordValid.value &&
    isPasswordCorrect.value
)

const fetchMemberList = async () => {
  const routeLocation = store.getters['helper/routeLocation']

  if (routeLocation === 'org') {
    const orgNo = store.getters['organization/orgNo']
    await store.dispatch('organization/getOrg', { orgNo })
  } else {
    const groupId = store.getters['group/groupId']
    await store.dispatch('group/getGroup', { groupId })
  }
}

const updateDisplayName = async () => {
  store.dispatch('helper/openModalLoading')
  await store.dispatch('organization/orgUser/updateDisplayName', {
    displayName: displayName.value,
  })
  store.dispatch('helper/clearModalPipeline')
  notify.showNotifySnackbar({
    messageText: t('WW0190'),
    version: VERSION.V2,
    hasCloseButton: false,
    delay: 5000,
  })
}

const openModalChangeAvatar = () => {
  const avatar = computed(
    () => store.getters['organization/orgUser/orgUser'].avatar
  )
  store.dispatch('helper/pushModalBehavior', {
    component: 'modal-profile-picture',
    properties: {
      header: t('MM0019'),
      thumbnail: avatar.value,
      defaultImage: 'default_user.png',
      version: VERSION.V2,
      updateHandler: async (croppedImage, originalImage) => {
        await store.dispatch('organization/orgUser/updateAvatar', {
          avatar: croppedImage,
          originalAvatar: originalImage,
        })
        await fetchMemberList()
        notify.showNotifySnackbar({
          messageText: t('WW0194'),
          version: VERSION.V2,
          hasCloseButton: false,
          delay: 5000,
        })
      },
      removeHandler: async () => {
        await store.dispatch('organization/orgUser/removeAvatar')
        await fetchMemberList()
        notify.showNotifySnackbar({
          messageText: t('WW0194'),
          version: VERSION.V2,
          hasCloseButton: false,
          delay: 5000,
        })
      },
    },
  })
}

const toggleChangePassword = () => {
  isShowChangePassword.value = !isShowChangePassword.value
}

const verifyPassword = async () => {
  if (currentPassword.value?.length === 0) {
    return
  }

  const isVerify = await store.dispatch('user/verifyPassword', {
    password: currentPassword.value,
  })
  isPasswordCorrect.value = isVerify
}

const changePassword = async () => {
  await store.dispatch('user/changePassword', {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  })
  isShowChangePassword.value = false
  currentPassword.value = ''
  newPassword.value = ''
  notify.showNotifySnackbar({
    messageText: "t-Password changed successfully! You'll be logged out now...",
    version: VERSION.V2,
    hasCloseButton: false,
    delay: 5000,
  })
  logout()
  setTimeout(() => {
    redirectAfterLogout()
  }, 5000)
}

const startResendCountdown = () => {
  countdownInterval.value = setInterval(() => {
    const now = Date.now()
    const distance = resendTime.value - now > 0 ? resendTime.value - now : 0
    countdown.value = dayjs.unix(Math.floor(distance / 1000)).format('m:ss')
    if (distance <= 0) {
      clearInterval(countdownInterval.value)
      disableResend.value = false
    }
  }, 1000)
}

const removeCountdown = () => {
  clearInterval(countdownInterval.value)
  disableResend.value = false
  countdown.value = '0:00'
}

const otpBlockedUI = ref<{
  isBlocked: boolean
  blockReason: OneTimePasswordStatusBlockReasonEnum | null
}>({
  isBlocked: false,
  blockReason: null,
})

const updateOtpStatus = (otpStatus: any) => {
  counts.value.attempt = otpStatus.currentAttemptCount
  counts.value.resend = otpStatus.currentResendCount
  maxCounts.value.attempt = otpStatus.maxAttemptCount
  maxCounts.value.resend = otpStatus.maxResendCount

  otpBlockedUI.value = {
    isBlocked: otpStatus.isBlocked,
    blockReason: otpStatus.blockReason,
  }
}

const getResendTime = () => {
  const resendTime = parseInt(localStorage.getItem('r_tm') || '0')
  return resendTime
    ? resendTime > Date.now()
      ? resendTime
      : Date.now()
    : Date.now() + 60000
}

const updateResendTime = (endTime: number) => {
  localStorage.setItem('r_tm', endTime.toString())
  resendTime.value = endTime
}

const onResend = async () => {
  const data = await store.dispatch('user/resendOTP')
  updateResendTime(Date.now() + 60000)
  updateOtpStatus(data.otpStatus)
  disableResend.value = true
  startResendCountdown()
}

const toggle2FA = () => {
  if (is2FaEnabledLocal.value) {
    isShowTurnOffModal.value = true
  } else {
    isShowTurnOnModal.value = true
  }
}

const closeModal = () => {
  isShowTurnOnModal.value = false
  isShowTurnOffModal.value = false
}

const handleTurnOn2FA = async () => {
  const data = await store.dispatch('user/enableOTP', {
    otp: null,
  })

  updateOtpStatus(data.otpStatus)
  is2FaEnabledLocal.value = true
  isShowOTPInput.value = data.otpStatus.mustPass2Fa
  closeModal()
  if (!data.otpStatus.mustPass2Fa) {
    store.dispatch('helper/pushModalAuthentication')
  } else {
    updateResendTime(Date.now() + 60000)
    startResendCountdown()
  }
}

const handleTurnOff2FA = async () => {
  await store.dispatch('user/disableOTP')
  is2FaEnabledLocal.value = false
  isShowOTPInput.value = false
  closeModal()
  notify.showNotifySnackbar({
    messageText: t('WW0203'),
    version: VERSION.V2,
    hasCloseButton: false,
    delay: 5000,
  })
}

const validateOtp = async () => {
  isVerifying.value = true
  const data = await store.dispatch('user/enableOTP', {
    otp: otpCode.value,
  })

  updateOtpStatus(data.otpStatus)
  isOtpValid.value = data.otpStatus.isValid
  otpInputs.value = Array(6).fill('')
  isVerifying.value = false
  otpCode.value = ''
  if (
    data.otpStatus.isBlocked &&
    data.otpStatus.blockReason ===
      OneTimePasswordStatusBlockReasonEnum.OTP_EXPIRED
  ) {
    removeCountdown()
  }

  if (!data.otpStatus.isBlocked && data.otpStatus.isValid) {
    store.dispatch('helper/pushModalAuthentication')
  }
}

watch(otpCode, (value) => {
  if (value.length === 6) {
    validateOtp()
  }
})

onMounted(() => {
  is2FaEnabledLocal.value = user.value.is2FaEnabled
  const _resendTime = getResendTime()
  resendTime.value = _resendTime

  localStorage.setItem('r_tm', _resendTime.toString())
  startResendCountdown()
})
</script>

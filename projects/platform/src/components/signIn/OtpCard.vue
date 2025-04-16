<template lang="pug">
div(class="w-105 flex flex-col")
  div(
    class="w-full rounded-lg shadow-4 p-8 flex flex-col gap-6 min-h-90 justify-center items-center"
  )
    div(v-if="isLoading" class="flex justify-center items-center flex-col")
      f-svg-icon(
        iconName="loading"
        size="140"
        class="text-green-600-v1"
        testId="loading-indicator"
      )
      p(class="text-sm -mt-4" v-if="isValidating") {{ $t('WW0192') }}
    template(v-else)
      div(class="flex flex-col gap-2 text-center")
        p(class="text-2xl font-bold") {{ $t('VC0001') }}
        div(class="text-sm" v-if="email && showButtonResend")
          p {{ $t('VC0002') }}
          p {{ email }}

      input-otp(
        v-if="!blockReasonType"
        v-model:otpInputs="otpInputs"
        v-model:isOtpValid="isOtpValid"
        v-model:otpCode="otpCode"
        class="w-full"
        :inlineText="blockReason"
        :inlineTextClass="!isOtpValid ? 'text-critical-solid' : undefined"
      )
      p(class="text-sm text-critical-solid text-center" v-else) {{ $t(otpMaxErrorMapKey[blockReasonType]) }}
      f-button(
        type="secondary"
        size="md"
        class="!font-bold"
        :class="countdown && showButtonResend ? 'max-w-[16.625rem] self-start' : ''"
        :disabled="showButtonResend && disabledResend"
        @click="showButtonResend ? onResend() : contactSupport()"
        :isFullWidth="!showButtonResend"
      ) {{ primaryBtnText }}
      p(class="text-xs text-brand-solid self-start" v-if="isResendNow") {{ $t('WW0197', { attempt: counts.resend, attemptRemain: maxCounts.resend - counts.resend }) }}
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  OneTimePasswordStatusBlockReasonEnum,
  type OneTimePasswordStatus,
  type SignInGooglePost200ResponseAllOfResult,
  type SignInResendOtpPostRequest,
  type SignInVerifyOtpPostRequest,
  type UserSetting2FaLoginEnable200ResponseAllOfResult,
} from '@frontier/platform-web-sdk'
import useNavigation from '@/composables/useNavigation'
import InputOtp from '../common/InputOTP.vue'

const DISABLED_BUTTON_RESET_ERRORS: OneTimePasswordStatusBlockReasonEnum[] = [
  OneTimePasswordStatusBlockReasonEnum.MAX_INPUT_ATTEMPT,
  OneTimePasswordStatusBlockReasonEnum.MAX_RESEND_ATTEMPT,
]

const props = defineProps<{
  email?: string
  isFormGoogle?: boolean
}>()

const store = useStore()
const { nextAfterSignIn } = useNavigation()
const { t } = useI18n()

const otpInputs = ref(Array(6).fill(''))
const otpCode = ref('')
const blockReasonType = ref<OneTimePasswordStatusBlockReasonEnum | null>()
const maxCounts = ref<{ attempt: number; resend: number }>({
  attempt: 5,
  resend: 5,
})
const countdown = ref(0)
const counts = ref({
  attempt: 0,
  resend: 0,
})
const isOtpValid = ref(true)
const isLoading = ref(false)
const isValidating = ref(false)
const isResendNow = ref(false)
const disabledResend = ref(true)

const otpMaxErrorMapKey = {
  [OneTimePasswordStatusBlockReasonEnum.MAX_INPUT_ATTEMPT]: 'WW0200',
  [OneTimePasswordStatusBlockReasonEnum.MAX_RESEND_ATTEMPT]: 'WW0198',
  [OneTimePasswordStatusBlockReasonEnum.OTP_EXPIRED]: 'WW0207',
}

const primaryBtnText = computed(() => {
  if (!showButtonResend.value) {
    return t('UU0184')
  }
  if (countdown.value) {
    return t('UU0180', {
      countdown: `0:${countdown.value.toString().padStart(2, '0')}`,
    })
  }

  return t('UU0051')
})

const blockReason = computed(() => {
  if (!blockReasonType.value && !isOtpValid.value) {
    return t('WW0199', {
      otpAttempt: counts.value.attempt,
      otpAttemptLeft: maxCounts.value.attempt - counts.value.attempt,
    })
  }

  return ''
})

const showButtonResend = computed(
  () =>
    !(
      blockReasonType.value &&
      DISABLED_BUTTON_RESET_ERRORS.includes(blockReasonType.value)
    )
)

let countdownInterval: NodeJS.Timer

const startCountdown = () => {
  let seconds = 60
  countdown.value = seconds
  clearInterval(countdownInterval)
  disabledResend.value = true

  countdownInterval = setInterval(() => {
    seconds--
    countdown.value = seconds
    if (seconds <= 0) {
      removeCountdown()
    }
  }, 1000)
}

const removeCountdown = () => {
  clearInterval(countdownInterval)
  blockReasonType.value = undefined
  disabledResend.value = false
  countdown.value = 0
}

const contactSupport = () => {
  if (!blockReasonType.value) {
    return console.error()
  }
  const email = 'support@frontier.cool'
  const subjectMap: Record<OneTimePasswordStatusBlockReasonEnum, string> = {
    [OneTimePasswordStatusBlockReasonEnum.MAX_RESEND_ATTEMPT]:
      'Assistance Needed: Verification Code Limit Exceeded',
    [OneTimePasswordStatusBlockReasonEnum.MAX_INPUT_ATTEMPT]:
      'Assistance Needed: Insert the Wrong Verification Code 5-times',
    [OneTimePasswordStatusBlockReasonEnum.OTP_EXPIRED]: '',
    [OneTimePasswordStatusBlockReasonEnum.VERIFIED_OR_NOT_FOUND]: '',
  }
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subjectMap[blockReasonType.value]
  )}`
  window.location.href = mailtoLink
}

const onResend = async () => {
  try {
    isLoading.value = true

    const data = (await store.dispatch('user/reSignInWithOTP', {
      email: props.email,
    } as SignInResendOtpPostRequest)) as
      | UserSetting2FaLoginEnable200ResponseAllOfResult
      | undefined

    if (data?.otpStatus) {
      updateOtpStatus(data.otpStatus)
      isResendNow.value = !data.otpStatus.isBlocked
    }
    isOtpValid.value = true

    startCountdown()
  } catch (error) {
    console.error('error when onResend OTP, the error is:', error)
  } finally {
    isLoading.value = false
  }
}

const updateOtpStatus = (otpStatus: OneTimePasswordStatus) => {
  counts.value.attempt = otpStatus.currentAttemptCount ?? counts.value.attempt
  counts.value.resend = otpStatus.currentResendCount ?? counts.value.resend
  maxCounts.value.attempt = otpStatus.maxAttemptCount ?? maxCounts.value.attempt
  maxCounts.value.resend = otpStatus.maxResendCount ?? maxCounts.value.resend
  blockReasonType.value = otpStatus.blockReason
}

const validateOtp = async () => {
  try {
    isResendNow.value = false
    isValidating.value = true
    isLoading.value = true
    const data = await (store.dispatch('user/signInWithOTP', {
      email: props.email,
      otp: otpCode.value,
      isFromGoogle: props.isFormGoogle,
    } as SignInVerifyOtpPostRequest) as
      | SignInGooglePost200ResponseAllOfResult
      | undefined)

    data?.otpStatus && updateOtpStatus(data?.otpStatus)
    isOtpValid.value = !!data?.otpStatus?.isValid
    otpInputs.value = Array(6).fill('')
    otpCode.value = ''

    data?.otpStatus?.isValid && data.user && (await nextAfterSignIn())
  } catch (error) {
    console.error('error when validateOtp, the error is:', error)
  } finally {
    isLoading.value = false
    isValidating.value = false
  }
}

watch(otpCode, (value) => {
  if (value.length === 6) {
    validateOtp()
  }
})

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  clearInterval(countdownInterval)
})
</script>

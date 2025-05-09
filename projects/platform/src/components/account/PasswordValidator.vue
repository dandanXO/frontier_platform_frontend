<template lang="pug">
div(v-if="version == 'v1'" class="grid pt-1.5 gap-y-1.5 text-caption leading-none")
  div(class="flex")
    p(
      :class="[moreThanSix && moreThanSix ? 'text-grey-600' : 'text-grey-250']"
    ) {{ $t('WW0143', { minNum: 12 }) }}
    f-svg-icon(
      v-if="moreThanSix && lessThanEighteen"
      iconName="tick_bold"
      size="12"
      class="ml-0.5 text-grey-600"
    )
  div(class="flex")
    p(:class="[containsLetter ? 'text-grey-600' : 'text-grey-250']") {{ $t('AA0020') }}
    f-svg-icon(
      v-if="containsLetter && containsSpecialChar && containsNumber"
      iconName="tick_bold"
      size="12"
      class="ml-0.5 text-grey-600"
    )
div(v-if="version == 'v2'")
  div(class="flex flex-col gap-1 items-start")
    div(class="flex flex-row gap-1 items-center")
      f-svg-icon(
        :iconName="containsLetter ? (moreThanSix && lessThanEighteen ? 'check_circle_outline' : 'cancel_outline') : 'check_circle_outline'"
        size="16"
        :class="containsLetter ? (moreThanSix && lessThanEighteen ? 'text-green-500-v1' : 'text-red-500-v1') : 'text-grey-600-v1'"
      )
      p(
        class="text-xs"
        :class="containsLetter ? (moreThanSix && lessThanEighteen ? 'text-green-500-v1' : 'text-red-500-v1') : 'text-grey-600-v1'"
      ) {{ $t('MM0028') }}
    div(class="flex flex-row gap-1 items-center")
      f-svg-icon(
        :iconName="containsLetter ? (containsLetter && containsSpecialChar && containsNumber ? 'check_circle_outline' : 'cancel_outline') : 'check_circle_outline'"
        size="16"
        :class="containsLetter ? (containsLetter && containsSpecialChar && containsNumber ? 'text-green-500-v1' : 'text-red-500-v1') : 'text-grey-600-v1'"
      )
      p(
        class="text-xs"
        :class="containsLetter ? (containsLetter && containsSpecialChar && containsNumber ? 'text-green-500-v1' : 'text-red-500-v1') : 'text-grey-600-v1'"
      ) {{ $t('AA0020') }}
    div(class="flex flex-row gap-1 items-center" v-if="checkOldAndNewPassword")
      f-svg-icon(
        :iconName="containsLetter ? (isSameAsOldPassword ? 'cancel_outline' : 'check_circle_outline') : 'check_circle_outline'"
        size="16"
        :class="containsLetter ? (isSameAsOldPassword ? 'text-red-500-v1' : 'text-green-500-v1') : 'text-grey-600-v1'"
      )
      p(
        class="text-xs"
        :class="containsLetter ? (isSameAsOldPassword ? 'text-red-500-v1' : 'text-green-500-v1') : 'text-grey-600-v1'"
      ) {{ $t('AA0097') }}
</template>

<script>
import { computed, watch } from 'vue'

export default {
  name: 'PasswordValidator',
  props: {
    password: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: false,
    },
    version: {
      type: String,
      default: 'v1',
    },
    oldPassword: {
      type: String,
      default: '',
    },
    checkOldAndNewPassword: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:isValid'],
  setup(props, { emit }) {
    const containsLetter = computed(
      () =>
        /[a-z]/.test(props.password) ||
        /[A-Z]/.test(props.password) ||
        /\S/.test(props.password)
    )
    const containsNumber = computed(() => /\d/.test(props.password))
    const containsSpecialChar = computed(() =>
      /[!@#$%^&*(),.?":{}|<>]/.test(props.password)
    )
    const moreThanSix = computed(() => props.password?.length >= 12)
    const lessThanEighteen = computed(() => {
      if (!props.password) {
        return false
      }
      return props.password.length <= 999
    })
    const isSameAsOldPassword = computed(() => {
      if (props.checkOldAndNewPassword) {
        return props.oldPassword === props.password
      }
      return true
    })
    watch(
      () => props.password,
      () => {
        emit(
          'update:isValid',
          containsLetter.value &&
            containsNumber.value &&
            containsSpecialChar.value &&
            moreThanSix.value &&
            lessThanEighteen.value
        )
      }
    )

    return {
      isSameAsOldPassword,
      containsLetter,
      containsNumber,
      containsSpecialChar,
      moreThanSix,
      lessThanEighteen,
    }
  },
}
</script>

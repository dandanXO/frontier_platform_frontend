<template lang="pug">
div(v-if="version == 'v1'" class="grid gap-y-1.5 text-caption leading-none")
  div(class="flex")
    p(
      :class="[moreThanSix && moreThanSix ? 'text-grey-600' : 'text-grey-250']"
    ) {{ $t('WW0143', { minNum: 6 }) }}
    f-svg-icon(
      v-if="moreThanSix && lessThanEighteen"
      iconName="tick_bold"
      size="12"
      class="ml-0.5 text-grey-600"
    )
  div(class="flex")
    p(:class="[containsLetter ? 'text-grey-600' : 'text-grey-250']") {{ $t('AA0020') }}
    f-svg-icon(
      v-if="containsLetter"
      iconName="tick_bold"
      size="12"
      class="ml-0.5 text-grey-600"
    )
div(v-if="version == 'v2'")
  div(class="flex gap-1 items-center")
    f-svg-icon(
      :iconName="containsLetter ? (moreThanSix && lessThanEighteen ? 'check_circle_outline' : 'cancel_outline') : 'check_circle_outline'"
      size="16"
      :class="containsLetter ? (moreThanSix && lessThanEighteen ? 'text-green-500-v1' : 'text-red-500-v1') : 'text-grey-600-v1'"
    )
    p(
      class="text-xs"
      :class="containsLetter ? (moreThanSix && lessThanEighteen ? 'text-green-500-v1' : 'text-red-500-v1') : 'text-grey-600-v1'"
    ) {{ $t('MM0028') }}
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
  },
  emits: ['update:isValid'],
  setup(props, { emit }) {
    const containsLetter = computed(() => /[a-zA-Z]/gi.test(props.password))
    const moreThanSix = computed(() => props.password?.length >= 6)
    const lessThanEighteen = computed(() => {
      if (!props.password) {
        return false
      }
      return props.password.length <= 18
    })

    watch(
      () => props.password,
      () => {
        emit(
          'update:isValid',
          containsLetter.value && moreThanSix.value && lessThanEighteen.value
        )
      }
    )

    return {
      containsLetter,
      moreThanSix,
      lessThanEighteen,
    }
  },
}
</script>

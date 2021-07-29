<template lang="pug">
div(class="grid gap-y-1.5 text-caption")
  div(class="flex")
    p(:class="[moreThanSix && moreThanSix ? 'text-black-800' : 'text-black-500']") {{$t('form.signUp.atLeast6Char')}}
    svg-icon(v-if="moreThanSix && lessThanEighteen" iconName="tick-bold" class="ml-0.5" :width="12" :height="12")
  div(class="flex")
    p(:class="[containsLetter ? 'text-black-800' : 'text-black-500']") {{$t('form.signUp.atLeast1Letter')}}
    svg-icon(v-if="containsLetter" iconName="tick-bold" color="black-800" class="ml-0.5" :width="12" :height="12")
</template>

<script>
import { computed, watch } from 'vue'

export default {
  name: 'PasswordValidator',
  props: {
    password: {
      type: String,
      required: true
    },
    isValid: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const containsLetter = computed(() => (/[a-zA-Z]/ig).test(props.password))
    const moreThanSix = computed(() => props.password.length >= 6)
    const lessThanEighteen = computed(() => props.password.length <= 18)

    watch(
      () => props.password,
      () => {
        emit('update:isValid', containsLetter.value && moreThanSix.value && lessThanEighteen.value)
      }
    )

    return {
      containsLetter,
      moreThanSix,
      lessThanEighteen
    }
  }
}
</script>

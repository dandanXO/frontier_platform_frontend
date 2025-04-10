<template lang="pug">
div(
  class="fixed inset-0 z-loading w-screen h-screen bg-grey-900/70 flex items-center pt-[50px] flex-col"
)
  div(class="p-3 rounded-lg flex gap-3 bg-green-50-v1 items-center")
    div(class="p-2 rounded-full bg-green-100-v1")
      f-svg-icon(iconName="check_circle_outline" size="24" class="text-green-500-v1")
    div(class="w-[345px] whitespace-pre-wrap text-xs text-grey-900-v1")
      p {{ $t('WW0202', { countdown: timer }) }}
    f-button(
      class="text-sm text-green-700-v1 underline"
      type="text"
      @click="handleSignIn"
    ) {{ $t('UU0186') }}
</template>

<script setup lang="ts">
import { logout, redirectAfterLogout } from '@/utils/auth'
import { THEME } from '@/utils/constants'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

withDefaults(
  defineProps<{
    theme?: `${THEME}`
  }>(),
  {
    theme: THEME.LIGHT,
  }
)

const timer = ref(15)
const timerInterval = ref(null)
const router = useRouter()

onMounted(() => {
  logout()
  timerInterval.value = setInterval(() => {
    timer.value--
    if (timer.value === 0) {
      clearInterval(timerInterval.value)
      redirectAfterLogout()
    }
  }, 1000)
})

const handleSignIn = () => {
  router.push('/logout')
}
</script>

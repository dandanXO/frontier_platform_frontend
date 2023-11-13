<template lang="pug">
div(:class="classSize.avatar" class="relative")
  div(
    class="bg-grey-0 rounded-full overflow-hidden box-content"
    :class="[classSize.avatar, { 'border border-grey-0': hasBorder }]"
  )
    img(class="w-full h-full" :src="!!imageUrl ? imageUrl : defaultImage")
  div(
    v-if="labelColor"
    class="absolute right-0 bottom-0 border border-grey-0 box-content rounded-sm"
    :class="classSize.labelColor"
    :style="{ backgroundColor: labelColor }"
  )
</template>

<script setup lang="ts">
import { computed } from 'vue'
import defaultUser from './default_user.png'
import defaultOrg from './default_org.png'

const props = withDefaults(
  defineProps<{
    type?: 'user' | 'org'
    imageUrl?: string | null
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
    labelColor?: string | null
    hasBorder?: boolean
  }>(),
  {
    type: 'user',
    size: 'xs',
  }
)

const defaultImage = props.type === 'user' ? defaultUser : defaultOrg

const classSize = computed(() => {
  let avatar,
    labelColor = ''
  switch (props.size) {
    case 'xs':
      avatar = 'w-5 h-5'
      labelColor = 'w-1 h-1'
      break
    case 'sm':
      avatar = 'w-6 h-6'
      labelColor = 'w-1.5 h-1.5'
      break
    case 'md':
      avatar = 'w-8 h-8'
      labelColor = 'w-2 h-2'
      break
    case 'lg':
      avatar = 'w-6 md:w-10 h-6 md:h-10'
      labelColor = 'w-2.5 h-2.5'
      break
    case 'xl':
      avatar = 'w-16 h-16'
      labelColor = 'w-4 h-4'
      break
    case '2xl':
      avatar = 'w-24 h-24'
      labelColor = 'w-4 h-4'
      break
    case '3xl':
      avatar = 'w-30 h-30'
      labelColor = 'w-6 h-6'
      break
    case '4xl':
      avatar = 'w-50 h-50'
      labelColor = 'w-8 h-8'
      break
  }

  return { avatar, labelColor }
})
</script>

<script lang="ts">
export default {
  name: 'FAvatar',
}
</script>

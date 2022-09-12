<template lang="pug">
div(class="flex transform -translate-x-1.5" :class="{ 'flex-row-reverse': direction === 'rtl' }")
  template(v-if="avatarList.length <= 6")
    img(
      v-for="(avatar, index) in avatarList"
      class="w-7.5 h-7.5 border border-black-0 rounded-full relative"
      :src="avatar"
      :style="{ marginRight: avatarList.length === 1 ? '0px' : '-12px', zIndex: avatarList.length - index }"
    )
  template(v-else)
    template(v-for="(avatar, index) in avatarList.slice(0, 6)")
      img(
        v-if="index < 5"
        :src="avatar"
        class="w-7.5 h-7.5 border border-black-0 rounded-full relative"
        :style="{ marginRight: '-12px', zIndex: avatarList.length - index }"
      )
      div(
        v-else
        class="w-7.5 h-7.5 rounded-full relative bg-primary-middle flex items-center justify-center"
        :style="{ marginRight: '-12px', zIndex: avatarList.length - index }"
      )
        f-svg-icon(iconName="more" size="24" class="text-black-600")
</template>

<script>
export default {
  name: 'FAvatarGroup',
  props: {
    avatarList: {
      type: Array,
      required: true
    },
    direction: {
      type: String,
      default: 'ltr',
      validator: (v) => ['ltr', 'rtl'].includes(v)
    }
  }
}
</script>

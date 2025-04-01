<template lang="pug">
div(
  class="bg-brand-solid flex justify-center items-center w-full h-full text-primary"
  data-theme="new"
)
  div(class="max-w-[41rem] flex flex-col gap-5 h-full flex-1 justify-center my-5 mx-10")
    f-svg-icon(iconName="frontier" size="48" class="text-grey-0")
    p(class="text-2xl") {{ $t('UU0194') }}
    div(class="flex flex-col gap-1 p-4 rounded-xl bg-brand text-secondary-text text-base")
      p {{ $t('UU0195') }}
      a(:href="CONTACT_LINK" class="text-link underline cursor w-fit") {{ CONTACT_LINK }}
</template>

<script lang="ts" setup>
const CONTACT_LINK = 'https://www.frontier.cool/pages/contact'
</script>

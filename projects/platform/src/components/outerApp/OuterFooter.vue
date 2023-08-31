<template lang="pug">
footer(
  class="fixed z-footer bottom-0 w-full h-13 bg-grey-50 px-5 md:px-36 flex items-center justify-end shadow-4 border-t border-grey-150"
)
  a(href="https://www.frontier.cool/" target="_blank" class="flex items-center")
    img(
      src="@/assets/images/frontier_logo.png"
      class="w-14 object-contain md:w-20.5 h-4 mr-2"
    )
    p(class="text-caption md:text-body2 text-grey-900") {{ $t('GG0004') }}
</template>

<template lang="pug">
modal-behavior(
  :header="$t('RR0234')"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  div(class="w-145")
    p(class="text-body2 text-grey-900 leading-1.6 pb-3") {{ $t('RR0235') }}
    img(src="@/assets/images/methodology_visual_1.png")
    p(class="text-body2 text-grey-900 leading-1.6 pt-8 pb-2") {{ $t('RR0236') }}
    img(src="@/assets/images/methodology_visual_2.png")
</template>

<script setup></script>

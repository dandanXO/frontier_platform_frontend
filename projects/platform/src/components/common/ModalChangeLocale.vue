<template lang="pug">
modal-behavior(
  :header="$t('RR0137')"
  :primaryBtnText="$t('UU0018')"
  @click:primary="changeLocale"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  f-select-dropdown(
    class="w-85"
    v-model:selectValue="newLocale"
    :dropdownMenuTree="langMenuTree"
  )
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
const langMenuTree = {
  width: 'w-85',
  blockList: [
    {
      menuList: [
        {
          title: 'English',
          selectValue: 'en-US',
        },
        {
          title: '繁體中文',
          selectValue: 'zh-TW',
        },
        {
          title: '日本語',
          selectValue: 'ja-JP',
        },
      ],
    },
  ],
}

const store = useStore()
const originalLocale = store.getters['user/user'].locale
const newLocale = ref(originalLocale)

const changeLocale = async () => {
  if (originalLocale !== newLocale.value) {
    store.dispatch('helper/pushModalLoading')
    await store.dispatch('user/changeLocale', { locale: newLocale.value })
    window.location.reload()
  }
  store.dispatch('helper/clearModalPipeline')
}
</script>

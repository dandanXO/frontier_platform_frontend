<template lang="pug">
modal-behavior(
  :header="$t('RR0137')"
  :primaryBtnText="$t('UU0018')"
  @click:primary="changeLocale"
  :secondaryBtnText="$t('UU0026')"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  f-input-select(
    class="w-85"
    v-model:selectValue="newLocale"
    :optionList="localeOptionList"
    keyOptionDisplay="lang"
    keyOptionValue="locale"
  )

</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
const localeOptionList = [
  {
    lang: 'English',
    locale: 'en-US'
  },
  {
    lang: '繁體中文',
    locale: 'zh-TW'
  }
]

const store = useStore()
const originalLocale = store.getters['user/user'].locale
const newLocale = ref(originalLocale)

const changeLocale = async () => {
  if (originalLocale !== newLocale) {
    store.dispatch('helper/pushModalLoading')
    await store.dispatch('user/changeLocale', { locale: newLocale.value })
    await store.dispatch('helper/reloadInnerApp')
  }
  store.dispatch('helper/clearModalPipeline')
}
</script>

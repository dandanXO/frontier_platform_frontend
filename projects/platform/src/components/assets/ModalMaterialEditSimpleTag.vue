<template lang="pug">
modal-behavior(
  :header="`${material.materialNo} - ${$t('RR0133')}`"
  :primaryBtnText="$t('UU0018')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="updateMaterialSimpleTag"
  @click:secondary="$store.dispatch('helper/closeModal')"
)
  div(class="min-w-200")
    div(class="grid gap-y-7.5 px-8 mb-7.5")
      f-select-input(
        v-model:selectValue="material.publicTagList"
        :dropdownMenuTree="menuTreePublicTag"
        @addNew="addNew($event, menuTreePublicTag)"
        :label="$t('RR0027')"
        :placeholder="$t('DD0018')"
        multiple
      )
      div(class="relative")
        f-select-input(
          v-model:selectValue="material.aiTagList"
          :dropdownMenuTree="menuTreeAiTag"
          @addNew="addNew($event, menuTreeAiTag)"
          :label="$t('RR0071')"
          :placeholder="$t('DD0018')"
          multiple
        )
        p(class="absolute right-0 top-0 text-caption text-grey-900") {{ $t('EE0036') }}
    div(class="bg-grey-50 px-7.5 py-7.5")
      h6(class="text-h6 text-grey-600 font-bold mb-7.5") {{ $t('DD0019') }}
      f-select-input(
        v-model:selectValue="material.privateTagList"
        :dropdownMenuTree="menuTreePrivateTag"
        @addNew="addNew($event, menuTreePrivateTag)"
        :label="$t('RR0028')"
        :placeholder="$t('DD0020')"
        multiple
      )
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const material = computed(() => store.getters['assets/material'])

const menuTreePublicTag = ref({
  blockList: [
    {
      menuList: material.value.publicTagList.map((tag) => ({
        title: tag,
        selectValue: tag,
      })),
    },
  ],
})
const menuTreeAiTag = ref({
  blockList: [
    {
      menuList: material.value.aiTagList.map((tag) => ({
        title: tag,
        selectValue: tag,
      })),
    },
  ],
})
const menuTreePrivateTag = ref({
  blockList: [
    {
      menuList: material.value.privateTagList.map((tag) => ({
        title: tag,
        selectValue: tag,
      })),
    },
  ],
})

const addNew = (newMenu, source) => {
  source.blockList[0].menuList.push({
    title: newMenu,
    selectValue: newMenu,
  })
}

watch(
  () => material.value,
  () => {
    store.commit('assets/UPDATE_material', material.value)
  },
  {
    deep: true,
  }
)

const updateMaterialSimpleTag = async () => {
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('assets/updateMaterialSimpleTag')
  store.dispatch('helper/clearModalPipeline')
  store.dispatch('helper/reloadInnerApp')
}

await store.dispatch('assets/getMaterialOptions')
</script>

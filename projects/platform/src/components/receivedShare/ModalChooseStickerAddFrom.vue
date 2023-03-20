<template lang="pug">
modal-behavior(
  :header="$t('TT0110')"
  :primaryBtnText="$t('UU0031')"
  :secondaryBtnText="$t('UU0002')"
  @click:primary="innerActionHandler"
  @click:secondary="closeModalBehavior"
)
  div(class="w-94")
    f-select-dropdown(
      v-model:selectValue="selectedOrgNo"
      :dropdownMenuTree="orgMenuTree"
      :label="$t('RR0212')"
      class="mb-7.5"
    )
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  actionHandler: {
    type: Function,
    required: true,
  },
})
const store = useStore()

const orgList = computed(() => store.getters['user/organizationList'])
const orgMenuTree = computed(() => ({
  width: 'w-94',
  blockList: [
    {
      menuList: orgList.value.map(({ orgName, orgNo }) => ({
        title: orgName,
        selectValue: orgNo,
      })),
    },
  ],
}))
const selectedOrgNo = ref(orgList.value[0]?.orgNo || null)

const innerActionHandler = async () => {
  await props.actionHandler(selectedOrgNo.value)
}

const closeModalBehavior = () => {
  store.dispatch('helper/closeModalBehavior')
}
</script>

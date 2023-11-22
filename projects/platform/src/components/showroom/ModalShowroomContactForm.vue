<template lang="pug">
modal-behavior(
  :header="$t('II0024')"
  :primaryBtnText="$t('UU0049')"
  :secondaryBtnText="$t('UU0002')"
  :primaryBtnDisabled="primaryBtnDisabled"
  @click:primary="contactShowroomOrg"
  @click:secondary="$store.dispatch('helper/closeModalBehavior')"
)
  form(class="w-125")
    div(class="grid grid-cols-2 gap-5 mb-5")
      f-input-text(
        ref="refFromEmail"
        v-model:textValue="formData.fromEmail"
        :label="$t('II0026')"
        required
        size="md"
        :rules="[$inputRules.required(), $inputRules.email()]"
      )
      f-select-dropdown(
        :label="$t('II0025')"
        required
        :dropdownMenuTree="orgMenuTree"
        v-model:selectValue="formData.toOrgId"
        size="md"
        :disabled="onlyToOne"
      )
    f-input-text(
      v-model:textValue="formData.subject"
      :label="$t('II0027')"
      required
      :rules="[$inputRules.required()]"
      class="mb-4"
    )
    f-input-textarea(
      v-model:textValue="formData.content"
      :label="$t('RR0146')"
      height="146"
      required
      :rules="[$inputRules.required()]"
    )
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FInputText } from '@frontier/ui-component'
import type { ShowroomAllOfParticipatedOrgList } from '@frontier/platform-web-sdk'
import { useShowroomStore } from '@/stores/showroom'

const props = defineProps<{
  toOrgId: number
  // 只能發送給預設的 toOrgId 對象，不能選擇其他的 (從單一 showroom 開啟的)
  onlyToOne: boolean
  showroomId: number
  participatedOrgList: ShowroomAllOfParticipatedOrgList[]
}>()

const store = useStore()
const notify = useNotifyStore()
const { t } = useI18n()
const { ogBaseShowroomApi } = useShowroomStore()

const formData = reactive({
  showroomId: props.showroomId,
  toOrgId: props.toOrgId,
  fromEmail: store.getters['user/email'] as string,
  subject: '',
  content: '',
})

const refFromEmail = ref<typeof FInputText>()
const primaryBtnDisabled = computed(
  () => refFromEmail.value?.isError || !formData.subject || !formData.content
)
const orgMenuTree = computed(() => ({
  blockList: [
    {
      menuList: props.participatedOrgList.map(({ orgName, logo, orgId }) => ({
        title: orgName,
        selectValue: orgId,
        thumbnail: logo,
      })),
    },
  ],
}))
const selectedOrg = computed(
  () => props.participatedOrgList.find((org) => org.orgId === formData.toOrgId)!
)

const contactShowroomOrg = async () => {
  store.dispatch('helper/clearModalPipeline')
  await ogBaseShowroomApi('sendShowroomEmail', formData)
  notify.showNotifySnackbar({
    messageText: t('II0033', { orgName: selectedOrg.value.orgName }),
  })
}
</script>

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
        v-if="!onlyToOne"
        :label="$t('II0025')"
        required
        :dropdownMenuTree="orgMenuTree"
        v-model:selectValue="formData.toOrgId"
        size="md"
      )
      f-input-text(
        v-else
        :label="$t('II0025')"
        v-model:textValue="selectedOrg.orgName"
        required
        disabled
        size="md"
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

<script setup>
import { useStore } from 'vuex'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  toOrgId: {
    type: Number,
  },
  // 只能發送給預設的 toOrgId 對象，不能選擇其他的 (從單一 showroom 開啟的)
  onlyToOne: {
    type: Boolean,
    default: false,
  },
})

const store = useStore()
const { t } = useI18n()

const showroom = computed(() => store.getters['showroom/showroom'])
const formData = reactive({
  showroomId: showroom.value.showroomId,
  toOrgId: props.toOrgId,
  fromEmail: store.getters['user/email'],
  subject: '',
  content: '',
})

const refFromEmail = ref(null)
const primaryBtnDisabled = computed(
  () => refFromEmail.value?.isError || !formData.subject || !formData.content
)
const orgMenuTree = computed(() => ({
  scrollAreaMaxHeight: 'max-h-99',
  blockList: [
    {
      menuList: showroom.value.participatedOrgList.map(
        ({ orgName, logo, orgId }) => ({
          title: orgName,
          selectValue: orgId,
          thumbnail: logo,
        })
      ),
    },
  ],
}))
const selectedOrg = computed(() =>
  showroom.value.participatedOrgList.find(
    (org) => org.orgId === formData.toOrgId
  )
)

const contactShowroomOrg = async () => {
  store.dispatch('helper/clearModalPipeline')
  await store.dispatch('showroom/contactShowroomOrg', formData)
  store.dispatch(
    'helper/pushFlashMessage',
    t('II0033', { orgName: selectedOrg.value.orgName })
  )
}
</script>

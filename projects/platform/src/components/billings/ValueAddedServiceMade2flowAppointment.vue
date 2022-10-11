<template lang="pug">
div(class="w-178")
  p(class="text-body2 text-grey-900") {{ $t("VV0027") }}
  div(class="py-7")
    p(class="text-caption text-grey-200 text-right") *{{ $t("RR0163") }}
    div(class="grid grid-cols-2 gap-x-8 gap-y-7.5 mb-7.5")
      f-input-text(
        v-model:textValue="formData.orgName"
        :label="$t('VV0028')"
        :placeholder="$t('VV0029')"
        :rules="[$inputRules.required()]"
        required
      )
      f-input-radio-group(
        v-model:inputValue="formData.orgCategoryId"
        :label="$t('VV0030')"
        :optionList="orgCategoryList"
        keyOptionValue="orgCategoryId"
        required
      )
      f-input-text(
        v-model:textValue="formData.name"
        :label="$t('VV0035')"
        :placeholder="$t('VV0036')"
        :rules="[$inputRules.required()]"
        required
      )
      f-input-text(
        v-model:textValue="formData.jobTitle"
        :label="$t('VV0039')"
        :placeholder="$t('VV0040')"
      )
      f-input-text(
        v-model:textValue="formData.email"
        :label="$t('VV0037')"
        :placeholder="$t('VV0038')"
        :customErrorMsg="emailFormatErrorMsg"
        :rules="[$inputRules.required()]"
        required
      )
      input-calling-code(
        v-model:textValue="formData.phone"
        v-model:countryCode="formData.phoneCountryCode"
        :label="$t('VV0041')"
        :placeholder="$t('VV0042')"
        :rules="[$inputRules.required()]"
        required
      )
    f-input-textarea(
      v-model:textValue="formData.message"
      :label="$t('VV0043')"
      height="120"
      class="pb-2"
      :placeholder="$t('VV0044')"
    )
    f-scrollbar-container(v-if="formData.attachmentFileList.length > 0" class="max-h-18 mb-2.5")
      div(class="grid gap-y-2")
        div(v-for="(attachment, index) in formData.attachmentFileList" class="h-8 flex justify-between items-center px-4 bg-grey-50")
          div(class="flex items-center gap-x-1")
            p(class="text-body2 font-bold text-grey-900 line-clamp-1") {{ attachment.name }}
            p(class="text-body2 font-normal text-grey-900 flex-shrink-0") ({{ bytesToSize(attachment.size) }})
          f-svg-icon(iconName="clear" size="14" class="text-grey-900 ml-1 cursor-pointer" @click="removeAttachment(index)")
    f-button(size="sm" type="secondary" prependIcon="add" class="mb-1.5" @click="chooseFile") {{ $t("UU0063") }}
    p(v-if="fileErrorMsg" class="text-red-400 text-caption pb-1.5") {{ fileErrorMsg }}
    div(class="text-caption text-grey-900")
      p(class="pb-2") {{ $t("RR0243") }} {{ acceptType.join(', ').toUpperCase() }}
      p {{ $t("RR0145") }} {{ fileSizeMaxLimit }} MB
    div(class="flex justify-end mt-7")
      f-button(size="md" type="primary" :disabled="actionBtnDisabled" @click="actionHandler") {{ $t('UU0049') }}
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { computed, reactive, ref, watch } from 'vue'
import { FileOperator, bytesToSize } from '@/utils/fileOperator'
import { UPLOAD_ERROR_CODE } from '@/utils/constants'

const { t } = useI18n()
const store = useStore()
const route = useRoute()
const router = useRouter()
const emailFormatErrorMsg = ref('')
const fileErrorMsg = ref('')

const organization = computed(() => store.getters['organization/organization'])
const { orgName, orgCategoryId, phone, phoneCountryCode, countryCode } = organization.value
const user = computed(() => store.getters['user/user'])

const formData = reactive({
  orgName,
  orgCategoryId,
  name: `${user.value.firstName} ${user.value.lastName}`,
  jobTitle: '',
  email: user.value.email,
  phone,
  phoneCountryCode: phoneCountryCode || countryCode,
  message: '',
  attachmentFileList: []
})

const orgCategoryList = computed(() => store.getters['code/orgCategoryList'])
const actionBtnDisabled = computed(() => !formData.orgName || !formData.name || !formData.email || !formData.phone || emailFormatErrorMsg.value.length > 0)

const fileSizeMaxLimit = 20
const acceptType = ['jpg', 'jpeg', 'png', 'mp4']
const fileOperator = new FileOperator(acceptType, fileSizeMaxLimit)

fileOperator.on('error', (code) => {
  const { INVALID_TYPE, EXCEED_LIMIT } = UPLOAD_ERROR_CODE

  if (code === INVALID_TYPE) {
    fileErrorMsg.value = t('RR0144')
  } else if (code === EXCEED_LIMIT) {
    fileErrorMsg.value = t('RR0145') + fileSizeMaxLimit + 'MB'
  }
})

fileOperator.on('finish', async (file) => {
  store.dispatch('helper/pushModalLoading')
  formData.attachmentFileList.unshift(file)
  fileErrorMsg.value = ''
  store.dispatch('helper/closeModalLoading')
})

const chooseFile = () => fileOperator.upload()

const removeAttachment = (index) => formData.attachmentFileList.splice(index, 1)

const actionHandler = async () => {
  store.dispatch('helper/pushModalLoading')
  await store.dispatch('organization/made2flowScheduleMeeting', formData)
  store.dispatch('helper/closeModalLoading')

  store.dispatch('helper/openModalConfirm', {
    type: 2,
    header: t('VV0045'),
    contentText: t('VV0046'),
    primaryBtnText: t('UU0114'),
    secondaryBtnText: t('UU0026'),
    primaryBtnHandler: () => {
      router.push({ name: route.name, params: { tab: 'plan' } })
    }
  })
}

watch(
  () => formData.email,
  () => {
    const validFormat = /^\S+@\S+\.\S+$/

    if (!validFormat.test(formData.email)) {
      emailFormatErrorMsg.value = t('WW0019')
    } else {
      emailFormatErrorMsg.value = ''
    }
  }
)
</script>

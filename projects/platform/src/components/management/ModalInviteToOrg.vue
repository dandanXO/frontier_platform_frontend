<template lang="pug">
modal-behavior(
  :header="$t('BB0020')"
  :primaryBtnText="`${$t('UU0014')}(${emailList.length})`"
  :primaryBtnDisabled="emailList.length === 0"
  @click:primary="inviteToOrg"
)
  div(class="w-94")
    f-input-text(
      v-model:textValue="email"
      prependIcon="search"
      :placeholder="$t('BB0065')"
      :hintError="errorMsg"
      :button="{ type: 'primary', icon: 'add' }"
      @click:button="addToInviteList"
    )
    f-scrollbar-container(class="h-48 mt-2 -mx-5")
      div(class="grid gap-y-0.5 mx-5")
        div(
          v-for="(email, index) in emailList"
          class="h-12 flex items-center justify-between hover:bg-grey-100 px-2.5"
        )
          p(class="text-body2 text-grey-900") {{ email }}
          f-svg-icon(
            iconName="clear"
            size="20"
            class="text-grey-250 cursor-pointer"
            @click="removeInvite(index)"
          )
  template(#note)
    div(class="text-cyan-400 flex items-center cursor-pointer" @click="copyInviteLink")
      f-svg-icon(iconName="copy_link" size="14" class="mr-1.5")
      span(class="text-caption") {{ $t('UU0015') }}
</template>

<script setup>
import { computed, reactive, ref, toRaw, watch } from 'vue'
import { inputValidator } from '@frontier/lib'
import { copyText } from '@frontier/lib'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useNotifyStore } from '@/stores/notify'

const props = defineProps({
  from: {
    type: String,
    default: 'org',
  },
})

const { t } = useI18n()
const store = useStore()
const notify = useNotifyStore()
const email = ref('')
const errorMsg = ref('')
const inviteLink = computed(() => {
  const origin = window.location.origin
  const orgNo = store.getters['organization/orgNo']
  const inviteCode =
    props.from === 'org'
      ? store.getters['organization/organization'].inviteCode
      : store.getters['group/group'].inviteCode

  return `${origin}/invite-link?orgNo=${orgNo}&from=${props.from}&inviteCode=${inviteCode}`
})

const emailList = reactive([])

const addToInviteList = async () => {
  if (!inputValidator.emailFormat(email.value)) {
    return (errorMsg.value = t('WW0019'))
  }

  if (
    await store.dispatch('organization/checkOrgMemberExist', {
      email: toRaw(email.value),
    })
  ) {
    return (errorMsg.value = t('WW0013'))
  }

  emailList.unshift(email.value)
  clearEmail()
}

const removeInvite = (index) => {
  emailList.splice(index, 1)
}

const clearEmail = () => {
  email.value = ''
}

const inviteToOrg = async () => {
  store.dispatch('helper/pushModalLoading')
  if (props.from === 'org') {
    await store.dispatch('organization/orgInviteViaEmail', {
      emailList: toRaw(emailList),
    })
  } else {
    await store.dispatch('group/inviteToOrgFromGroup', {
      emailList: toRaw(emailList),
    })
  }
  store.dispatch('helper/clearModalPipeline')
}

watch(
  () => email.value,
  () => {
    errorMsg.value = ''
  }
)

const copyInviteLink = () => {
  copyText(inviteLink.value)
  notify.showNotifySnackbar({ messageText: t('BB0108') })
}
</script>

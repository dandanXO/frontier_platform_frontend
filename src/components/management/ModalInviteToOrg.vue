<template lang="pug">
div(class="w-118.5")
  div(class="px-8")
    i18n-t(keypath="BB0020" tag="h6" class="text-h6 text-primary font-bold pb-7.5 text-center")
      template(#orgName) {{orgName}}
    input-text-icon(
      v-model:textValue="email"
      prependIcon="search"
      :placeholder="$t('BB0065')"
      :disabledIcon="email === ''"
      :customErrorMsg="errorMsg"
      @click:icon="addToInviteList"
    )
    overlay-scrollbar-container(v-if="emailList.length > 0" class="max-h-52 mt-4 -mx-8")
      div(class="grid gap-y-0.5 mx-7.5")
        div(v-for="(email, index) in emailList" class="h-10 flex items-center justify-between hover:bg-black-200 px-2.5")
          p(class="text-body2 text-primary") {{email}}
          svg-icon(iconName="clear" size="20" class="text-black-500 cursor-pointer" @click="removeInvite(index)")
  div(class="border-t border-primary-thin mt-7.5")
    div(class="py-5 px-8 flex items-start gap-x-2")
      svg-icon(iconName="error_outline" class="text-primary")
      p(class="flex-grow text-caption text-primary line-height-1.6") {{$t('BB0021')}}
      btn(size="sm" :disabled="emailList.length === 0" @click="inviteToOrg") {{$t('UU0014')}}
    div(class="bg-black-100 py-5.5 px-8 flex items-center gap-x-3")
      svg-icon(iconName="link" size="36")
      input-text-btn(
        class="w-full"
        size="sm"
        disabledInput
        :textValue="inviteLink"
        :clearable="false"
        :buttonLabel="$t('UU0015')"
        @click:button="copyText(inviteLink), $store.commit('helper/PUSH_message', $t('BB0108'))"
      )
</template>

<script>
import { computed, reactive, ref, toRaw, watch } from 'vue'
import inputValidator from '@/utils/input-validator'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import copyText from '@/utils/copy-text'

export default {
  name: 'ModalInviteToOrg',
  props: {
    from: {
      type: String,
      default: 'org'
    }
  },
  setup (props) {
    const { t } = useI18n()
    const store = useStore()
    const email = ref('')
    const errorMsg = ref('')
    const inviteLink = computed(() => {
      const origin = window.location.origin
      const orgNo = store.getters['organization/orgNo']
      const inviteCode = props.from === 'org'
        ? store.getters['organization/organization'].inviteCode
        : store.getters['group/group'].inviteCode

      return `${origin}/invite-link?orgNo=${orgNo}&from=${props.from}&inviteCode=${inviteCode}`
    })

    const orgName = computed(() => store.getters['organization/organization'].orgName)

    const emailList = reactive([])

    const addToInviteList = async () => {
      try {
        if (!inputValidator.emailFormat(email.value)) {
          throw t('WW0019')
        }

        if (await store.dispatch('organization/checkOrgMemberExist', { email: toRaw(email.value) })) {
          throw t('WW0013')
        }

        emailList.unshift(email.value)
        clearEmail()
      } catch (error) {
        errorMsg.value = error
      }
    }

    const removeInvite = (index) => {
      emailList.splice(index, 1)
    }

    const clearEmail = () => {
      email.value = ''
    }
    const clearEmailList = () => {
      emailList.length = 0
    }
    const resetData = () => {
      clearEmail()
      clearEmailList()
    }

    const inviteToOrg = async () => {
      store.dispatch('helper/pushModalLoading')
      if (props.from === 'org') {
        await store.dispatch('organization/inviteToOrg', { emailList: toRaw(emailList) })
      } else {
        await store.dispatch('group/inviteToOrgFromGroup', { emailList: toRaw(emailList) })
      }
      store.dispatch('helper/clearModalPipeline')
    }

    watch(
      () => email.value,
      () => {
        errorMsg.value = ''
      }
    )

    return {
      email,
      inviteLink,
      emailList,
      removeInvite,
      addToInviteList,
      inputValidator,
      errorMsg,
      resetData,
      inviteToOrg,
      copyText,
      orgName
    }
  }
}
</script>

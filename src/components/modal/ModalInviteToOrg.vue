<template lang="pug">
modal(@close="resetData")
  template(#activator="{ open }")
    slot(name="activator" :open="open")
  div(class="w-102.5")
    h6(class="text-h6 text-primary font-bold pb-7.5 text-center") {{$t('b.inviteToOrg')}}
    input-text-icon(
      v-model:textValue="email"
      prependIcon="search"
      :placeholder="$t('b.search')"
      :diabledIcon="email === ''"
      :customErrorMsg="errorMsg"
      @click:icon="addToInviteList"
    )
    overlay-scrollbar-container(v-if="emailList.length > 0" class="max-h-52 mt-4 -mx-8")
      div(class="grid gap-y-0.5 mx-7.5")
        div(v-for="(email, index) in emailList" class="h-10 flex items-center justify-between hover:bg-black-200 px-2.5")
          p(class="text-body2 text-primary") {{email}}
          svg-icon(iconName="clear" size="20" class="text-black-500 cursor-pointer" @click="removeInvite(index)")
  template(#footer="{ close }")
    div(class="w-118.5 border-t border-primary-thin mt-7.5")
      div(class="py-5 px-8 flex items-start gap-x-2")
        svg-icon(iconName="error_outline" class="text-primary")
        p(class="flex-grow text-caption text-primary line-height-1.6") {{$t('b.increaseAmount')}}
        btn(size="sm" :disabled="emailList.length === 0" @click="inviteToOrg(close)") {{$t('b.invite')}}
      div(class="bg-black-100 py-5.5 px-8 flex items-center gap-x-3")
        svg-icon(iconName="link" size="36")
        input-text-btn(
          class="w-full"
          size="sm"
          diabledInput
          :textValue="inviteLink"
          :clearable="false"
          :buttonLabel="$t('b.copy')"
          @click:button="copyText(inviteLink)"
        )
</template>

<script>
import { reactive, ref, toRaw, watch } from 'vue'
import inputValidator from '@/utils/input-validator'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import copyText from '@/utils/copy-text'

export default {
  name: 'ModalInviteToOrg',
  props: {
    via: {
      type: String,
      default: 'org'
    }
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const email = ref('')
    const errorMsg = ref('')
    const inviteLink = ref('http://www.froniter.cool/1234')
    /**
     * @todo: need to design invite link and redirect process
     */
    const emailList = reactive([])

    const addToInviteList = async () => {
      try {
        if (!inputValidator.emailFormat(email.value)) {
          throw t('reuse.invalidEmail')
        }

        if (await store.dispatch('organization/checkOrgMemberExist', { email: toRaw(email.value) })) {
          throw t('b.alreadyInOrg')
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

    const inviteToOrg = async (closeModalFunc) => {
      await store.dispatch('organization/inviteToOrg', { emailList: toRaw(emailList) })
      closeModalFunc()
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
      copyText
    }
  }
}
</script>

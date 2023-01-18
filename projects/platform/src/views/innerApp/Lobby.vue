<template lang="pug">
div(class="w-full")
  header(class="w-full h-15.5 pt-7.5 pl-10 pr-9 fixed inset-0")
    div(class="flex justify-between items-center")
      img(src="@/assets/images/frontier_logo.png" class="w-34 h-6.5")
      menu-personal
  div(class="w-full pt-15.5")
    div(v-if="orgList.length === 0" class="w-full flex flex-col items-center pt-37")
      h3(class="text-grey-900 font-bold text-h3 mb-6") {{ $t('AA0014') }}
      p(class="text-grey-900 text-body1 leading-1.6 w-160 text-center mb-7.5") {{ $t('AA0015') }}
      div(
        class="w-58 h-55 rounded-md border border-grey-200 border-dashed flex justify-center items-center cursor-pointer"
        @click="openModalCreateOrg(true)"
        data-cy="open-create-org-modal"
      )
        div(class="grid justify-items-center gap-y-3.5")
          f-svg-icon(iconName="add" size="24" class="text-grey-150")
          span(class="text-grey-150 text-body2 font-bold") {{ $t('AA0011') }}
    div(v-else class="pt-37 px-88")
      p(class="text-grey-600 font-bold text-body1 pb-3 border-b border-grey-100") {{ $t('AA0009') }}
      div(class="grid grid-cols-lobby gap-5 mt-7.5")
        div(
          v-for="org in orgList"
          class="w-58 h-55 rounded-md border border-grey-200 bg-grey-50 flex flex-col items-center py-5 cursor-pointer"
          @click="goToPublicLibrary(org.orgNo)"
          data-cy="org"
        )
          f-avatar(type="org" :imageUrl="org.logo" size="xl" class="mb-5")
          p(
            class="text-body1 text-grey-900 text-center font-bold mb-1 w-50 truncate break-all leading-1.4"
          ) {{ org.orgName }}
          p(class="text-grey-600 text-caption mb-7.5") {{ `${org.memberList.length} ${$t('AA0010', org.memberList.length)}` }}
          f-avatar-group(
            :itemList="org.memberList.map((member) => ({ imageUrl: member.avatar, name: member?.displayName }))"
          )
        div(
          class="w-58 h-55 rounded-md border border-grey-200 border-dashed flex justify-center items-center cursor-pointer"
          @click="openModalCreateOrg(true)"
          data-cy="open-create-org-modal"
        )
          div(class="grid justify-items-center gap-y-3.5")
            f-svg-icon(iconName="add" size="24" class="text-grey-150")
            span(class="text-grey-150 text-body2 font-bold") {{ $t('AA0011') }}
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MenuPersonal from '@/components/lobby/MenuPersonal.vue'
import { computed } from 'vue'
import remindVerifyEmail from '@/utils/remind-verify-email'

const store = useStore()
const router = useRouter()
const user = computed(() => store.getters['user/user'])
const orgList = computed(() => store.getters['user/organizationList'])

const goToPublicLibrary = (orgNo) => {
  if (!user.value.isVerify) {
    remindVerifyEmail()
    return
  }

  router.push({ name: 'PublicLibrary', params: { orgNo } })
}

const openModalCreateOrg = (closable = true) => {
  if (!user.value.isVerify) {
    remindVerifyEmail()
    return
  }

  store.dispatch('organization/resetCreateForm')
  store.dispatch('helper/openModalBehavior', {
    component: 'modal-create-org',
    properties: {
      closable,
    },
  })
}
</script>

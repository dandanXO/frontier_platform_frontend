<style lang="scss" scoped>
.pt-with-header-empty {
  padding-top: grow-shrink-y(58, 122);
}

.pt-with-header {
  padding-top: grow-shrink-y(58, 142);
}
</style>

<template lang="pug">
div(class="w-full")
  header(class="w-full h-15.5 pt-7.5 pl-10 pr-9 fixed inset-0")
    div(class="flex justify-between items-center")
      img(src="@/assets/images/frontier_logo.png" class="w-34 h-6.5")
      menu-personal
  div(class="w-full pt-15.5")
    div(v-if="orgList.length === 0" class="w-full flex flex-col items-center pt-with-header-empty")
      h3(class="text-primary font-bold text-h3 mb-6") {{ $t("AA0014") }}
      p(class="text-primary text-body1 leading-1.6 w-160 text-center mb-7.5") {{ $t("AA0015") }}
      div(class="w-58 h-55 rounded-md border border-black-400 border-dashed flex justify-center items-center cursor-pointer" @click="openModalCreateOrg(true)")
        div(class="grid justify-items-center gap-y-3.5")
          svg-icon(iconName="old-add" size="24")
          span(class="text-primary-middle text-body2 font-bold") {{ $t("AA0011") }}
    div(v-else class="pt-with-header px-88")
      p(class="text-black-800 font-bold text-body1 pb-3 border-b border-black-200") {{ $t("AA0009") }}
      div(class="grid grid-cols-lobby gap-5 mt-7.5")
        div(v-for="org in orgList" class="w-58 h-55 rounded-md border border-black-400 bg-black-100 flex flex-col items-center py-5 cursor-pointer" @click="goToPublicLibrary(org.orgNo)")
          div(class="w-15 h-15 mb-5")
            img(:src="org.logo" class="rounded-full")
          p(class="text-body1 text-primary text-center font-bold mb-1 w-50 truncate break-all leading-1.4") {{ org.orgName }}
          p(class="text-black-650 text-caption mb-7.5") {{ `${org.memberList.length} ${$t("AA0010", org.memberList.length)}` }}
          avatar-group(:avatarList="org.memberList.map(member => member.avatar)" direction="rtl")
        div(class="w-58 h-55 rounded-md border border-black-400 border-dashed flex justify-center items-center cursor-pointer" @click="openModalCreateOrg(true)")
          div(class="grid justify-items-center gap-y-3.5")
            svg-icon(iconName="old-add" size="24")
            span(class="text-primary-middle text-body2 font-bold") {{ $t("AA0011") }}
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import MenuPersonal from '@/components/lobby/MenuPersonal.vue'
import { computed } from 'vue'
import AvatarGroup from '@/components/AvatarGroup.vue'

export default {
  name: 'Lobby',
  components: {
    MenuPersonal,
    AvatarGroup
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const user = computed(() => store.getters['user/user'])
    const orgList = computed(() => store.getters['user/organizationList'])

    const goToPublicLibrary = (orgNo) => {
      if (!user.value.isVerify) {
        return store.dispatch('helper/openModal', {
          component: 'modal-verify-notification'
        })
      }

      router.push({ name: 'PublicLibrary', params: { orgNo } })
    }

    const openModalCreateOrg = (closable = true) => {
      if (!user.value.isVerify) {
        return store.dispatch('helper/openModal', {
          component: 'modal-verify-notification'
        })
      }

      store.dispatch('organization/resetCreateForm')
      store.dispatch('helper/openModal', {
        component: 'modal-create-org',
        closable
      })
    }

    return {
      orgList,
      goToPublicLibrary,
      openModalCreateOrg
    }
  }
}
</script>

<style lang="scss" scoped>
.pt-with-header-empty {
  padding-top: grow-shrink-y(58, 122);
}

.pt-with-header {
  padding-top: grow-shrink-y(58, 142);
}
</style>

<template lang="pug">
header(class="w-screen h-14.5 pt-8 pl-10 pr-9 fixed inset-0")
  div(class="flex justify-between")
    svg-icon(iconName="frontier-logo" size="special" class="w-34 h-6.5")
    ul(class="grid grid-flow-col gap-x-5.5")
      li
        dropdown-locale
      li(class="flex items-center")
        router-link-extending(class="text-primary font-bold text-caption" to="/logout") {{$t('AA0013')}}
        svg-icon(iconName="arrow-right" size="24" class="text-black-650")
div(class="w-screen pt-14.5")
  div(v-if="orgList.length === 0" class="w-full flex flex-col items-center pt-with-header-empty")
    h3(class="text-primary font-bold text-h3 mb-6") {{$t('AA0014')}}
    p(class="text-primary text-body1 line-height-1.6 w-160 text-center mb-7.5") {{$t('AA0015')}}
    div(class="w-58 h-55 rounded-md border border-black-400 border-dashed flex justify-center items-center cursor-pointer" @click="openModalCreateOrg(true)")
      div(class="grid justify-items-center gap-y-3.5")
        svg-icon(iconName="old-add" size="24")
        span(class="text-primary-middle text-body2 font-bold") {{$t('AA0011')}}
  div(v-else class="pt-with-header px-88")
    p(class="text-black-800 font-bold text-body1 pb-3 border-b border-black-200") {{$t('AA0009')}}
    div(class="flex gap-5 flex-wrap mt-7.5")
      div(v-for="org in orgList" class="w-58 h-55 rounded-md border border-black-400 bg-black-100 flex flex-col items-center py-5 cursor-pointer" @click="goToPublicLibrary(org.orgNo)")
        div(class="w-15 h-15 mb-5")
          img(:src="org.logo" class="rounded-full")
        span(class="text-body1 text-primary font-bold mb-3") {{org.orgName}}
        span(class="text-black-650 text-caption mb-7.5") {{`${org.memberList.length} ${$t('AA0010')}`}}
        div(class="flex flex-row-reverse transform -translate-x-1.5")
          template(v-if="org.memberList.length <= 6")
            img(v-for="(member, index) in org.memberList"
              class="w-7.5 h-7.5 border border-black-0 rounded-full relative"
              :src="member.avatar"
              :class="`z-${org.memberList.length - index}`"
              :style="{ 'margin-right': org.memberList.length === 1 ? '0px' : '-12px' }"
            )
          template(v-else)
            template(v-for="(member, index) in org.memberList.slice(0, 6)")
              img(v-if="index < 5" :src="member.avatar"
                class="w-7.5 h-7.5 border border-black-0 rounded-full relative"
                :class="`z-${org.memberList.length - index}`"
                :style="{ 'margin-right': '-12px' }"
              )
              div(v-else class="w-7.5 h-7.5 rounded-full relative bg-primary-middle flex items-center justify-center"
                :class="`z-${org.memberList.length - index}`"
                :style="{ 'margin-right': '-12px' }"
              )
                svg-icon(iconName="more" size="24" class="text-black-600")
      div(class="w-58 h-55 rounded-md border border-black-400 border-dashed flex justify-center items-center cursor-pointer" @click="openModalCreateOrg(true)")
        div(class="grid justify-items-center gap-y-3.5")
          svg-icon(iconName="old-add" size="24")
          span(class="text-primary-middle text-body2 font-bold") {{$t('AA0011')}}
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import DropdownLocale from '@/components/DropdownLocale'
import InputCallingCode from '@/components/InputCallingCode'
import { computed, onMounted } from 'vue'

export default {
  name: 'Lobby',
  components: {
    DropdownLocale,
    InputCallingCode
  },
  async setup () {
    const store = useStore()
    const router = useRouter()
    const orgList = computed(() => store.getters['user/organizationList'])

    const goToPublicLibrary = (orgNo) => {
      router.push({ name: 'PublicLibrary', params: { orgNo } })
    }

    const openModalCreateOrg = (closable = true) => {
      store.dispatch('organization/resetCreateForm')
      store.dispatch('helper/openModal', {
        component: 'modal-create-org',
        closable
      })
    }

    onMounted(() => {
      if (orgList.value.length === 0) {
        openModalCreateOrg(false)
      }
    })

    await store.dispatch('code/getOrgCategoryList')

    return {
      orgList,
      goToPublicLibrary,
      openModalCreateOrg
    }
  }
}
</script>

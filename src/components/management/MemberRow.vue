<template lang="pug">
div(
  class="h-15 flex items-center text-body2 text-primary"
  :class="[{ 'bg-black-200': isHover }]"
  @mouseover="isHover = true"
  @mouseleave="isHover = false"
)
  div(class="l:w-21 w-25 2xl:w-35 pr-6 flex justify-end")
    img(v-if="member.avatar !== null" :src="member.avatar" class="w-10 h-10 rounded-full")
    div(v-else class="w-10 h-10 rounded-full border border-primary border-dashed")
  div(class="l:w-46.5 w-61.5 2xl:w-74")
    p(v-if="member.displayName !== null") {{member.displayName}}
    div(v-else class="w-min px-2 py-1.5 text-caption text-primary border rounded border-primary") {{$t('b.pending')}}
  div(class="l:w-65 w-83.5 2xl:w-105") {{member.email}}
  div(class="l:w-41 w-54.5 2xl:w-82.5")
    template(v-if="member.roleId !== null")
      p(v-if="member.roleId === ROLE_ID.OWNER") {{getRoleName(member.roleId)}}
      template(v-else)
        template(v-if="location === 'org'")
          dropdown(v-model:value="member.roleId" :options="orgRoleLimitList" keyOptionValue="roleId")
            template(#displayItem="{ isExpand, option }")
              div(class="flex items-center")
                p {{option.name}}
                svg-icon(iconName="arrow-down" size="20" class="ml-4 text-black-600 transform" :class="[ isExpand ? '-rotate-90' : 'rotate-90' ]")
            template(#dropdownList="{ select, options, currentIndex }")
              div(class="absolute top-full -left-1 transform translate-y-2.5 w-auto py-2 rounded bg-black-0" style="box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);")
                div(v-for="(option, index) in options"
                  class="h-9 flex items-center px-3 text-body2 text-primary"
                  :class="{'bg-primary-thin': index === currentIndex }"
                  @click="select($event, option), changeOrgMemberRole(option.roleId)"
                ) {{option.name}}
    p(v-else class="ml-4 w-4 border-t border-primary")
  div(class="flex-grow")
    p(v-if="member.lastSignInTime !== null") {{member.lastSignInTime}}
    p(v-else class="ml-4 w-4 border-t border-primary")
  div(v-if="isHover" class="l:pr-5 pr-7 2xl:pr-26")
    p(v-if="member.orgUserId === null" class="text-body2 text-black-600 cursor-pointer" @click="openModalConfirmToCancelOrgInvitation") {{$t('b.cancel')}}
    p(v-else-if="member.roleId !== ROLE_ID.OWNER" class="text-body2 text-black-600 cursor-pointer" @click="openModalConfirmToRemoveOrgMember") {{$t('b.remove')}}
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ROLE_ID } from '@/utils/constants'

export default {
  name: 'MemberRow',
  props: {
    member: {
      type: Object,
      required: true
    },
    location: {
      type: String,
      default: 'org'
    }
  },
  setup (props) {
    const isHover = ref(false)
    const store = useStore()
    const { t } = useI18n()

    const orgRoleLimitList = computed(() => store.getters['code/orgRoleLimitList'])
    const roleLimit = computed(() => store.getters['code/roleLimit'])
    const getRoleName = (roleId) => store.getters['code/getRoleName'](roleId)
    const getGroupRoleLimitList = (orgRoleId) => store.getters['code/getGroupRoleLimitList'](orgRoleId)

    const changeOrgMemberRole = async (roleId) => {
      await store.dispatch('organization/changeOrgMemberRole', { orgUserId: props.member.orgUserId, roleId })
    }

    const openModalConfirmToRemoveOrgMember = () => {
      store.dispatch('helper/openModalConfirm', {
        title: t('b.removeMember'),
        content: t('b.sureToRemoveMemebr', { name: props.member.displayName }),
        secondaryText: t('b.confirm'),
        secondaryHandler: async () => {
          await store.dispatch('organization/removeOrgMember', { orgUserId: props.member.orgUserId })
        }
      })
    }

    const openModalConfirmToCancelOrgInvitation = () => {
      store.dispatch('helper/openModalConfirm', {
        title: t('b.canelInvite'),
        content: t('b.sureToCancelInvite'),
        secondaryText: t('b.confirm'),
        secondaryHandler: async () => {
          await store.dispatch('organization/cancelOrgInvitation', { email: props.member.email })
        }
      })
    }

    return {
      isHover,
      orgRoleLimitList,
      roleLimit,
      getRoleName,
      getGroupRoleLimitList,
      changeOrgMemberRole,
      openModalConfirmToRemoveOrgMember,
      ROLE_ID,
      openModalConfirmToCancelOrgInvitation
    }
  }
}
</script>

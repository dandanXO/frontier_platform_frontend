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
    template(v-if="member.orgRoleId !== null")
      p(v-if="member.orgRoleId === ROLE_ID.OWNER") {{getRoleName(member.orgRoleId)}}
      p(v-else-if="roleLimitList.length === 1") {{getRoleName(member.orgRoleId)}}
      template(v-else)
        dropdown(
          :value="currentRoleId"
          :options="roleLimitList"
          keyOptionDisplay="name"
          keyOptionValue="roleId"
          @select="changeMemberRole($event.roleId)"
        )
          template(#displayItem="{ isExpand, option }")
            div(class="flex items-center")
              p {{option.name}}
              svg-icon(iconName="arrow-down" size="20" class="ml-4 text-black-600 transform" :class="[ isExpand ? '-rotate-90' : 'rotate-90' ]")
    p(v-else class="ml-4 w-4 border-t border-primary")
  div(class="flex-grow")
    p(v-if="member.lastSignInTime !== null") {{member.lastSignInTime}}
    p(v-else class="ml-4 w-4 border-t border-primary")
  div(v-if="isHover" class="l:pr-5 pr-7 2xl:pr-26")
    p(v-if="member.orgRoleId === null" class="text-body2 text-black-600 cursor-pointer" @click="confirmToCancelInvitation") {{$t('b.cancel')}}
    p(v-else-if="member.orgRoleId !== ROLE_ID.OWNER && member.orgRoleId !== ROLE_ID.ADMIN" class="text-body2 text-black-600 cursor-pointer" @click="confirmToRemoveMember") {{$t('reuse.remove')}}
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ROLE_ID } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'MemberRow',
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const isHover = ref(false)
    const store = useStore()
    const { t } = useI18n()
    const { location } = useNavigation()

    const orgRoleLimitList = computed(() => store.getters['code/orgRoleLimitList'])
    const groupRoleLimitList = computed(() => store.getters['code/getGroupRoleLimitList'](props.member.orgRoleId))
    const roleLimitList = computed(() => location.value === 'org' ? orgRoleLimitList.value : groupRoleLimitList.value)
    const currentRoleId = computed(() => location.value === 'org' ? props.member.orgRoleId : props.member.groupRoleId)

    const getRoleName = (roleId) => store.getters['code/getRoleName'](roleId)

    const changeMemberRole = async (roleId) => {
      location.value === 'org'
        ? await store.dispatch('organization/changeOrgMemberRole', { orgUserId: props.member.orgUserId, roleId })
        : await store.dispatch('group/changeGroupMemberRole', { groupUserId: props.member.groupUserId, roleId })
    }

    const confirmToRemoveMember = () => {
      store.dispatch('helper/openModalConfirm', {
        title: t('b.removeMember'),
        content: t('b.sureToRemoveMember', { name: props.member.displayName }),
        secondaryText: t('b.confirm'),
        secondaryHandler: async () => {
          location.value === 'org'
            ? await store.dispatch('organization/removeOrgMember', { orgUserId: props.member.orgUserId })
            : await store.dispatch('group/removeGroupMember', { groupUserId: props.member.groupUserId })
        }
      })
    }

    const confirmToCancelInvitation = () => {
      store.dispatch('helper/openModalConfirm', {
        title: t('b.cancelInvite'),
        content: t('b.sureToCancelInvite'),
        secondaryText: t('b.confirm'),
        secondaryHandler: async () => {
          location.value === 'org'
            ? await store.dispatch('organization/cancelOrgInvitation', { email: props.member.email })
            : await store.dispatch('group/cancelGroupInvitation', { email: props.member.email })
        }
      })
    }

    return {
      isHover,
      orgRoleLimitList,
      roleLimitList,
      getRoleName,
      groupRoleLimitList,
      changeMemberRole,
      confirmToRemoveMember,
      ROLE_ID,
      location,
      currentRoleId,
      confirmToCancelInvitation
    }
  }
}
</script>

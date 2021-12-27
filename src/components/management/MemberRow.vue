<template lang="pug">
div(
  class="h-15 flex gap-x-3 items-center text-body2 text-primary"
  :class="[{ 'bg-black-200': isHover }]"
  @mouseover="isHover = true"
  @mouseleave="isHover = false"
)
  div(class="w-1/12 flex justify-end")
    div(v-if="member.isPending" class="w-10 h-10 rounded-full border border-primary border-dashed")
    img(v-else :src="member.avatar" class="w-10 h-10 rounded-full")
  div(class="w-2/12")
    div(v-if="member.isPending" class="w-min px-2 py-1.5 text-caption text-primary border rounded border-primary") {{$t('BB0024')}}
    p(v-else) {{member.displayName}}
  div(class="w-4/12") {{member.email}}
  div(class="w-2/12")
    p(v-if="member.isPending" class="ml-4 w-4 border-t border-primary")
    template(v-else)
      p(v-if="member.orgRoleId === ROLE_ID.OWNER") {{getRoleName(member.orgRoleId)}}
      p(v-else-if="roleLimitList.length === 1") {{getRoleName(member.orgRoleId)}}
      template(v-else)
        tooltip(
          class="flex-grow"
          placement='bottom-start'
          :manual="true"
          :showArrow="false"
          :offset="[0, 8]"
        )
          template(#trigger="{ isActive }")
            div(class="flex items-center cursor-pointer")
              p {{getRoleName(currentRoleId)}}
              svg-icon(iconName="arrow-down" size="20" class="ml-4 text-black-600 transform" :class="[ isActive ? '-rotate-90' : 'rotate-90' ]")
          template(#content)
            list
              list-item(
                v-for="option in roleLimitList"
                class="cursor-pointer"
                :class="{'bg-primary-thin': option.roleId === currentRoleId }"
                @click="changeMemberRole(option.roleId)"
              ) {{getRoleName(option.roleId)}}
  div(class="w-2/12")
    p(v-if="member.isPending" class="ml-4 w-4 border-t border-primary")
    p(v-else) {{member.lastSignInTime}}
  div(class="w-1/12")
    template(v-if="isHover")
      p(v-if="member.isPending" class="text-body2 text-black-600 cursor-pointer" @click="confirmToCancelInvitation") {{$t('UU0002')}}
      p(v-else-if="![ROLE_ID.OWNER, ROLE_ID.ADMIN].includes(member.orgRoleId)" class="text-body2 text-black-600 cursor-pointer" @click="confirmToRemoveMember") {{$t('UU0016')}}
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
    }
  },
  setup (props) {
    const isHover = ref(false)
    const store = useStore()
    const { t } = useI18n()

    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const orgRoleLimitList = computed(() => store.getters['code/orgRoleLimitList'])
    const groupRoleLimitList = computed(() => store.getters['code/getGroupRoleLimitList'](props.member.orgRoleId))
    const roleLimitList = computed(() => routeLocation.value === 'org' ? orgRoleLimitList.value : groupRoleLimitList.value)
    const currentRoleId = computed(() => routeLocation.value === 'org' ? props.member.orgRoleId : props.member.groupRoleId)

    const getRoleName = (roleId) => store.getters['code/getRoleName'](roleId)

    const changeMemberRole = async (roleId) => {
      routeLocation.value === 'org'
        ? await store.dispatch('organization/changeOrgMemberRole', { orgUserId: props.member.orgUserId, roleId })
        : await store.dispatch('group/changeGroupMemberRole', { groupUserId: props.member.groupUserId, roleId })
    }

    const confirmToRemoveMember = () => {
      store.dispatch('helper/openModalConfirm', {
        title: t('BB0058'),
        content: t('BB0062', { name: props.member.displayName }),
        secondaryText: t('UU0001'),
        secondaryHandler: async () => {
          routeLocation.value === 'org'
            ? await store.dispatch('organization/removeOrgMember', { orgUserId: props.member.orgUserId })
            : await store.dispatch('group/removeGroupMember', { groupUserId: props.member.groupUserId })
        }
      })
    }

    const confirmToCancelInvitation = () => {
      store.dispatch('helper/openModalConfirm', {
        title: t('BB0057'),
        content: t('BB0061'),
        secondaryText: t('UU0001'),
        secondaryHandler: async () => {
          routeLocation.value === 'org'
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
      currentRoleId,
      confirmToCancelInvitation
    }
  }
}
</script>

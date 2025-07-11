<template lang="pug">
f-table(
  v-model:pagination="pagination"
  v-model:keyword="searchInput"
  @update:keyword="resetCurrentPage"
  :headers="headers"
  :items="currentList"
  :isLoading="isLoading"
  :emptyText="$t('BB0031')"
  :searchPlaceholder="$t('BB0012')"
  rowHeight="60px"
  class="mt-2.5"
  searchable
)
  template(v-slot="{ item, prop, isHover }")
    div(v-if="prop === 'name'" class="flex items-center")
      div(class="flex justify-end mr-6")
        div(
          v-if="item.isPending"
          class="w-10 h-10 border border-dashed rounded-full border-grey-900"
        )
        f-avatar(v-else :imageUrl="item.avatar" size="lg")
      div
        div(
          v-if="item.isPending"
          class="w-min px-2 py-1.5 text-caption text-grey-900 border rounded border-grey-900"
        ) {{ $t('BB0024') }}
        p(v-else class="line-clamp-1") {{ item.displayName }}
    template(v-if="prop === 'role'")
      p(v-if="item.isPending" class="w-4 ml-4 border-t border-grey-900")
      template(v-else)
        p(v-if="isRoleDisplayOnly(item)") {{ getRoleName(getRoleId(item)) }}
        template(v-else)
          f-select-dropdown(
            class="w-full"
            :selectValue="getRoleId(item)"
            @update:selectValue="onChangeMemberRole(item, $event)"
            :dropdownMenuTree="roleListMenuTree(item)"
            :placeholder="$t('RR0292')"
          )
    template(v-if="prop === 'remove' && isHover")
      p(
        v-if="item.isPending && [ROLE_ID.OWNER].includes(roleIdFromUserOrgOrGroup)"
        class="cursor-pointer text-body2 text-grey-600"
        @click="confirmToCancelInvitation(item)"
      ) {{ $t('UU0002') }}
      p(
        v-else-if="!item.isPending && [ROLE_ID.OWNER].includes(roleIdFromUserOrgOrGroup) && !(item.orgRoleId === ROLE_ID.OWNER)"
        class="cursor-pointer text-body2 text-grey-600"
        @click="confirmToRemoveMember(item)"
      ) {{ $t('UU0016') }}
</template>

<script>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { ROLE_ID, NOTIFY_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import useNavigation from '@/composables/useNavigation'

export default {
  name: 'MemberList',
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const searchInput = ref('')
    const isLoading = ref(false)
    const { ogId, ogType } = useNavigation()
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const roleIdFromUserOrgOrGroup =
      store.getters['organization/orgUser/orgUser'].roleID
    const memberList = computed(() => {
      const orgMemberList = store.getters['organization/memberList']
      if (routeLocation.value === 'org') {
        return orgMemberList
      }

      const orgAdminsAndOwners = orgMemberList
        .filter(
          (member) =>
            member.orgRoleId === ROLE_ID.OWNER ||
            member.orgRoleId === ROLE_ID.ADMIN
        )
        .map((member) => ({
          ...member,
          groupUserId: null,
          groupRoleId: member.orgRoleId,
        }))

      // 優先顯示群組內的成員資訊。如果一個組織管理員同時也被加入到群組中，
      // 我們以群組中的角色為準，避免資料被組織角色覆蓋。
      const groupMembers = store.getters['group/memberList']
      const groupMemberEmails = new Set(groupMembers.map((m) => m.email))

      // 過濾掉那些已經存在於群組列表中的組織管理員
      const uniqueOrgAdminsAndOwners = orgAdminsAndOwners.filter(
        (orgMember) => !groupMemberEmails.has(orgMember.email)
      )
      return [...groupMembers, ...uniqueOrgAdminsAndOwners]
    })

    const pagination = reactive({
      currentPage: 1,
      totalPage: computed(() =>
        Math.ceil(filteredMemberList.value.length / pagination.perPageCount)
      ),
      perPageCount: 8,
    })
    const membersData = computed(() =>{
      return  memberList.value.map((member) => ({
        ...member,
        nameLowerCase: member.displayName
          ? member.displayName?.toLowerCase()
          : '',
        emailLowerCase: member.email ? member.email.toLowerCase() : '',
      }))
    })
    const filteredMemberList = computed(() => {
      const searchInputLowerCase = searchInput.value
        ? searchInput.value.toLowerCase()
        : ''
      return membersData.value.filter(
        (member) =>
          member.nameLowerCase?.includes(searchInputLowerCase) ||
          member.emailLowerCase.includes(searchInputLowerCase)
      )
    })
    const currentList = computed(() => {
      const { currentPage, perPageCount } = pagination
      return filteredMemberList.value.slice(
        (currentPage - 1) * perPageCount,
        currentPage * perPageCount
      )
    })
    const resetCurrentPage = () => (pagination.currentPage = 1)

    const headers = [
      {
        prop: 'name',
        label: t('BB0013'),
        colSpan: 'col-span-3',
      },
      {
        prop: 'email',
        label: t('BB0014'),
        colSpan: 'col-span-4',
      },
      {
        prop: 'role',
        label: t('BB0015'),
        colSpan: 'col-span-2',
      },
      {
        prop: 'lastSignInTime',
        label: t('BB0016'),
        colSpan: 'col-span-2',
      },
      {
        prop: 'remove',
        label: '',
        colSpan: 'col-span-1',
      },
    ]

    const getRoleName = (roleId) => store.getters['code/getRoleName'](roleId)

    const confirmToRemoveMember = (member) => {
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: t('BB0058'),
        contentText: t('BB0062', { name: member.displayName }),
        primaryBtnText: t('UU0001'),
        primaryBtnHandler: async () => {
          routeLocation.value === 'org'
            ? await store.dispatch('organization/removeOrgMember', {
                orgUserId: member.orgUserId,
              })
            : await store.dispatch('group/removeGroupMember', {
                groupUserId: member.groupUserId,
              })
        },
        secondaryBtnText: t('UU0002'),
      })
    }

    const confirmToCancelInvitation = (member) => {
      store.dispatch('helper/openModalConfirm', {
        type: NOTIFY_TYPE.WARNING,
        header: t('BB0057'),
        contentText: t('BB0061'),
        primaryBtnText: t('UU0001'),
        primaryBtnHandler: async () => {
          routeLocation.value === 'org'
            ? await store.dispatch('organization/cancelOrgInvitation', {
                email: member.email,
              })
            : await store.dispatch('group/cancelGroupInvitation', {
                email: member.email,
              })
        },
        secondaryBtnText: t('UU0002'),
      })
    }

    const isRoleDisplayOnly = (item) => {
      // 角色欄位應為唯讀狀態，如果：
      // 1. 目標成員是 OWNER。
      // 2. 當前使用者不是 OWNER 或 ADMIN。
      // 3. 當前使用者是 ADMIN，且目標成員也是 ADMIN。
      const isTargetOwner = item.orgRoleId === ROLE_ID.OWNER
      const canCurrentUserEdit =
        roleIdFromUserOrgOrGroup === ROLE_ID.OWNER ||
        roleIdFromUserOrgOrGroup === ROLE_ID.ADMIN
      const isCurrentUserAdmin = roleIdFromUserOrgOrGroup === ROLE_ID.ADMIN
      const isTargetAdmin = getRoleId(item) === ROLE_ID.ADMIN

      return (
        isTargetOwner ||
        !canCurrentUserEdit ||
        (isCurrentUserAdmin && isTargetAdmin)
      )
    }

    const roleLimitList = (member) => {
      const orgRoleLimitList = store.getters['code/orgRoleLimitList']
      const groupRoleLimitList = store.getters['code/getGroupRoleLimitList'](
        member.orgRoleId
      )
      const allPossibleRoles =
        routeLocation.value === 'org' ? orgRoleLimitList : groupRoleLimitList

      if (roleIdFromUserOrgOrGroup === ROLE_ID.ADMIN) {
        // An admin can only change roles to Member or Guest.
        return allPossibleRoles.filter(
          (role) =>
            role.roleId === ROLE_ID.MEMBER1 || role.roleId === ROLE_ID.GUEST
        )
      }

      // An owner can change to any role in the list.
      return allPossibleRoles
    }

    const getRoleId = (member) =>
      routeLocation.value === 'org' ? member.orgRoleId : member.groupRoleId

    const onChangeMemberRole = async (member, roleId) => {
      isLoading.value = true
      const isOrgLevelMemberInGroupView =
        routeLocation.value === 'group' &&
        (member.orgRoleId === ROLE_ID.ADMIN ||
          member.orgRoleId === ROLE_ID.OWNER)
      if (routeLocation.value === 'org' || isOrgLevelMemberInGroupView) {
        await store.dispatch('organization/changeOrgMemberRole', {
          orgUserId: member.orgUserId,
          roleId,
          ogType: 1, // alwaoys 1 is org
        })
      } else {
        await store.dispatch('group/changeGroupMemberRole', {
          groupUserId: member.groupUserId,
          roleId,
          ogId: ogId.value, // ogId = group id
          orgId: store.state.organization.orgId, // orgId = org id
          ogType: ogType.value,
        })
      }
      await fetchMemberList()
      isLoading.value = false
      return roleId
    }

    const roleListMenuTree = (item) => {
      return {
        width: 'w-75',
        blockList: [
          {
            menuList: roleLimitList(item).map((option) => ({
              title: getRoleName(option.roleId),
              selectValue: option.roleId,
            })),
          },
        ],
      }
    }

    const fetchMemberList = async () => {
      const routeLocation = store.getters['helper/routeLocation']

      if (routeLocation === 'org') {
        const orgNo = store.getters['organization/orgNo']
        await store.dispatch('organization/getOrg', { orgNo })
      } else {
        const groupId = store.getters['group/groupId']
        await store.dispatch('group/getGroup', { groupId })
      }
    }
    return {
      fetchMemberList,
      pagination,
      routeLocation,
      currentList,
      searchInput,
      headers,
      getRoleName,
      confirmToRemoveMember,
      ROLE_ID,
      confirmToCancelInvitation,
      resetCurrentPage,
      roleLimitList,
      onChangeMemberRole,
      getRoleId,
      roleIdFromUserOrgOrGroup,
      isLoading,
      roleListMenuTree,
      isRoleDisplayOnly,
    }
  },
}
</script>

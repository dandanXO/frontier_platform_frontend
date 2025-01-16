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
          class="w-10 h-10 rounded-full border border-grey-900 border-dashed"
        )
        f-avatar(v-else :imageUrl="item.avatar" size="lg")
      div
        div(
          v-if="item.isPending"
          class="w-min px-2 py-1.5 text-caption text-grey-900 border rounded border-grey-900"
        ) {{ $t('BB0024') }}
        p(v-else class="line-clamp-1") {{ item.displayName }}
    template(v-if="prop === 'role'")
      p(v-if="item.isPending" class="ml-4 w-4 border-t border-grey-900")
      template(v-else)
        p(
          v-if="item.orgRoleId === ROLE_ID.OWNER || roleIdFromUserOrgOrGroup !== ROLE_ID.OWNER"
        ) {{ getRoleName(item.orgRoleId) }}
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
        v-if="item.isPending"
        class="text-body2 text-grey-600 cursor-pointer"
        @click="confirmToCancelInvitation(item)"
      ) {{ $t('UU0002') }}
      p(
        v-else-if="[ROLE_ID.OWNER].includes(roleIdFromUserOrgOrGroup)"
        class="text-body2 text-grey-600 cursor-pointer"
        @click="confirmToRemoveMember(item)"
      ) {{ $t('UU0016') }}
</template>

<script>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { ROLE_ID, NOTIFY_TYPE } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

export default {
  name: 'MemberList',
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const searchInput = ref('')
    const isLoading = ref(false)
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const roleIdFromUserOrgOrGroup =
      store.getters['organization/orgUser/orgUser'].roleID
    const memberList = computed(() => {
      const orgMemberList = store.getters['organization/memberList']
      if (routeLocation.value === 'org') {
        return orgMemberList
      }

      return orgMemberList
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
        .concat(store.getters['group/memberList'])
    })

    const pagination = reactive({
      currentPage: 1,
      totalPage: computed(() =>
        Math.ceil(filteredMemberList.value.length / pagination.perPageCount)
      ),
      perPageCount: 8,
    })
    const filteredMemberList = computed(() =>
      memberList.value.filter(
        (member) =>
          member.displayName?.includes(searchInput.value) ||
          member.email.includes(searchInput.value)
      )
    )
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

    const roleLimitList = (member) => {
      const orgRoleLimitList = store.getters['code/orgRoleLimitList']
      const groupRoleLimitList = store.getters['code/getGroupRoleLimitList'](
        member.orgRoleId
      )
      return routeLocation.value === 'org'
        ? orgRoleLimitList
        : groupRoleLimitList
    }

    const getRoleId = (member) =>
      routeLocation.value === 'org' ? member.orgRoleId : member.groupRoleId

    const onChangeMemberRole = async (member, roleId) => {
      isLoading.value = true
      routeLocation.value === 'org'
        ? await store.dispatch('organization/changeOrgMemberRole', {
            orgUserId: member.orgUserId,
            roleId,
          })
        : await store.dispatch('group/changeGroupMemberRole', {
            groupUserId: member.groupUserId,
            roleId,
          })
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
    }
  },
}
</script>

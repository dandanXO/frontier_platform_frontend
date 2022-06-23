<template lang="pug">
general-table(
  v-model:pagination="pagination"
  v-model:keyword="searchInput"
  @update:keyword="resetCurrentPage"
  :headers="headers"
  :items="currentList"
  :emptyText="$t('BB0031')"
  :searchPlaceholder="$t('BB0012')"
  rowHeight="60px"
  class="mt-2.5"
  searchable
)
  template(v-slot="{ item, prop, isHover }")
    div(v-if="prop === 'name'" class="flex items-center")
      div(class="flex justify-end mr-6")
        div(v-if="item.isPending" class="w-10 h-10 rounded-full border border-primary border-dashed")
        img(v-else :src="item.avatar" class="w-10 h-10 rounded-full")
      div
        div(v-if="item.isPending" class="w-min px-2 py-1.5 text-caption text-primary border rounded border-primary") {{ $t("BB0024") }}
        p(v-else class="line-clamp-1") {{ item.displayName }}
    template(v-if="prop === 'role'")
      p(v-if="item.isPending" class="ml-4 w-4 border-t border-primary")
      template(v-else)
        p {{ getRoleName(item.orgRoleId) }}
        //- p(v-if="item.orgRoleId === ROLE_ID.OWNER") {{ getRoleName(item.orgRoleId) }}
        //- p(v-else-if="roleLimitList(item).length === 1") {{ getRoleName(item.orgRoleId) }}
        //- template(v-else)
        //-   tooltip(
        //-     class="flex-grow"
        //-     placement="bottom-start"
        //-     :manual="true"
        //-     :showArrow="false"
        //-     :offset="[0, 8]"
        //-   )
        //-     template(#trigger="{ isActive }")
        //-       div(class="flex items-center cursor-pointer")
        //-         p {{ getRoleName(currentRoleId(item)) }}
        //-         svg-icon(iconName="arrow-down" size="20" class="ml-4 text-black-600 transform" :class="[isActive ? '-rotate-90' : 'rotate-90']")
        //-     template(#content)
        //-       list
        //-         list-item(
        //-           v-for="option in roleLimitList(item)"
        //-           class="cursor-pointer"
        //-           :class="{ 'bg-primary-thin': option.roleId === currentRoleId(item) }"
        //-           @click="changeMemberRole(item, option.roleId)"
        //-         ) {{ getRoleName(option.roleId) }}
    template(v-if="prop === 'remove' && isHover")
      p(v-if="item.isPending" class="text-body2 text-black-600 cursor-pointer" @click="confirmToCancelInvitation(item)") {{ $t("UU0002") }}
      p(v-else-if="![ROLE_ID.OWNER, ROLE_ID.ADMIN].includes(item.orgRoleId)" class="text-body2 text-black-600 cursor-pointer" @click="confirmToRemoveMember(item)") {{ $t("UU0016") }}
</template>

<script>
import { computed, ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { ROLE_ID } from '@/utils/constants'
import { useI18n } from 'vue-i18n'

export default {
  name: 'MemberList',
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const searchInput = ref('')
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const memberList = computed(() => {
      const orgMemberList = store.getters['organization/memberList']
      if (routeLocation.value === 'org') {
        return orgMemberList
      }

      return orgMemberList
        .filter(member => member.orgRoleId === ROLE_ID.OWNER || member.orgRoleId === ROLE_ID.ADMIN)
        .map(member => ({
          groupUserId: null,
          groupRoleId: member.orgRoleId,
          ...member
        }))
        .concat(store.getters['group/memberList'])
    })

    const pagination = reactive({
      currentPage: 1,
      totalPage: computed(() => Math.ceil(filteredMemberList.value.length / pagination.perPageCount)),
      perPageCount: 8
    })
    const filteredMemberList = computed(() => memberList.value.filter(member => member.displayName?.includes(searchInput.value) || member.email.includes(searchInput.value)))
    const currentList = computed(() => {
      const { currentPage, perPageCount } = pagination
      return filteredMemberList.value.slice((currentPage - 1) * perPageCount, currentPage * perPageCount)
    })
    const resetCurrentPage = () => pagination.currentPage = 1

    const headers = [
      {
        prop: 'name',
        label: t('BB0013'),
        colSpan: 'col-span-3'
      },
      {
        prop: 'email',
        label: t('BB0014'),
        colSpan: 'col-span-4',
      },
      {
        prop: 'role',
        label: t('BB0015'),
        colSpan: 'col-span-2'
      },
      {
        prop: 'lastSignInTime',
        label: t('BB0016'),
        colSpan: 'col-span-2'
      },
      {
        prop: 'remove',
        label: '',
        colSpan: 'col-span-1'
      }
    ]

    const getRoleName = (roleId) => store.getters['code/getRoleName'](roleId)

    const confirmToRemoveMember = (member) => {
      store.dispatch('helper/openModalConfirm', {
        type: 1,
        header: t('BB0058'),
        contentText: t('BB0062', { name: member.displayName }),
        primaryBtnText: t('UU0001'),
        primaryBtnHandler: async () => {
          routeLocation.value === 'org'
            ? await store.dispatch('organization/removeOrgMember', { orgUserId: member.orgUserId })
            : await store.dispatch('group/removeGroupMember', { groupUserId: member.groupUserId })
        },
        secondaryBtnText: t('UU0002')
      })
    }

    const confirmToCancelInvitation = (member) => {
      store.dispatch('helper/openModalConfirm', {
        type: 1,
        header: t('BB0057'),
        contentText: t('BB0061'),
        primaryBtnText: t('UU0001'),
        primaryBtnHandler: async () => {
          routeLocation.value === 'org'
            ? await store.dispatch('organization/cancelOrgInvitation', { email: member.email })
            : await store.dispatch('group/cancelGroupInvitation', { email: member.email })
        },
        secondaryBtnText: t('UU0002')
      })
    }

    // const roleLimitList = (member) => {
    //   const orgRoleLimitList = store.getters['code/orgRoleLimitList']
    //   const groupRoleLimitList = store.getters['code/getGroupRoleLimitList'](member.orgRoleId)
    //   return routeLocation.value === 'org' ? orgRoleLimitList : groupRoleLimitList
    // }
    // const currentRoleId = (member) => routeLocation.value === 'org' ? member.orgRoleId : member.groupRoleId
    // const changeMemberRole = async (member, roleId) => {
    //   routeLocation.value === 'org'
    //     ? await store.dispatch('organization/changeOrgMemberRole', { orgUserId: member.orgUserId, roleId })
    //     : await store.dispatch('group/changeGroupMemberRole', { groupUserId: member.groupUserId, roleId })
    // }

    return {
      pagination,
      routeLocation,
      currentList,
      searchInput,
      headers,
      getRoleName,
      confirmToRemoveMember,
      ROLE_ID,
      confirmToCancelInvitation,
      resetCurrentPage
      // roleLimitList,
      // changeMemberRole,
      // currentRoleId
    }
  }
}
</script>

import { computed } from 'vue'
import { useStore } from 'vuex'
import {
  OgType,
  type Organization,
  type Group,
  type GroupUser,
  type OrgUser,
} from '@frontier/platform-web-sdk'
import { ROLE_ID } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'

export interface Unit {
  orgId: number
  ogType: OgType
  ogId: number
  ogName: string
}

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

export type NonNullableField<T, K extends keyof T> = T &
  NonNullableFields<Pick<T, K>>

export type ActiveOrgUser = NonNullableField<
  OrgUser,
  'orgUserId' | 'userId' | 'orgRoleId' | 'displayName'
>
export type ActiveGroupUser = NonNullableField<
  GroupUser,
  'groupUserId' | 'userId' | 'orgRoleId' | 'groupRoleId' | 'displayName'
>

const useCurrentUnit = () => {
  const store = useStore()
  const { isGroup, ogType } = useNavigation()

  const organization = computed<Organization>(
    () => store.getters['organization/organization']
  )
  const storeGroup = computed<Group>(() => store.getters['group/group'])

  const unit = computed(() => {
    return {
      orgId: organization.value.orgId,
      ogType: ogType.value,
      ogId: isGroup.value ? storeGroup.value.groupId : organization.value.orgId,
      labelColor: isGroup.value
        ? storeGroup.value.labelColor
        : organization.value.labelColor,
      ogName: isGroup.value
        ? storeGroup.value.groupName
        : organization.value.orgName,
      memberList: isGroup.value
        ? storeGroup.value.memberList
        : organization.value.memberList,
      activeMemberList: isGroup.value
        ? (storeGroup.value.memberList.concat(
            organization.value.memberList
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
              .filter((m) => !m.isPending)
          ) as ActiveGroupUser[])
        : (organization.value.memberList.filter((m) => {
            return !m.notificationList
          }) as ActiveOrgUser[]),
    }
  })
  const group = computed(() => (isGroup.value ? storeGroup.value : null))
  const orgUser = computed(() => store.getters['organization/orgUser/orgUser'])

  const defaultWorkspaceNodeId = computed(() =>
    group.value ? group.value.nodeId : organization.value.nodeId
  )

  return {
    isGroup,
    ogType,
    unit,
    organization,
    group,
    orgUser,
    defaultWorkspaceNodeId,
  }
}

export default useCurrentUnit

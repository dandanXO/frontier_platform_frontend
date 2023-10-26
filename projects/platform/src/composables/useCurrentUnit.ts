import { computed } from 'vue'
import { useStore } from 'vuex'
import type {
  Organization,
  Group,
  GroupUser,
  OrgUser,
} from '@frontier/platform-web-sdk'
import { ROLE_ID } from '@/utils/constants'
import useNavigation from '@/composables/useNavigation'

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
  const { isGroup, ogId, ogType } = useNavigation()

  const organization = computed<Organization>(
    () => store.getters['organization/organization']
  )
  const group = computed<Group>(() => store.getters['group/group'])

  const unit = computed(() =>
    isGroup.value ? group.value : organization.value
  )

  return {
    ogId,
    ogType,
    ogName: computed(() =>
      isGroup.value ? group.value.groupName : organization.value.orgName
    ),
    ogLabelColor: computed(() => unit.value.labelColor),
    ogUploadMaterialEmail: computed(() => unit.value.uploadMaterialEmail),
    ogNodeId: computed(() => unit.value.nodeId),
    ogMemberList: computed(() => unit.value.memberList),
    ogActiveMemberList: computed(() =>
      isGroup.value
        ? (group.value.memberList.concat(
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
          }) as ActiveOrgUser[])
    ),
  }
}

export default useCurrentUnit

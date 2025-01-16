<template lang="pug">
div
  div(class="w-85 mx-auto relative")
    p(class="text-right pt-4.5 pb-5 text-caption text-grey-600") *{{ $t('RR0163') }}
    div
      div(class="flex items-center justify-between pb-2")
        div(class="flex text-body2 font-bold items-end")
          i(class="text-red-400 pr-0.5") *
          p(class="text-grey-900") {{ $t('BB0086') }}
          p(
            v-permission="{ FUNC_ID: FUNC_ID.MANAGEMENT_MEMBER_DELETE, behavior: 'deleteElement' }"
            class="font-normal text-caption text-grey-250 cursor-pointer pl-1"
            @click="openModalTypeTextToConfirm"
            data-cy="group-about_delete"
          ) {{ $t('UU0013') }}
        f-tooltip-standard(:tooltipMessage="$t('BB0056')")
          template(#slot:tooltip-trigger)
            div(class="flex items-center" @click="copyGroupId")
              p(class="text-caption text-grey-900 cursor-pointer pr-1.5") ID: {{ groupNo }}
              f-svg-icon(
                iconName="content_copy"
                size="14"
                class="text-grey-600 cursor-pointer"
              )
      div(class="flex gap-x-2 w-85 mb-7.5")
        f-input-text(
          :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
          v-model:textValue="groupFormData.groupName"
          :placeholder="$t('BB0089')"
          :hintError="isGroupNameExist ? $t('WW0001') : !isGroupNameFilled ? $t('WW0002') : ''"
          required
          class="flex-grow"
          data-cy="group-about_name"
        )
        input-label-color(
          v-model:labelColor="groupFormData.labelColor"
          :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
        )
      f-input-text(
        v-model:textValue="groupFormData.address"
        :label="$t('BB0139')"
        :placeholder="$t('BB0140')"
        :hintError="isAddressMoreThan160Characters ? $t('WW0142', { limitNumber: 160 }) : ''"
        class="flex-grow mb-7.5"
        data-cy="group-about_address"
        :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
      )
    f-input-textarea(
      v-model:textValue="groupFormData.description"
      :label="$t('BB0087')"
      :placeholder="$t('BB0088')"
      class="w-85 mb-7.5"
      minHeight="min-h-40"
      :disabled="!permissionList.includes(FUNC_ID.MANAGEMENT_ORG_EDIT)"
    )
    f-button(
      v-permission="{ FUNC_ID: FUNC_ID.MANAGEMENT_MEMBER_EDIT, behavior: 'deleteElement' }"
      size="md"
      class="mx-auto"
      :disabled="!availableToCreateGroup"
      @click="updateGroup"
      data-cy="group-about_save"
    ) {{ $t('UU0018') }}
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, toRaw, ref } from 'vue'
import InputLabelColor from '@/components/management/InputLabelColor.vue'
import { useI18n } from 'vue-i18n'
import { FUNC_ID, NOTIFY_TYPE, PERMISSION_MAP } from '@/utils/constants'
import { useNotifyStore } from '@/stores/notify'
import { copyText } from '@frontier/lib'

export default {
  name: 'GroupAbout',
  components: {
    InputLabelColor,
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const notify = useNotifyStore()
    const group = computed(() => store.getters['group/group'])
    const { groupName, address, labelColor, description, groupId, groupNo } =
      group.value
    const groupFormData = reactive({
      groupName,
      labelColor,
      description,
      address,
    })
    const roleId = store.getters['organization/orgUser/orgUser'].roleID
    const permissionList = ref(PERMISSION_MAP[roleId])
    const isGroupNameExist = computed(() =>
      store.getters['organization/groupList'].some(
        (group) =>
          group.groupId !== groupId &&
          group.groupName === groupFormData.groupName
      )
    )
    const isGroupNameFilled = computed(
      () =>
        (!!groupFormData.groupName && groupFormData.groupName.length > 0) ||
        groupFormData.groupName === ''
    )
    const availableToCreateGroup = computed(
      () =>
        !!groupFormData.groupName &&
        !isGroupNameExist.value &&
        !isAddressMoreThan160Characters.value
    )
    const isAddressMoreThan160Characters = computed(
      () => !!groupFormData.address && groupFormData.address.length > 160
    )
    const updateGroup = async () => {
      await store.dispatch('group/updateGroup', toRaw(groupFormData))
      notify.showNotifySnackbar({ messageText: t('BB0107') })
    }

    const openModalTypeTextToConfirm = () => {
      store.dispatch('helper/openModalBehavior', {
        component: 'modal-type-text-to-confirm',
        properties: {
          title: t('BB0028'),
          keypath: 'BB0099',
          slotName: 'groupName',
          slotValue: group.value.groupName,
          errorMsg: t('WW0026'),
          confirmHandler: () => {
            store.dispatch('helper/openModalConfirm', {
              type: NOTIFY_TYPE.WARNING,
              header: t('BB0100'),
              contentText: t('BB0101'),
              primaryBtnText: t('UU0001'),
              afterPrimaryBtnHandler: () => {
                store.dispatch('helper/openModalBehavior', {
                  component: 'modal-choose-storage',
                })
              },
              secondaryBtnText: t('UU0002'),
            })
          },
        },
      })
    }

    const copyGroupId = () => {
      copyText(groupNo)
      notify.showNotifySnackbar({ messageText: t('BB0038') })
    }

    return {
      permissionList,
      groupFormData,
      isGroupNameExist,
      availableToCreateGroup,
      updateGroup,
      openModalTypeTextToConfirm,
      copyText,
      groupNo,
      copyGroupId,
      isGroupNameFilled,
      FUNC_ID,
      isAddressMoreThan160Characters,
    }
  },
}
</script>

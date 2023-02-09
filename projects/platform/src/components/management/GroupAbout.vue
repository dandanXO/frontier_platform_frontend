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
            class="font-normal text-caption text-grey-250 cursor-pointer pl-1"
            @click="openModalTypeTextToConfirm"
            data-cy="group-about_delete"
          ) {{ $t('UU0013') }}
        f-tooltip
          template(#trigger)
            div(
              class="flex items-center"
              @click="copyText(groupNo), $store.dispatch('helper/pushFlashMessage', $t('BB0038'))"
            )
              p(class="text-caption text-grey-900 cursor-pointer pr-1.5") ID: {{ groupNo }}
              f-svg-icon(
                iconName="content_copy"
                size="14"
                class="text-grey-600 cursor-pointer"
              )
          template(#content)
            p {{ $t('BB0056') }}
      div(class="flex gap-x-2 w-85 mb-7.5")
        f-input-text(
          v-model:textValue="groupFormData.groupName"
          :placeholder="$t('BB0089')"
          :hintError="isGroupNameExist ? $t('WW0001') : ''"
          required
          class="flex-grow"
          data-cy="group-about_name"
        )
        input-label-color(v-model:labelColor="groupFormData.labelColor")
    f-input-textarea(
      v-model:textValue="groupFormData.description"
      :label="$t('BB0087')"
      :placeholder="$t('BB0088')"
      class="w-85 mb-7.5"
      minHeight="min-h-40"
    )
    f-button(
      size="md"
      class="mx-auto"
      :disabled="!availableToCreateGroup"
      @click="updateGroup"
      data-cy="group-about_save"
    ) {{ $t('UU0018') }}
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, toRaw } from 'vue'
import InputLabelColor from '@/components/management/InputLabelColor.vue'
import { useI18n } from 'vue-i18n'
import copyText from '@/utils/copy-text'

export default {
  name: 'GroupAbout',
  components: {
    InputLabelColor,
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const group = computed(() => store.getters['group/group'])
    const { groupName, labelColor, description, groupId, groupNo } = group.value
    const groupFormData = reactive({ groupName, labelColor, description })
    const isGroupNameExist = computed(() =>
      store.getters['organization/groupList'].some(
        (group) =>
          group.groupId !== groupId &&
          group.groupName === groupFormData.groupName
      )
    )
    const availableToCreateGroup = computed(
      () => groupFormData.groupName !== '' && !isGroupNameExist.value
    )

    const updateGroup = async () => {
      await store.dispatch('group/updateGroup', toRaw(groupFormData))
      store.dispatch('helper/pushFlashMessage', t('BB0107'))
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
              type: 1,
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

    return {
      groupFormData,
      isGroupNameExist,
      availableToCreateGroup,
      updateGroup,
      openModalTypeTextToConfirm,
      copyText,
      groupNo,
    }
  },
}
</script>

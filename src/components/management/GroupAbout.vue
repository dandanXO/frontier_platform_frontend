<template lang="pug">
div
  div(class="w-85 mx-auto relative")
    p(class="text-right pt-4.5 pb-5 text-caption text-black-600") *{{ $t('RR0163') }}
    div
      div(class="flex items-center justify-between pb-2")
        div(class="flex text-body2 font-bold items-end")
          i(class="text-warn pr-0.5") *
          p(class="text-primary") {{ $t('BB0086') }}
          p(class="font-normal text-caption text-black-500 cursor-pointer pl-1" @click="openModalTypeTextToConfirm") {{ $t("UU0013") }}
        div(class="flex items-center cursor-pointer" @click="copyText(groupNo), $store.commit('helper/PUSH_message', $t('BB0038'))")
          p(class="text-caption text-primary") ID: {{ groupNo }}
          tooltip(placement="bottom")
            template(#trigger)
              svg-icon(iconName="content_copy" size="14" class="text-black-700")
            template(#content)
              p(class="text-caption text-primary px-3 py-1") {{ $t("BB0056") }}
      input-label-color(
        v-model:labelColor="groupFormData.labelColor"
        v-model:textValue="groupFormData.groupName"
        :placeholder="$t('BB0089')"
        :customErrorMsg="isGroupNameExist ? $t('WW0001') : ''"
        required
        class="w-85 relative z-11 mb-7.5"
      )
    input-textarea(v-model:textValue="groupFormData.description" :label="$t('BB0087')" :placeholder="$t('BB0088')" class="w-85 mb-7.5" height="160")
    btn(size="md" class="mx-auto" :disabled="!availableToCreateGroup" @click="updateGroup") {{ $t("UU0018") }}
</template>

<script>
import { useStore } from 'vuex'
import { computed, reactive, toRaw } from 'vue'
import InputLabelColor from '@/components/InputLabelColor.vue'
import { useI18n } from 'vue-i18n'
import copyText from '@/utils/copy-text'

export default {
  name: 'GroupAbout',
  components: {
    InputLabelColor
  },
  setup () {
    const { t } = useI18n()
    const store = useStore()
    const group = computed(() => store.getters['group/group'])
    const { groupName, labelColor, description, groupId, groupNo } = group.value
    const groupFormData = reactive({ groupName, labelColor, description })
    const isGroupNameExist = computed(() => store.getters['organization/groupList'].some(group => (group.groupId !== groupId) && (group.groupName === groupFormData.groupName)))
    const availableToCreateGroup = computed(() => groupFormData.groupName !== '' && !isGroupNameExist.value)

    const updateGroup = async () => {
      await store.dispatch('group/updateGroup', toRaw(groupFormData))
      store.commit('helper/PUSH_message', t('BB0107'))
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
              content: t('BB0101'),
              primaryBtnText: t('UU0001'),
              afterPrimaryBtnHandler: async () => {
                await store.dispatch('helper/openModalBehavior', {
                  component: 'modal-choose-storage'
                })
              },
              secondaryBtnText: t('UU0002')
            })
          }
        }
      })
    }

    return {
      groupFormData,
      isGroupNameExist,
      availableToCreateGroup,
      updateGroup,
      openModalTypeTextToConfirm,
      copyText,
      groupNo
    }
  }
}
</script>

<template lang="pug">
div(class='w-101 text-primary')
  div(class='mb-7 text-center text-h6 font-bold') {{$t('EE0054')}}
  div(class='mx-8 mb-4 text-center text-body2 line-height-1.6') {{$t('EE0055')}}
  overlay-scrollbar-container(class="max-h-65")
    div(class='px-12 flex flex-col gap-4')
      div(
        v-for='option in targetOrgAndGroup'
        :index='option.index'
        class='flex items-center'
      )
        input-checkbox(v-model:inputValue='targetIndexList' :value='option.index')
        div(class='pl-1') {{option.name}}
  div(class="h-25 flex justify-center items-center")
    btn(size="md" :disabled='targetIndexList.length === 0' @click="submit") {{$t('UU0034')}}
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'ModalCloneTo',
  props: {
    materialIdList: {
      type: Array
    }
  },
  setup (props) {
    const store = useStore()
    const TARGET_TYPE = {
      ORG: 1,
      GROUP: 2
    }
    const targetIndexList = ref([])
    const organization = computed(() => store.getters['organization/organization'])
    const routeLocation = computed(() => store.getters['helper/routeLocation'])
    const currentGroupId = computed(() => store.getters['group/groupId'])
    const groupList = computed(() => {
      return routeLocation.value === 'org'
        ? store.getters['organization/groupList']
        : store.getters['organization/groupList'].filter(group => group.groupId !== currentGroupId.value)
    })

    const targetOrgAndGroup = computed(() => {
      const { orgId, orgName } = organization.value
      let index = 0
      const arr = []

      if (routeLocation.value === 'group') {
        arr.push({
          index,
          id: orgId,
          name: orgName,
          type: TARGET_TYPE.ORG
        })
      }

      groupList.value.forEach(group => {
        const { groupId, groupName } = group
        index++
        arr.push({
          index,
          id: groupId,
          name: groupName,
          type: TARGET_TYPE.GROUP
        })
      })

      return arr
    })

    const submit = async () => {
      const targetIdList = []
      targetOrgAndGroup.value.forEach(target => {
        if (targetIndexList.value.includes(target.index)) {
          targetIdList.push({ id: target.id, type: target.type })
        }
      })
      store.dispatch('helper/openModalLoading')
      await store.dispatch('assets/cloneMaterial', { targetIdList, materialIdList: props.materialIdList })
      store.dispatch('helper/closeModalLoading')
    }

    return {
      targetOrgAndGroup,
      targetIndexList,
      submit
    }
  }
}
</script>

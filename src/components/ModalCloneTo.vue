<template lang="pug">
div(class="w-101 text-primary")
  div(class="mb-7.5 text-center text-h6 font-bold") {{$t("RR0158")}}
  div(class="mx-8 mb-4 text-center text-body2 line-height-1.6") {{$t("EE0055")}}
  overlay-scrollbar-container(class="max-h-65")
    div(class="px-12 flex flex-col gap-4")
      div(
        v-for="option in locationList"
        :index="option.index"
        class="flex items-center"
      )
        input-checkbox(v-model:inputValue="selectedLocationList" :value="`${option.location}-${option.id}`")
        div(class="pl-1") {{option.name}}
  div(class="h-25 flex justify-center items-center")
    btn(size="md" :disabled="selectedLocationList.length === 0" @click="submit") {{$t("UU0034")}}
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ModalCloneTo',
  props: {
    locationList: {
      type: Array,
      required: true
    },
    cloneHandler: {
      type: Function,
      required: true
    }
  },
  setup (props) {
    const selectedLocationList = ref([])

    const submit = async () => {
      const targetLocationList = selectedLocationList.value.map(item => {
        const [location, id] = item.split('-')
        return {
          id: Number(id),
          location: Number(location)
        }
      })
      await props.cloneHandler(targetLocationList)
    }

    return {
      selectedLocationList,
      submit
    }
  }
}
</script>

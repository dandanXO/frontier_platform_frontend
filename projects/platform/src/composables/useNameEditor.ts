import { ref, unref, type Ref, computed } from 'vue'

const useNameEditor = (originName: Ref<string> | string) => {
  const isEditingName = ref(false)
  const currentName = ref('')

  const isNameValid = computed(() => {
    if (!currentName.value) {
      return false
    }
    if (currentName.value.length === 0) {
      return false
    }
    if (currentName.value === unref(originName)) {
      return false
    }

    return true
  })

  const startEdit = () => {
    isEditingName.value = true
    currentName.value = unref(originName)
  }

  const doneEdit = () => {
    isEditingName.value = false
    currentName.value = ''
  }

  return {
    isEditingName,
    currentName,
    isNameValid,
    startEdit,
    doneEdit,
  }
}

export default useNameEditor

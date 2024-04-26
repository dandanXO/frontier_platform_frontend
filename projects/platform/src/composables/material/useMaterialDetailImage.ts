import { ref } from 'vue'

const currentCoverIndex = ref(0)
export function useCurrentCoverIndex() {
  const setCurrentCoverIndex = (index: number) => {
    currentCoverIndex.value = index
  }

  return {
    currentCoverIndex,
    setCurrentCoverIndex,
  }
}

const currentDisplayIndex = ref(0)
export function useCurrentDisplayIndex() {
  const setCurrentDisplayIndex = (index: number) => {
    currentDisplayIndex.value = index
  }

  return {
    currentDisplayIndex,
    setCurrentDisplayIndex,
  }
}

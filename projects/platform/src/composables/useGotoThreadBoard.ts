import { useRouter } from 'vue-router'
import useNavigation from '@/composables/useNavigation'
import useThreadBoardStore from '@/stores/threadBoard'

const useGotoThreadBoard = () => {
  const router = useRouter()
  const { parsePath, prefixPath } = useNavigation()
  const threadBoardStore = useThreadBoardStore()

  return async (digitalThreadSideId: number) => {
    await router.push(parsePath(`${prefixPath.value}/thread-board`))
    threadBoardStore.activateThreadCard(digitalThreadSideId)
  }
}

export default useGotoThreadBoard

import { computed, unref } from 'vue'
import { useRoute } from 'vue-router'
import type { Ref } from 'vue'

type LocationList = string[] | null

const useStickerLocationList = (
  locationList: Ref<LocationList> | LocationList
) => {
  const route = useRoute()
  const drawerOpenFromLocationList = computed(() => {
    let resultList = unref(locationList)

    // 在 public library 第一層 的 material node location 後端回應 null，為了維持資料一致性使用空陣列
    if (!resultList) return []

    // 若路徑不是 embed, received-share，material node location 或是 material detail breadcrumb 不會包含 location type
    // => 去除陣列第一個元素
    if (!route.path.match(/embed|received-share/)) {
      resultList = resultList.slice(1)
    }
    // 從 material node location 或是 material detail breadcrumb 包含 materialNo
    // 但是 digital thread 的 created from 不需要紀錄 => 去除陣列最後一個元素
    return resultList.slice(0, -1)
  })

  return drawerOpenFromLocationList
}

export default useStickerLocationList

import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { EXTENSION } from '@/utils/constants'
import {
  NOTIFY_TYPE,
  downloadDataURLFile,
  getFileExtension,
  getFileNameExcludeExtension,
} from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import type { MultimediaCreateItem } from '@/types'
import { getPreviewUrl } from '@/utils/pdf'

const useMultimediaCreate = () => {
  const { t } = useI18n()
  const store = useStore()

  const multimediaList = reactive<MultimediaCreateItem[]>([])

  const openModalMultimediaSelect = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-upload-attachment',
      properties: {
        uploadHandler: async (fileList: File[]) => {
          const toMultimedia = async (file: File) => {
            const extension = getFileExtension(file.name) as EXTENSION
            const originalUrl = URL.createObjectURL(file)
            const thumbnailUrl = await (extension === EXTENSION.PDF
              ? getPreviewUrl(URL.createObjectURL(file))
              : Promise.resolve(originalUrl))

            return {
              id: uuidv4(),
              file,
              originalUrl,
              thumbnailUrl,
              extension,
              displayFileName: file.name,
              displayFileNameExcludeExtension: getFileNameExcludeExtension(
                file.name
              ),
              isCover: false,
              croppedImage: null,
            }
          }

          const newMultimediaList = await Promise.all(
            fileList.map(toMultimedia)
          )
          multimediaList.push(...newMultimediaList)
        },
      },
    })
  }

  const openModalPreviewMultimedia = (openIndex: number) => {
    store.dispatch('helper/pushModal', {
      component: 'modal-preview-file',
      header: t('DD0060'),
      properties: {
        fileList: multimediaList,
        index: openIndex,
        getMenuTree: getMultimediaMenuTree,
        onRename: (index: number) => renameMultimediaSelect(index),
        onRemove: (index: number) => removeMultimediaSelect(index),
      },
    })
  }

  const downloadMultimediaSelect = (index: number) => {
    const target = multimediaList[index]
    downloadDataURLFile(target.originalUrl, target.displayFileName)
  }

  const removeMultimediaSelect = (index: number) => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('DD0068'),
      contentText: t('DD0069'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: async () => {
        const target = multimediaList[index]
        URL.revokeObjectURL(target.originalUrl)
        URL.revokeObjectURL(target.thumbnailUrl)
        multimediaList.splice(index, 1)
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const renameMultimediaSelect = (index: number) => {
    const target = multimediaList[index]
    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-rename-file',
      properties: {
        fileName: target.displayFileNameExcludeExtension,
        onSubmit: (newFileNameExcludeExtension: string) => {
          target.displayFileNameExcludeExtension = newFileNameExcludeExtension
          target.displayFileName = `${newFileNameExcludeExtension}.${target.extension}`
        },
      },
    })
  }

  const updateMultimediaList = (list: MultimediaCreateItem[]) => {
    multimediaList.splice(0, multimediaList.length, ...list)
  }

  const setMultimediaAsCover = (targetIndex: number) => {
    multimediaList.forEach((multimedia, index) => {
      if (index === targetIndex) {
        multimedia.isCover = !multimedia.isCover
      } else {
        multimedia.isCover = false
      }
    })
  }

  const getMultimediaMenuTree = (index: number): MenuTree => {
    const target = multimediaList[index]
    return {
      width: 'w-44',
      blockList: [
        {
          menuList: (() => {
            const menuList = [
              {
                title: 'Download',
                icon: 'download',
                clickHandler: () => downloadMultimediaSelect(index),
              },
              {
                title: 'Rename',
                icon: 'create',
                clickHandler: () => renameMultimediaSelect(index),
              },
            ]
            if (target.extension === EXTENSION.PDF) {
              menuList.unshift({
                title: 'Open new page',
                icon: 'open_in_new',
                clickHandler: () => window.open(target.originalUrl, '_blank'),
              })
            }
            return menuList
          })(),
        },
        {
          menuList: [
            {
              title: 'Delete',
              icon: 'delete',
              clickHandler: () => removeMultimediaSelect(index),
            },
          ],
        },
      ],
    }
  }

  return {
    multimediaList,
    getMultimediaMenuTree,
    openModalMultimediaSelect,
    openModalPreviewMultimedia,
    downloadMultimediaSelect,
    renameMultimediaSelect,
    removeMultimediaSelect,
    updateMultimediaList,
    setMultimediaAsCover,
  }
}

export default useMultimediaCreate

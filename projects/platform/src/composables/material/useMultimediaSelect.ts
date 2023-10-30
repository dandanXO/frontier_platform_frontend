import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { EXTENSION } from '@/utils/constants'
import {
  NOTIFY_TYPE,
  downloadFile,
  getFileExtension,
  getFileNameExcludeExtension,
} from '@frontier/lib'
import type { CropAssetsMaterialMultimediaRequestAllOfCroppedImage } from '@frontier/platform-web-sdk'
import type { MenuTree } from '@frontier/ui-component'

export interface Multimedia {
  id: string
  file: File
  url: string
  displayFileName: string
  extension: EXTENSION
  displayFileNameExcludeExtension: string
  isCover: boolean
  croppedImage: CropAssetsMaterialMultimediaRequestAllOfCroppedImage | null
}

const useMultimediaSelect = () => {
  const { t } = useI18n()
  const store = useStore()

  const multimediaList = reactive<Multimedia[]>([])

  const openModalMultimediaSelect = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-upload-attachment',
      properties: {
        uploadHandler: async (fileList: File[]) => {
          const toMultimedia = (file: File) => ({
            id: uuidv4(),
            file,
            url: URL.createObjectURL(file),
            displayFileName: file.name,
            extension: getFileExtension(file.name) as EXTENSION,
            displayFileNameExcludeExtension: getFileNameExcludeExtension(
              file.name
            ),
            isCover: false,
            croppedImage: null,
          })
          multimediaList.push(...fileList.map(toMultimedia))

          // if (isEditMode) {
          //   await store.dispatch('assets/uploadAttachmentWhenUpdate', {
          //     file,
          //     displayFileName,
          //   })
          // } else {
          //   await store.dispatch('assets/uploadAttachmentWhenCreate', {
          //     tempMaterialId: props.tempMaterialId,
          //     file,
          //     displayFileName,
          //   })
          // }
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
    downloadFile(target.url, target.displayFileName)
  }

  const removeMultimediaSelect = (index: number) => {
    store.dispatch('helper/openModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('DD0068'),
      contentText: t('DD0069'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: async () => {
        const target = multimediaList[index]
        URL.revokeObjectURL(target.url)
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

  const updateMultimediaList = (list: Multimedia[]) => {
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
                clickHandler: () => window.open(target.url, '_blank'),
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

export default useMultimediaSelect

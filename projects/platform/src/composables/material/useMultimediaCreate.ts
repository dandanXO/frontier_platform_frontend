import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { THEME } from '@/utils/constants'
import {
  NOTIFY_TYPE,
  downloadDataURLFile,
  getFileExtension,
  getFileNameExcludeExtension,
} from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import type { MultimediaCreateItem } from '@/types'
import { getPreviewUrl } from '@/utils/pdf'
import { image2Object } from '@/utils/cropper'
import { type CropImageRecord, Extension } from '@frontier/platform-web-sdk'

const useMultimediaCreate = () => {
  const { t } = useI18n()
  const store = useStore()

  const multimediaList = reactive<MultimediaCreateItem[]>([])

  const getMultimediaById = (id: string): MultimediaCreateItem | undefined => {
    return multimediaList.find((file) => file.id === id)
  }

  const openModalMultimediaSelect = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-upload-attachment',
      properties: {
        uploadHandler: async (fileList: File[]) => {
          const toMultimedia = async (
            file: File
          ): Promise<MultimediaCreateItem> => {
            const extension = getFileExtension(file.name)
            const originalUrl = URL.createObjectURL(file)
            const thumbnailUrl = await (extension === Extension.PDF
              ? getPreviewUrl(URL.createObjectURL(file))
              : Promise.resolve(originalUrl))

            return {
              id: uuidv4(),
              file,
              originalUrl,
              displayUrl: originalUrl,
              thumbnailUrl,
              extension,
              displayFileName: file.name,
              displayFileNameExcludeExtension: getFileNameExcludeExtension(
                file.name
              ),
              isCover: false,
              croppedImage: null,
              cropRecord: null,
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

  const downloadMultimediaSelect = (id: string) => {
    const target = getMultimediaById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }
    downloadDataURLFile(target.originalUrl, target.displayFileName)
  }

  const removeMultimediaSelect = (id: string, theme: THEME) => {
    store.dispatch('helper/pushModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      theme,
      header: t('DD0068'),
      contentText: t('DD0069'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: async () => {
        const target = getMultimediaById(id)
        if (!target) {
          throw new Error('Multimedia not found')
        }
        URL.revokeObjectURL(target.originalUrl)
        URL.revokeObjectURL(target.thumbnailUrl)

        const targetIndex = multimediaList.findIndex((m) => m.id === id)
        multimediaList.splice(targetIndex, 1)
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const renameMultimediaSelect = (id: string, theme: THEME) => {
    const target = getMultimediaById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }
    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-rename-file',
      properties: {
        theme,
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

  const setMultimediaAsCover = (id: string) => {
    multimediaList.forEach((multimedia) => {
      if (multimedia.id === id) {
        multimedia.isCover = !multimedia.isCover
      } else {
        multimedia.isCover = false
      }
    })
  }

  const startCropMultimedia = async (id: string) => {
    const target = getMultimediaById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }

    const image = await image2Object(target.originalUrl)
    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-crop-image',
      properties: {
        title: 'Edit Image',
        image,
        cropRectSize: 200,
        cropRecord: target.cropRecord,
        afterCropHandler: async (
          croppedImageFile: File,
          _originalImage: File,
          cropRecord: CropImageRecord
        ) => {
          target.croppedImage = croppedImageFile
          target.cropRecord = cropRecord
          if (target.thumbnailUrl !== target.originalUrl) {
            URL.revokeObjectURL(target.thumbnailUrl)
          }
          target.thumbnailUrl = URL.createObjectURL(croppedImageFile)
        },
      },
    })
  }

  const getMultimediaMenuTree = (id: string, theme = THEME.LIGHT): MenuTree => {
    const target = getMultimediaById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }
    return {
      width: 'w-44',
      blockList: [
        {
          menuList: (() => {
            const menuList = [
              {
                title: t('RR0303'),
                icon: 'download',
                clickHandler: () => downloadMultimediaSelect(id),
              },
              {
                title: t('RR0302'),
                icon: 'create',
                clickHandler: () => renameMultimediaSelect(id, theme),
              },
            ]
            if (target.extension === Extension.PDF) {
              menuList.unshift({
                title: t('RR0304'),
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
              title: t('RR0063'),
              icon: 'delete',
              clickHandler: () => removeMultimediaSelect(id, theme),
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
    downloadMultimediaSelect,
    renameMultimediaSelect,
    removeMultimediaSelect,
    updateMultimediaList,
    startCropMultimedia,
    setMultimediaAsCover,
  }
}

export default useMultimediaCreate

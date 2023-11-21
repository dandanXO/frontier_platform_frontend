import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { EXTENSION, THEME } from '@/utils/constants'
import {
  NOTIFY_TYPE,
  downloadDataURLFile,
  getFileExtension,
  getFileNameExcludeExtension,
} from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import { getPreviewUrl } from '@/utils/pdf'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import {
  CoverMode,
  type Material,
  type MultimediaFile,
} from '@frontier/platform-web-sdk'

const useMultimediaUpdate = (material: Ref<Material>) => {
  const { t } = useI18n()
  const store = useStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)

  const coverImage = computed(() => {
    return material.value.coverImage
  })

  const multimediaList = computed(() => {
    return material.value.multimediaList
  })

  const coverAndSideImageList = computed(() => {
    const { coverImage, faceSide, backSide } = material.value

    const list: Array<{
      id:
        | 'cover'
        | 'faceSide'
        | 'faceSideRuler'
        | 'backSide'
        | 'backSideRuler'
        | number
      displayUrl: string | null
      thumbnailUrl: string | null
      imgName: string | null
      caption: string | null
    }> = [
      {
        id: 'cover',
        displayUrl: coverImage?.displayUrl ?? null,
        thumbnailUrl: coverImage?.thumbnailUrl ?? null,
        imgName: t('RR0081'),
        caption: null,
      },
      {
        id: 'faceSide',
        displayUrl: faceSide?.sideImage?.displayUrl ?? null,
        thumbnailUrl: faceSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0075'),
        caption: null,
      },
      {
        id: 'faceSideRuler',
        displayUrl: faceSide?.sideImage?.rulerUrl ?? null,
        thumbnailUrl: faceSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0075'),
        caption: t('RR0080'),
      },
      {
        id: 'backSide',
        displayUrl: backSide?.sideImage?.displayUrl ?? null,
        thumbnailUrl: backSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0078'),
        caption: null,
      },
      {
        id: 'backSideRuler',
        displayUrl: backSide?.sideImage?.rulerUrl ?? null,
        thumbnailUrl: backSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0078'),
        caption: t('RR0080'),
      },
    ]
    // return material.value.coverImage.
    return list
  })

  const getMultimediaById: (fileId: number) => MultimediaFile | undefined = (
    fileId: number
  ) => {
    return multimediaList.value.find((file) => file.fileId === fileId)
  }

  // const openModalMultimediaSelect = () => {
  //   store.dispatch('helper/openModalBehavior', {
  //     component: 'modal-upload-attachment',
  //     properties: {
  //       uploadHandler: async (fileList: File[]) => {
  //         const toMultimedia = async (file: File) => {
  //           const extension = getFileExtension(file.name) as EXTENSION
  //           const objectUrl = await (extension === EXTENSION.PDF
  //             ? getPreviewUrl(URL.createObjectURL(file))
  //             : Promise.resolve(URL.createObjectURL(file)))

  //           return {
  //             id: uuidv4(),
  //             file,
  //             objectUrl,
  //             displayFileName: file.name,
  //             extension,
  //             displayFileNameExcludeExtension: getFileNameExcludeExtension(
  //               file.name
  //             ),
  //             isCover: false,
  //             croppedImage: null,
  //           }
  //         }

  //         const newMultimediaList = await Promise.all(
  //           fileList.map(toMultimedia)
  //         )
  //         multimediaList.push(...newMultimediaList)
  //       },
  //     },
  //   })
  // }

  // const openModalPreviewMultimedia = (openIndex: number) => {
  //   store.dispatch('helper/pushModal', {
  //     component: 'modal-preview-file',
  //     header: t('DD0060'),
  //     properties: {
  //       fileList: multimediaList,
  //       index: openIndex,
  //       getMenuTree: getMultimediaMenuTree,
  //       onRename: (index: number) => renameMultimediaSelect(index),
  //       onRemove: (index: number) => removeMultimediaSelect(index),
  //     },
  //   })
  // }

  const downloadMultimediaSelect = (id: number) => {
    const target = getMultimediaById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }

    downloadDataURLFile(target.originalUrl, target.displayFileName)
  }

  const removeMultimediaSelect = (id: number, theme: THEME) => {
    store.dispatch('helper/openModalConfirm', {
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

        ogBaseAssetsApi('removeAssetsMaterialMultimedia', {
          materialId,
          fileId: target.fileId,
        })
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const renameMultimediaSelect = (id: number, theme: THEME) => {
    const target = getMultimediaById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }

    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-rename-file',
      properties: {
        theme,
        fileName: getFileNameExcludeExtension(target.displayFileName),
        onSubmit: (newFileNameExcludeExtension: string) => {
          ogBaseAssetsApi('renameAssetsMaterialMultimedia', {
            materialId: material,
            fileId: target.fileId,
            displayFileName: `${newFileNameExcludeExtension}.${target.extension}`,
          })
        },
      },
    })
  }

  const updateMultimediaList = (list: MultimediaFile[]) => {
    multimediaList.value.splice(0, multimediaList.value.length, ...list)
  }

  const setMultimediaAsCover = (id: number) => {
    const target = getMultimediaById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }

    ogBaseAssetsApi('setAssetsMaterialCover', {
      materialId,
      multimediaFileList: target.fileId,
      coverMode: CoverMode.MULTI_MEDIA,
    })
  }

  const getMultimediaMenuTree = (id: number, theme = THEME.LIGHT): MenuTree => {
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
                title: 'Download',
                icon: 'download',
                clickHandler: () => downloadMultimediaSelect(id),
              },
              {
                title: 'Rename',
                icon: 'create',
                clickHandler: () => renameMultimediaSelect(id, theme),
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
              clickHandler: () => removeMultimediaSelect(id, theme),
            },
          ],
        },
      ],
    }
  }

  return {
    multimediaList,
    coverAndSideImageList,
    getMultimediaMenuTree,
    // openModalMultimediaSelect,
    // openModalPreviewMultimedia,
    downloadMultimediaSelect,
    renameMultimediaSelect,
    removeMultimediaSelect,
    updateMultimediaList,
    setMultimediaAsCover,
  }
}

export default useMultimediaUpdate

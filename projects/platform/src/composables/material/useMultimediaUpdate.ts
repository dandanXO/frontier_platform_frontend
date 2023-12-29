import { computed, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { THEME } from '@/utils/constants'
import {
  NOTIFY_TYPE,
  downloadDataURLFile,
  getFileNameExcludeExtension,
} from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import {
  CoverMode,
  Extension,
  type CropImageRecord,
  type Material,
  type MultimediaFile,
} from '@frontier/platform-web-sdk'
import { uploadFileToS3 } from '@/utils/fileUpload'
import { image2Object } from '@/utils/cropper'
import type { CoverId, MaterialFileId, SquareCropRecord } from '@/types'
import { useNotifyStore } from '@/stores/notify'

const useMultimediaUpdate = (
  material: Ref<Material>,
  updatePantoneList: ({
    faceSidePantoneNameList,
    backSidePantoneNameList,
  }: {
    faceSidePantoneNameList: string[] | null
    backSidePantoneNameList: string[] | null
  }) => void
) => {
  const { t } = useI18n()
  const store = useStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)
  const notify = useNotifyStore()

  const selectedCoverId = ref<CoverId | null>(null)

  const multimediaList = computed(() => material.value.multimediaList)

  const coverAndSideImageList = computed(() => {
    const { coverImage, faceSide, backSide, digitalDrape } = material.value
    const list: Array<{
      id: MaterialFileId
      displayUrl: string | null
      thumbnailUrl: string | null
      imgName: string | null
      caption: string | null
      isCoverDisplay: boolean
      isCover: boolean
      canSetCover: boolean
      extension: Extension
    }> = [
      {
        id: 'cover',
        displayUrl: coverImage.displayUrl ?? null,
        thumbnailUrl: coverImage.thumbnailUrl ?? null,
        imgName: t('RR0081'),
        caption: null,
        isCoverDisplay: true,
        isCover: false,
        canSetCover: false,
        extension: Extension.JPG,
      },
      {
        id: 'faceSide',
        displayUrl: faceSide?.sideImage?.displayUrl ?? null,
        thumbnailUrl: faceSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0075'),
        caption: null,
        isCoverDisplay: false,
        isCover: (() => {
          if (selectedCoverId.value != null) {
            return selectedCoverId.value === 'faceSide'
          }
          return coverImage.mode === CoverMode.FACE
        })(),
        canSetCover: true,
        extension: Extension.JPG,
      },
      {
        id: 'faceSideRuler',
        displayUrl: faceSide?.sideImage?.rulerUrl ?? null,
        thumbnailUrl: faceSide?.sideImage?.rulerThumbnailUrl ?? null,
        imgName: t('RR0075'),
        caption: t('RR0080'),
        isCoverDisplay: false,
        isCover: false,
        canSetCover: false,
        extension: Extension.JPG,
      },
      {
        id: 'backSide',
        displayUrl: backSide?.sideImage?.displayUrl ?? null,
        thumbnailUrl: backSide?.sideImage?.thumbnailUrl ?? null,
        imgName: t('RR0078'),
        caption: null,
        isCoverDisplay: false,
        isCover: (() => {
          if (selectedCoverId.value != null) {
            return selectedCoverId.value === 'backSide'
          }
          return coverImage.mode === CoverMode.BACK
        })(),
        canSetCover: true,
        extension: Extension.JPG,
      },
      {
        id: 'backSideRuler',
        displayUrl: backSide?.sideImage?.rulerUrl ?? null,
        thumbnailUrl: backSide?.sideImage?.rulerThumbnailUrl ?? null,
        imgName: t('RR0078'),
        caption: t('RR0080'),
        isCoverDisplay: false,
        isCover: false,
        canSetCover: false,
        extension: Extension.JPG,
      },
    ]

    if (digitalDrape) {
      list.push({
        id: 'digitalDrape',
        displayUrl: digitalDrape.displayUrl,
        thumbnailUrl: digitalDrape.thumbnailUrl,
        imgName: t('MI0136'),
        caption: t('MI0137'),
        isCoverDisplay: false,
        isCover: (() => {
          if (selectedCoverId.value != null) {
            return selectedCoverId.value === 'digitalDrape'
          }
          return coverImage.mode === CoverMode.DIGITAL_DRAPE
        })(),
        canSetCover: true,
        extension: Extension.JPG,
      })
    }

    return list
  })

  const getMultimediaById = (fileId: number): MultimediaFile | undefined => {
    return material.value.multimediaList.find((file) => file.fileId === fileId)
  }

  const openModalMultimediaSelect = () => {
    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-upload-attachment',
      properties: {
        uploadHandler: async (fileList: File[]) => {
          store.dispatch('helper/pushModalLoading')

          const s3FileList = await Promise.all(
            fileList.map((file) => uploadFileToS3(file, file.name))
          )

          const res = await ogBaseAssetsApi('uploadAssetsMaterialMultimedia', {
            materialId: material.value.materialId,
            multimediaList: s3FileList.map((file) => {
              {
                return {
                  s3UploadId: file.s3UploadId,
                  fileName: file.fileName,
                  displayFileName: file.fileName,
                }
              }
            }),
          })

          material.value.multimediaList = res.data.result.multimediaList
          store.dispatch('helper/closeModalLoading')
        },
      },
    })
  }

  const downloadMultimediaSelect = (id: number) => {
    const target = getMultimediaById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }

    downloadDataURLFile(target.originalUrl, target.displayFileName)
  }

  const removeMultimediaSelect = (id: number, theme: THEME) => {
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
        store.dispatch('helper/pushModalLoading', { theme })
        const res = await ogBaseAssetsApi('removeAssetsMaterialMultimedia', {
          materialId: material.value.materialId,
          fileId: target.fileId,
        })
        material.value.multimediaList = res.data.result.multimediaList
        store.dispatch('helper/closeModalLoading')
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
        onSubmit: async (newFileNameExcludeExtension: string) => {
          store.dispatch('helper/pushModalLoading', { theme })
          const res = await ogBaseAssetsApi('renameAssetsMaterialMultimedia', {
            materialId: material.value.materialId,
            fileId: target.fileId,
            displayFileName: `${newFileNameExcludeExtension}.${target.extension}`,
          })
          material.value.multimediaList = res.data.result.multimediaList
          store.dispatch('helper/closeModalLoading')
        },
      },
    })
  }

  const moveMultimedia = async (fileId: number, newIndex: number) => {
    store.dispatch('helper/pushModalLoading')
    const target = getMultimediaById(fileId)
    if (!target) {
      throw new Error('attachment not found')
    }

    const res = await ogBaseAssetsApi('moveAssetsMaterialMultimedia', {
      materialId: material.value.materialId,
      fileId,
      targetFileId:
        material.value.multimediaList[
          newIndex === 0 ? newIndex + 1 : newIndex - 1
        ].fileId,
      isMoveToBeforeTarget: newIndex === 0,
    })
    material.value.multimediaList = res.data.result.multimediaList
    store.dispatch('helper/closeModalLoading')
  }

  const updateMultimediaList = (list: MultimediaFile[]) => {
    material.value.multimediaList.splice(
      0,
      material.value.multimediaList.length,
      ...list
    )
  }

  const selectCover = (id: CoverId) => {
    selectedCoverId.value = id
  }

  const saveCover = async () => {
    let multimediaFileId: number | null = null
    let coverMode: CoverMode | null = null

    if (typeof selectedCoverId.value === 'number') {
      multimediaFileId = selectedCoverId.value
      coverMode = CoverMode.MULTI_MEDIA
    }

    if (selectedCoverId.value === 'faceSide') {
      coverMode = CoverMode.FACE
    }

    if (selectedCoverId.value === 'backSide') {
      coverMode = CoverMode.BACK
    }

    if (selectedCoverId.value === 'digitalDrape') {
      coverMode = CoverMode.DIGITAL_DRAPE
    }

    if (!coverMode) {
      throw new Error('Cover mode not found')
    }

    store.dispatch('helper/pushModalLoading')
    const res = await ogBaseAssetsApi('setAssetsMaterialCover', {
      materialId: material.value.materialId,
      multimediaFileId,
      coverMode,
    })
    store.dispatch('helper/closeModalLoading')

    const result = res.data.result
    selectedCoverId.value = null
    material.value.coverImage = result.coverImage
    material.value.multimediaList = result.multimediaList
  }

  const startCropMultimedia = async (id: number) => {
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
          store.dispatch('helper/pushModalLoading')
          const { s3UploadId, fileName } = await uploadFileToS3(
            croppedImageFile,
            target.displayFileName
          )
          const res = await ogBaseAssetsApi('cropAssetsMaterialMultimedia', {
            materialId: material.value.materialId,
            fileId: target.fileId,
            croppedImage: { s3UploadId, fileName, cropRecord },
          })
          material.value.multimediaList = res.data.result.multimediaList
          store.dispatch('helper/closeModalLoading')
        },
      },
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

  const uploadSideImage = async (
    faceSideFile: File | null,
    backSideFile: File | null
  ) => {
    store.dispatch('helper/pushModalLoading')

    const getSideImage = async (file: File | null) => {
      if (!file) {
        return null
      }

      const { s3UploadId, fileName } = await uploadFileToS3(file, file.name)
      return {
        original: {
          s3UploadId,
          fileName,
        },
      }
    }

    const [faceSideImageReq, backSideImageReq] = await Promise.all([
      getSideImage(faceSideFile),
      getSideImage(backSideFile),
    ])
    const res = await ogBaseAssetsApi('uploadAssetsMaterialSideImage', {
      materialId: material.value.materialId,
      faceSideImage: faceSideImageReq,
      backSideImage: backSideImageReq,
    })

    const result = res.data.result!
    const { faceSide, backSide, coverImage, u3mStatus, isNotifyReCreateU3m } =
      result
    material.value.coverImage = coverImage
    if (material.value.faceSide) {
      material.value.faceSide.sideImage = faceSide?.sideImage || null
      material.value.faceSide.u3mImage = faceSide?.u3mImage || null
    }
    if (material.value.backSide) {
      material.value.backSide.sideImage = backSide?.sideImage || null
      material.value.backSide.u3mImage = backSide?.u3mImage || null
    }
    material.value.u3m.status = u3mStatus
    material.value.u3m.isNotifyReCreate = isNotifyReCreateU3m

    updatePantoneList({
      faceSidePantoneNameList: faceSide?.pantoneList?.map((p) => p.name) || [],
      backSidePantoneNameList: backSide?.pantoneList?.map((p) => p.name) || [],
    })

    store.dispatch('helper/closeModalLoading')
    notify.showNotifySnackbar({ messageText: t('EE0164') })

    editSideImage()
  }

  const editSideImage = () => {
    const { materialId, isDoubleSide, sideType, faceSide, backSide } =
      material.value
    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-edit-scanned-image',
      properties: {
        isDoubleSide,
        sideType,
        faceSideImg: faceSide?.sideImage || null,
        backSideImg: backSide?.sideImage || null,
        afterCropHandler: async ({
          faceSideCropImg,
          backSideCropImg,
          isExchange,
          faceSideCropImageRecord,
          backSideCropImageRecord,
        }: {
          faceSideCropImg: File | null
          backSideCropImg: File | null
          isExchange: boolean
          faceSideCropImageRecord: SquareCropRecord | null
          backSideCropImageRecord: SquareCropRecord | null
        }) => {
          store.dispatch('helper/pushModalLoading')

          const getSidePayload = async (
            sideImageFile: File | null,
            sideImageCropRecord: SquareCropRecord | null
          ) => {
            if (!sideImageFile || !sideImageCropRecord) {
              return null
            }

            const { s3UploadId, fileName } = await uploadFileToS3(
              sideImageFile,
              sideImageFile.name
            )
            return {
              cropped: {
                s3UploadId,
                fileName,
                cropImageRecord: sideImageCropRecord,
              },
            }
          }

          const [faceSideImageReq, backSideImageReq] = await Promise.all([
            getSidePayload(faceSideCropImg, faceSideCropImageRecord),
            getSidePayload(backSideCropImg, backSideCropImageRecord),
          ])

          const res = await ogBaseAssetsApi('editAssetsMaterialSideImage', {
            materialId,
            isExchange,
            faceSideImage: faceSideImageReq,
            backSideImage: backSideImageReq,
          })

          const result = res.data.result!
          const {
            faceSide: faceSideRes,
            backSide: backSideRes,
            coverImage,
            isNotifyReCreateU3m,
          } = result
          material.value.coverImage = coverImage
          material.value.u3m.isNotifyReCreate = isNotifyReCreateU3m

          if (faceSideRes) {
            if (!material.value.faceSide) {
              throw new Error('faceSide not found')
            }
            material.value.faceSide.sideImage = faceSideRes.sideImage
          }

          if (backSideRes) {
            if (!material.value.backSide) {
              throw new Error('backSide not found')
            }
            material.value.backSide.sideImage = backSideRes.sideImage
          }

          updatePantoneList({
            faceSidePantoneNameList:
              faceSideRes?.pantoneList?.map((p) => p.name) || null,
            backSidePantoneNameList:
              backSideRes?.pantoneList?.map((p) => p.name) || null,
          })

          notify.showNotifySnackbar({ messageText: t('EE0164') })
          store.dispatch('helper/closeModalLoading')
        },
      },
    })
  }

  return {
    material,
    multimediaList,
    selectedCoverId,
    coverAndSideImageList,
    getMultimediaMenuTree,
    openModalMultimediaSelect,
    downloadMultimediaSelect,
    renameMultimediaSelect,
    removeMultimediaSelect,
    updateMultimediaList,
    editSideImage,
    uploadSideImage,
    moveMultimedia,
    startCropMultimedia,
    selectCover,
    saveCover,
  }
}

export default useMultimediaUpdate

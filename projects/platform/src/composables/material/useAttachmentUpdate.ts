import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { NOTIFY_TYPE, THEME } from '@frontier/constants'
import { downloadDataURLFile, getFileNameExcludeExtension } from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import type { AttachmentFile, Material } from '@frontier/platform-web-sdk'
import { Extension } from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { uploadFileToS3 } from '@/utils/fileUpload'

const useAttachmentUpdate = (material: Ref<Material>) => {
  const { t } = useI18n()
  const store = useStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)
  const attachmentList = computed(
    () => material.value.internalInfo?.attachmentList || []
  )

  const getAttachmentById = (fileId: number): AttachmentFile | undefined => {
    return attachmentList.value.find((file) => file.fileId === fileId)
  }

  const openModalAttachmentSelect = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-upload-attachment',
      properties: {
        uploadHandler: async (fileList: File[]) => {
          store.dispatch('helper/pushModalLoading')

          const s3FileList = await Promise.all(
            fileList.map((file) => uploadFileToS3(file, file.name))
          )

          const res = await ogBaseAssetsApi('uploadAssetsMaterialAttachment', {
            materialId: material.value.materialId,
            attachmentList: s3FileList.map((file) => {
              {
                return {
                  s3UploadId: file.s3UploadId,
                  fileName: file.fileName,
                  displayFileName: file.fileName,
                }
              }
            }),
          })

          if (material.value.internalInfo) {
            material.value.internalInfo.attachmentList =
              res.data.result.attachmentList
          }

          store.dispatch('helper/closeModalLoading')
        },
      },
    })
  }

  const removeAttachmentSelect = (id: number, theme: THEME) => {
    store.dispatch('helper/pushModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      theme,
      header: t('DD0068'),
      contentText: t('DD0069'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: async () => {
        const target = getAttachmentById(id)
        if (!target) {
          throw new Error('attachment not found')
        }

        store.dispatch('helper/pushModalLoading', { theme })
        const res = await ogBaseAssetsApi('removeAssetsMaterialAttachment', {
          materialId: material.value.materialId,
          fileId: target.fileId,
        })
        if (material.value.internalInfo) {
          material.value.internalInfo.attachmentList =
            res.data.result.attachmentList
        }
        store.dispatch('helper/closeModalLoading')
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const renameAttachmentSelect = (id: number, theme: THEME) => {
    const target = getAttachmentById(id)
    if (!target) {
      throw new Error('attachment not found')
    }

    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-rename-file',
      properties: {
        theme,
        fileName: getFileNameExcludeExtension(target.displayFileName),
        extension: target.extension,
        onSubmit: async (newFileNameExcludeExtension: string) => {
          store.dispatch('helper/pushModalLoading', { theme })
          const res = await ogBaseAssetsApi('renameAssetsMaterialAttachment', {
            materialId: material.value.materialId,
            fileId: target.fileId,
            displayFileName: `${newFileNameExcludeExtension}.${target.extension}`,
          })
          if (material.value.internalInfo) {
            material.value.internalInfo.attachmentList =
              res.data.result.attachmentList
          }
          store.dispatch('helper/closeModalLoading')
        },
      },
    })
  }

  const downloadAttachmentSelect = (id: number) => {
    const target = getAttachmentById(id)
    if (!target) {
      throw new Error('attachment not found')
    }

    downloadDataURLFile(target.originalUrl, target.displayFileName)
  }

  const getAttachmentMenuTree = (id: number, theme = THEME.LIGHT): MenuTree => {
    const target = getAttachmentById(id)
    if (!target) {
      throw new Error('attachment not found')
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
                clickHandler: () => downloadAttachmentSelect(id),
              },
              {
                title: t('RR0302'),
                icon: 'create',
                clickHandler: () => renameAttachmentSelect(id, theme),
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
              clickHandler: () => removeAttachmentSelect(id, theme),
            },
          ],
        },
      ],
    }
  }

  const moveAttachment = async (fileId: number, newIndex: number) => {
    store.dispatch('helper/pushModalLoading')
    const target = getAttachmentById(fileId)
    if (!target) {
      throw new Error('attachment not found')
    }

    const res = await ogBaseAssetsApi('moveAssetsMaterialAttachment', {
      materialId: material.value.materialId,
      fileId,
      targetFileId:
        attachmentList.value[newIndex === 0 ? newIndex + 1 : newIndex - 1]
          .fileId,
      isMoveToBeforeTarget: newIndex === 0,
    })
    if (material.value.internalInfo) {
      material.value.internalInfo.attachmentList =
        res.data.result.attachmentList
    }
    store.dispatch('helper/closeModalLoading')
  }

  const updateAttachmentList = async (list: AttachmentFile[]) => {
    attachmentList.value.splice(0, attachmentList.value.length, ...list)
  }

  return {
    material,
    attachmentList,
    getAttachmentMenuTree,
    openModalAttachmentSelect,
    renameAttachmentSelect,
    removeAttachmentSelect,
    downloadAttachmentSelect,
    updateAttachmentList,
    moveAttachment,
  }
}

export default useAttachmentUpdate

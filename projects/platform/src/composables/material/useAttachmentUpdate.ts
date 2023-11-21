import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { EXTENSION, NOTIFY_TYPE, THEME } from '@frontier/constants'
import { downloadDataURLFile, getFileNameExcludeExtension } from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import type { AttachmentFile } from '@frontier/platform-web-sdk'
import assetsApi from '@/apis/assets'
import useOgBaseApiWrapper from '@/composables/useOgBaseApiWrapper'
import { uploadFileToS3 } from '@/utils/fileUpload'

const useAttachmentUpdate = (
  materialId: number,
  attachmentList: Ref<AttachmentFile[]>
) => {
  const { t } = useI18n()
  const store = useStore()
  const ogBaseAssetsApi = useOgBaseApiWrapper(assetsApi)
  // const attachmentList = reactive<AttachmentFile[]>(originAttachmentList)

  const getAttachmentById: (fileId: number) => AttachmentFile | undefined = (
    fileId: number
  ) => {
    return attachmentList.value.find((file) => file.fileId === fileId)
  }

  const openModalAttachmentSelect = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-upload-attachment',
      properties: {
        uploadHandler: async (fileList: File[]) => {
          const s3FileList = await Promise.all(
            fileList.map((file) => uploadFileToS3(file, file.name))
          )
          const result = await ogBaseAssetsApi(
            'uploadAssetsMaterialAttachment',
            {
              materialId,
              attachmentList: s3FileList.map((file) => {
                {
                  return {
                    s3UploadId: file.s3UploadId,
                    fileName: file.fileName,
                    displayFileName: file.fileName,
                  }
                }
              }),
            }
          )

          // TODO: update edit material attachmentList
          result.data.result.attachmentList
        },
      },
    })
  }

  // const openModalPreviewAttachment = (openIndex: number) => {
  //   store.dispatch('helper/pushModal', {
  //     component: 'modal-preview-file',
  //     header: t('DD0060'),
  //     properties: {
  //       fileList: attachmentList.value,
  //       index: openIndex,
  //       getMenuTree: getAttachmentMenuTree,
  //       onRename: (index: number) => renameAttachmentSelect(index),
  //       onRemove: (index: number) => removeAttachmentSelect(index),
  //     },
  //   })
  // }

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
          throw new Error('Multimedia not found')
        }

        ogBaseAssetsApi('removeAssetsMaterialAttachment', {
          materialId,
          fileId: target.fileId,
        })
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const renameAttachmentSelect = (id: number, theme: THEME) => {
    const target = getAttachmentById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }

    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-rename-file',
      properties: {
        theme,
        fileName: getFileNameExcludeExtension(target.displayFileName),
        onSubmit: (newFileNameExcludeExtension: string) => {
          ogBaseAssetsApi('renameAssetsMaterialAttachment', {
            materialId,
            fileId: target.fileId,
            displayFileName: `${newFileNameExcludeExtension}.${target.extension}`,
          })
        },
      },
    })
  }

  const downloadAttachmentSelect = (id: number) => {
    const target = getAttachmentById(id)
    if (!target) {
      throw new Error('Multimedia not found')
    }

    downloadDataURLFile(target.originalUrl, target.displayFileName)
  }

  const getAttachmentMenuTree = (id: number, theme = THEME.LIGHT): MenuTree => {
    const target = getAttachmentById(id)
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
                clickHandler: () => downloadAttachmentSelect(id),
              },
              {
                title: 'Rename',
                icon: 'create',
                clickHandler: () => renameAttachmentSelect(id, theme),
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
              clickHandler: () => removeAttachmentSelect(id, theme),
            },
          ],
        },
      ],
    }
  }

  const updateAttachmentList = (list: AttachmentFile[]) => {
    attachmentList.value.splice(0, attachmentList.value.length, ...list)
  }

  return {
    attachmentList,
    getAttachmentMenuTree,
    openModalAttachmentSelect,
    // openModalPreviewAttachment,
    renameAttachmentSelect,
    removeAttachmentSelect,
    downloadAttachmentSelect,
    updateAttachmentList,
  }
}

export default useAttachmentUpdate

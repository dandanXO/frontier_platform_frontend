import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { EXTENSION, NOTIFY_TYPE } from '@frontier/constants'
import {
  downloadFile,
  getFileExtension,
  getFileNameExcludeExtension,
} from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'

export interface Attachment {
  file: File
  url: string
  displayFileName: string
  extension: EXTENSION
  displayFileNameExcludeExtension: string
}

const useAttachmentSelect = () => {
  const { t } = useI18n()
  const store = useStore()

  const attachmentList = reactive<Attachment[]>([])

  const openModalAttachmentSelect = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-upload-attachment',
      properties: {
        uploadHandler: async (fileList: File[]) => {
          const toAttachment = (file: File) => {
            return {
              file,
              url: URL.createObjectURL(file),
              extension: getFileExtension(file.name) as EXTENSION,
              displayFileName: file.name,
              displayFileNameExcludeExtension: getFileNameExcludeExtension(
                file.name
              ),
            }
          }
          attachmentList.push(...fileList.map(toAttachment))
        },
      },
    })
  }

  const openModalPreviewAttachment = (openIndex: number) => {
    store.dispatch('helper/pushModal', {
      component: 'modal-preview-file',
      header: t('DD0060'),
      properties: {
        fileList: attachmentList,
        index: openIndex,
        getMenuTree: getAttachmentMenuTree,
        onRename: (index: number) => renameAttachmentSelect(index),
        onRemove: (index: number) => removeAttachmentSelect(index),
      },
    })
  }

  const removeAttachmentSelect = (index: number) => {
    store.dispatch('helper/pushModalConfirm', {
      type: NOTIFY_TYPE.WARNING,
      header: t('DD0068'),
      contentText: t('DD0069'),
      primaryBtnText: t('UU0001'),
      primaryBtnHandler: async () => {
        const target = attachmentList[index]
        URL.revokeObjectURL(target.url)
        attachmentList.splice(index, 1)
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const renameAttachmentSelect = (index: number) => {
    const target = attachmentList[index]
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

  const downloadAttachmentSelect = (index: number) => {
    const target = attachmentList[index]
    downloadFile(target.url, target.displayFileName)
  }

  const getAttachmentMenuTree = (index: number): MenuTree => {
    const target = attachmentList[index]
    return {
      width: 'w-44',
      blockList: [
        {
          menuList: (() => {
            const menuList = [
              {
                title: 'Download',
                icon: 'download',
                clickHandler: () => downloadAttachmentSelect(index),
              },
              {
                title: 'Rename',
                icon: 'create',
                clickHandler: () => renameAttachmentSelect(index),
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
              clickHandler: () => removeAttachmentSelect(index),
            },
          ],
        },
      ],
    }
  }

  const updateAttachmentList = (list: Attachment[]) => {
    attachmentList.splice(0, attachmentList.length, ...list)
  }

  return {
    attachmentList,
    getAttachmentMenuTree,
    openModalAttachmentSelect,
    openModalPreviewAttachment,
    renameAttachmentSelect,
    removeAttachmentSelect,
    downloadAttachmentSelect,
    updateAttachmentList,
  }
}

export default useAttachmentSelect

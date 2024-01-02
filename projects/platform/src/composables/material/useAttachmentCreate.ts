import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { v4 as uuidv4 } from 'uuid'
import { NOTIFY_TYPE, THEME } from '@frontier/constants'
import {
  downloadDataURLFile,
  getFileExtension,
  getFileNameExcludeExtension,
} from '@frontier/lib'
import type { MenuTree } from '@frontier/ui-component'
import type { AttachmentCreateItem } from '@/types'
import { getPreviewUrl } from '@/utils/pdf'
import { Extension } from '@frontier/platform-web-sdk'

const useAttachmentCreate = () => {
  const { t } = useI18n()
  const store = useStore()

  const attachmentList = reactive<AttachmentCreateItem[]>([])

  const getAttachmentById = (id: string): AttachmentCreateItem | undefined => {
    return attachmentList.find((file) => file.id === id)
  }

  const openModalAttachmentSelect = () => {
    store.dispatch('helper/openModalBehavior', {
      component: 'modal-upload-attachment',
      properties: {
        uploadHandler: async (fileList: File[]) => {
          const toAttachment = async (file: File) => {
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
            }
          }
          const newAttachmentList = await Promise.all(
            fileList.map(toAttachment)
          )
          attachmentList.push(...newAttachmentList)
        },
      },
    })
  }

  const removeAttachmentSelect = (id: string, theme: THEME) => {
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
        URL.revokeObjectURL(target.originalUrl)
        URL.revokeObjectURL(target.thumbnailUrl)

        const targetIndex = attachmentList.findIndex((m) => m.id === id)
        attachmentList.splice(targetIndex, 1)
      },
      secondaryBtnText: t('UU0002'),
    })
  }

  const renameAttachmentSelect = (id: string, theme: THEME) => {
    const target = getAttachmentById(id)
    if (!target) {
      throw new Error('attachment not found')
    }

    store.dispatch('helper/pushModalBehavior', {
      component: 'modal-rename-file',
      properties: {
        theme,
        fileName: target.displayFileNameExcludeExtension,
        closable: false,
        onSubmit: (newFileNameExcludeExtension: string) => {
          target.displayFileNameExcludeExtension = newFileNameExcludeExtension
          target.displayFileName = `${newFileNameExcludeExtension}.${target.extension}`
        },
      },
    })
  }

  const downloadAttachmentSelect = (id: string) => {
    const target = getAttachmentById(id)
    if (!target) {
      throw new Error('attachment not found')
    }
    downloadDataURLFile(target.originalUrl, target.displayFileName)
  }

  const getAttachmentMenuTree = (id: string, theme = THEME.LIGHT): MenuTree => {
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

  const updateAttachmentList = (list: AttachmentCreateItem[]) => {
    attachmentList.splice(0, attachmentList.length, ...list)
  }

  return {
    attachmentList,
    getAttachmentMenuTree,
    openModalAttachmentSelect,
    renameAttachmentSelect,
    removeAttachmentSelect,
    downloadAttachmentSelect,
    updateAttachmentList,
  }
}

export default useAttachmentCreate

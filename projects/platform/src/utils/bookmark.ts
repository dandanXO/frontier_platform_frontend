import { BookmarkType } from '@frontier/platform-web-sdk'
import type {
  BookmarkManagerFolderBookmark,
  BookmarkManagerOrgBookmark,
} from '@/types'

export const processBookmarkByType = <T>(
  bookmark: BookmarkManagerFolderBookmark | BookmarkManagerOrgBookmark,
  strategies: {
    allThreads?: (allThreadBookmark: BookmarkManagerFolderBookmark) => T
    [BookmarkType.FOLDER]: (folderBookmark: BookmarkManagerFolderBookmark) => T
    [BookmarkType.ORG]: (orgBookmark: BookmarkManagerOrgBookmark) => T
  }
) => {
  switch (bookmark.bookmarkType) {
    case BookmarkType.FOLDER: {
      const folderBookmark = bookmark as BookmarkManagerFolderBookmark
      if (folderBookmark.isAllThread && strategies.allThreads) {
        return strategies.allThreads(folderBookmark)
      }
      return strategies[BookmarkType.FOLDER](folderBookmark)
    }
    case BookmarkType.ORG: {
      return strategies[BookmarkType.ORG](
        bookmark as BookmarkManagerOrgBookmark
      )
    }
    default: {
      throw new Error('invalid bookmark type')
    }
  }
}

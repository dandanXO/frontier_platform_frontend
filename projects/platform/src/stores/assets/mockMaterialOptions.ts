import type { MaterialDescription } from '@frontier/platform-web-sdk'

let id = 0

const generateMockDescriptionTag = (name: string): MaterialDescription => {
  id += 1
  return { descriptionId: id, name: `${name} tag ${id}` }
}

const generateMockDescriptionTags = (
  count: number,
  name: string
): MaterialDescription[] => {
  const tags = []
  for (let i = 0; i < count; i += 1) {
    tags.push(generateMockDescriptionTag(name))
  }
  return tags
}

const mockMaterialOptions = {
  seasonList: {
    default: [
      { seasonId: 1, name: 'season 1' },
      { seasonId: 2, name: 'season 2' },
    ],
    custom: [
      { seasonId: 3, name: 'season 3' },
      { seasonId: 4, name: 'season 4' },
    ],
  },
  contentList: {
    default: [
      { contentId: 1, name: 'content 1' },
      { contentId: 2, name: 'content 2' },
    ],
    custom: [
      { contentId: 3, name: 'content 3' },
      { contentId: 4, name: 'content 4' },
    ],
  },
  descriptionList: {
    woven: {
      default: generateMockDescriptionTags(2, 'woven'),
      custom: generateMockDescriptionTags(2, 'woven'),
    },
    knit: {
      default: generateMockDescriptionTags(2, 'knit'),
      custom: generateMockDescriptionTags(2, 'knit'),
    },
    nonWoven: {
      default: generateMockDescriptionTags(2, 'nonWoven'),
      custom: generateMockDescriptionTags(2, 'nonWoven'),
    },
    leather: {
      default: generateMockDescriptionTags(2, 'leather'),
      custom: generateMockDescriptionTags(2, 'leather'),
    },
    trim: {
      default: generateMockDescriptionTags(2, 'trim'),
      custom: generateMockDescriptionTags(2, 'trim'),
    },
    others: {
      default: generateMockDescriptionTags(2, 'others'),
      custom: generateMockDescriptionTags(2, 'others'),
    },
  },
  finishList: {
    default: [{ finishId: 1, name: 'finish 1' }],
    custom: [{ finishId: 2, name: 'finish 2' }],
  },
  certificateList: [
    { certificateId: 1, name: 'tag 1' },
    { certificateId: 2, name: 'tag 2' },
  ],
}

export default mockMaterialOptions

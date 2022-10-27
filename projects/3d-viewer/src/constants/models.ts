import sphereModel from '../assets/models/sphere/scene.glb'
import sphereCoverImg from '../assets/models/sphere/cover.jpg'

import tshirtModel from '../assets/models/tshirt/scene.glb'
import tshirtCoverImg from '../assets/models/tshirt/cover.jpg'

import demoDressModel from '../assets/models/demo_dress/scene.glb'
import demoDressCoverImg from '../assets/models/demo_dress/cover.jpg'

import shoeModel from '../assets/models/shoe/scene.glb'
import shoeCoverImg from '../assets/models/shoe/cover.jpg'

import braModel from '../assets/models/sports_bra_and_leggings_for_nike/scene.glb'
import braCoverImg from '../assets/models/sports_bra_and_leggings_for_nike/cover.jpg'

import backpackModel from '../assets/models/large_camping_backpack_freegameready/scene.glb'
import backpackCoverImg from '../assets/models/large_camping_backpack_freegameready/cover.jpg'

import pantsModel from '../assets/models/black_pants/scene.glb'
import pantsCoverImg from '../assets/models/black_pants/cover.jpg'

import jeansModel from '../assets/models/blue-jeans-pants/scene.glb'
import jeansCoverImg from '../assets/models/blue-jeans-pants/cover.jpg'

import suitModel from '../assets/models/suit/scene.glb'
import suitCoverImg from '../assets/models/suit/cover.jpg'

import jacketModel from '../assets/models/jacket/scene.glb'
import jacketCoverImg from '../assets/models/jacket/cover.jpg'

import jacket2Model from '../assets/models/jacket-2/scene.glb'
import jacket2CoverImg from '../assets/models/jacket-2/cover.jpg'

export interface Model {
  name: string
  filePath: string
  coverImg: string
  size: number
  flipY: boolean
}

// Size and flipY properties are magic. Don't touch.
const MODELS: Model[] = [
  {
    name: 'sphere',
    filePath: sphereModel,
    coverImg: sphereCoverImg,
    size: 108,
    flipY: true,
  },
  {
    name: 'tshirt',
    filePath: tshirtModel,
    coverImg: tshirtCoverImg,
    size: 108,
    flipY: true,
  },
  {
    name: 'dress',
    filePath: demoDressModel,
    coverImg: demoDressCoverImg,
    size: 40,
    flipY: true,
  },
  {
    name: 'shoe',
    filePath: shoeModel,
    coverImg: shoeCoverImg,
    size: 50,
    flipY: false,
  },
  {
    name: 'bra',
    filePath: braModel,
    coverImg: braCoverImg,
    size: 75,
    flipY: true,
  },
  {
    name: 'backpack',
    filePath: backpackModel,
    coverImg: backpackCoverImg,
    size: 115,
    flipY: true,
  },
  {
    name: 'pants',
    filePath: pantsModel,
    coverImg: pantsCoverImg,
    size: 130,
    flipY: true,
  },
  {
    name: 'jeans',
    filePath: jeansModel,
    coverImg: jeansCoverImg,
    size: 130,
    flipY: true,
  },
  {
    name: 'suit',
    filePath: suitModel,
    coverImg: suitCoverImg,
    size: 108,
    flipY: true,
  },
  {
    name: 'jacket',
    filePath: jacketModel,
    coverImg: jacketCoverImg,
    size: 108,
    flipY: true,
  },
  {
    name: 'jacket2',
    filePath: jacket2Model,
    coverImg: jacket2CoverImg,
    size: 400,
    flipY: true,
  },
]

export default MODELS

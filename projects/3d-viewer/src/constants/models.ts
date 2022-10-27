import sphereModel from '../assets/models/sphere/scene.glb'
import sphereCoverImg from '../assets/models/sphere/cover.jpg'

import tshirtModel from '../assets/models/tshirt/scene.glb'
import tshirtCoverImg from '../assets/models/tshirt/cover.jpg'

import shirtModel from '../assets/models/shirt/scene.glb'
import shirtCoverImg from '../assets/models/shirt/cover.jpg'

import jacketModel from '../assets/models/jacket/scene.glb'
import jacketCoverImg from '../assets/models/jacket/cover.jpg'

import pantsModel from '../assets/models/pants/scene.glb'
import pantsCoverImg from '../assets/models/pants/cover.jpg'

import dressModel from '../assets/models/dress/scene.glb'
import dressCoverImg from '../assets/models/dress/cover.jpg'

import leggingsModel from '../assets/models/leggings/scene.glb'
import leggingsCoverImg from '../assets/models/leggings/cover.jpg'

import backpackModel from '../assets/models/backpack/scene.glb'
import backpackCoverImg from '../assets/models/backpack/cover.jpg'

import shoeModel from '../assets/models/shoe/scene.glb'
import shoeCoverImg from '../assets/models/shoe/cover.jpg'

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
    size: 80,
    flipY: true,
  },
  {
    name: 'shirt',
    filePath: shirtModel,
    coverImg: shirtCoverImg,
    size: 108,
    flipY: true,
  },
  {
    name: 'jacket',
    filePath: jacketModel,
    coverImg: jacketCoverImg,
    size: 140,
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
    name: 'dress',
    filePath: dressModel,
    coverImg: dressCoverImg,
    size: 20,
    flipY: true,
  },

  {
    name: 'leggins',
    filePath: leggingsModel,
    coverImg: leggingsCoverImg,
    size: 200,
    flipY: true,
  },

  {
    name: 'backpack',
    filePath: backpackModel,
    coverImg: backpackCoverImg,
    size: 5,
    flipY: true,
  },
  {
    name: 'shoe',
    filePath: shoeModel,
    coverImg: shoeCoverImg,
    size: 30,
    flipY: false,
  },
]

export default MODELS

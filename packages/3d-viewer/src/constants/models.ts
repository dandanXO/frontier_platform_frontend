export interface Model {
  name: string
  filePath: string
  coverImg: string
  size: number
}

const baseUrl = `${
  import.meta.env.VITE_APP_WEB_URL
}/static-data/3d-viewer/models/`

// Size and flipY properties are magic. Don't touch.
const MODELS: Model[] = [
  {
    name: 'sphere',
    filePath: baseUrl + 'sphere/scene.glb',
    coverImg: baseUrl + 'sphere/cover.jpg',
    size: 108,
  },
  {
    name: 'tshirt',
    filePath: baseUrl + 'tshirt/scene.glb',
    coverImg: baseUrl + 'tshirt/cover.jpg',
    size: 80,
  },
  {
    name: 'shirt',
    filePath: baseUrl + 'shirt/scene.glb',
    coverImg: baseUrl + 'shirt/cover.jpg',
    size: 108,
  },
  {
    name: 'jacket',
    filePath: baseUrl + 'jacket/scene.glb',
    coverImg: baseUrl + 'jacket/cover.jpg',
    size: 140,
  },
  {
    name: 'pants',
    filePath: baseUrl + 'pants/scene.glb',
    coverImg: baseUrl + 'pants/cover.jpg',
    size: 130,
  },
  {
    name: 'dress',
    filePath: baseUrl + 'dress/scene.glb',
    coverImg: baseUrl + 'dress/cover.jpg',
    size: 20,
  },
  {
    name: 'leggins',
    filePath: baseUrl + 'leggings/scene.glb',
    coverImg: baseUrl + 'leggings/cover.jpg',
    size: 200,
  },
  {
    name: 'backpack',
    filePath: baseUrl + 'backpack/scene.glb',
    coverImg: baseUrl,
    size: 5,
  },
  {
    name: 'shoe',
    filePath: baseUrl + 'shoe/scene.glb',
    coverImg: baseUrl + 'shoe/cover.jpg',
    size: 30,
  },
]

export default MODELS

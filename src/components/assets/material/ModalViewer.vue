<style lang="scss" scoped>
.loader,
.loader::before,
.loader::after {
  border-radius: 50%;
  border: 3px solid transparent;
}

.loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-top-color: #51ef0e;
  animation: spin 2s linear infinite;

  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-top-color: #23aa61;
    animation: spin 3s linear infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-top-color: #28e9c8;
    animation: spin 1.5s linear infinite;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
<style>
.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  background-color: #444;
  width: 25px;
  height: 25px;
}

.carousel__prev {
  transform: translate(-30px, -20px);
}

.carousel__next {
  transform: translate(30px, -20px);
}

.carousel__pagination-button {
  background-color: #444;
  opacity: 0.6;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 15px 8px 0;
}

.carousel__pagination-button--active {
  background-color: #444;
  opacity: 1;
}
</style>

<template lang="pug">
div(class="w-175 h-141 relative" :style="{width: outputWidth, height: outputHeight}")
  canvas(ref="canvas" class="w-full h-full")
  div(class="absolute top-4 right-4 border cursor-pointer" @click="screenshotClick")
    img(src="@/assets/images/material/camera.png" class="w-12.5")
  div(class="absolute w-6/12 m-auto bottom-5 inset-x-0")
    carousel(:settings="settings")
      slide(v-for="type in modelTypes" :key="type")
        div(class="cursor-pointer mx-1" @click="initModel(type)")
          img(:src="getModelCoverImg(type)" class="rounded")
      template(#addons)
        navigation
        pagination
  div(v-if="showLoading" class="absolute inset-0 bg-black bg-opacity-60 h-full w-full z-10")
    div(class="loader")
</template>

<script>
import { downloadDataURLFile } from '@/utils/fileOperator'
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
// https://github.com/ismail9k/vue3-carousel
import { image2Object } from '@/utils/cropper'

// Size and flipY properties are magic. Don't touch.
const MODEL_INFO = {
  tshirt: {
    filePath: 'tshirtsmall',
    size: 108,
    flipY: true
  },
  dress: {
    filePath: 'demo_dress',
    size: 40,
    flipY: true
  },
  shoe: {
    filePath: 'shoe',
    size: 50,
    flipY: false
  },
  bra: {
    filePath: 'sports_bra_and_leggings_for_nike',
    size: 75,
    flipY: true
  },
  backpack: {
    filePath: 'large_camping_backpack_freegameready',
    size: 115,
    flipY: true
  },
  pants: {
    filePath: 'black_pants',
    size: 130,
    flipY: true
  }
}

export default {
  name: 'ModalViewer',
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  props: {
    dpi: {
      type: Number,
      default: 600
    },
    baseImgUrl: {
      type: String,
      default: ''
    },
    normalImgUrl: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const baseUrl = window.location.origin + '/static-data/material'
    const settings = { itemsToShow: 3, snapAlign: 'start' }
    const modelTypes = Object.keys(MODEL_INFO)
    const showLoading = ref(true)
    const canvas = ref(null)
    const outputWidth = 700
    const outputHeight = 564
    let scene, renderer, camera, animationReq

    const getModelCoverImg = (modelName) => {
      const path = `/src/assets/images/material/${modelName}.jpg`
      const modules = import.meta.globEager('/src/assets/images/material/*.jpg')
      return modules[path].default
    }

    const initScene = () => {
      // 建立場景
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x222222)
      scene.fog = new THREE.Fog(0x222222, 10, 50)

      // 建立渲染器
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        antialias: true,
        preserveDrawingBuffer: true
      })

      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.shadowMap.enable = true
      renderer.outputEncoding = THREE.sRGBEncoding

      // 載入地板
      const groundTexture = new THREE.TextureLoader().load(`${baseUrl}/retina_wood.png`)
      groundTexture.wrapS = THREE.RepeatWrapping
      groundTexture.wrapT = THREE.RepeatWrapping
      groundTexture.repeat.set(25, 25)
      groundTexture.anisotropy = 36

      const groundMaterial = new THREE.MeshPhongMaterial({
        map: groundTexture,
        color: 0xf7f7f7,
        specular: 0x1e1e1e,
        shininess: 30,
        flatShading: THREE.FlatShading
      })

      const mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(100, 100),
        groundMaterial
      )

      mesh.rotation.x = Math.PI * -1 / 2
      mesh.receiveShadow = true
      mesh.rog = false
      scene.add(mesh)

      // 建立相機
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 300)
      camera.position.set(0, 1, 2)

      // 建立光源
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
      hemiLight.position.set(0, 20, 0)
      scene.add(hemiLight)

      const spotLight = new THREE.SpotLight(0xffffff, 0.3)
      spotLight.position.set(0, 5, 0)
      spotLight.angle = Math.PI / 9
      spotLight.penumbra = 0.1
      spotLight.decay = 1
      spotLight.distance = 50
      spotLight.castShadow = true
      spotLight.shadow.mapSize.width = 1024 * 2
      spotLight.shadow.mapSize.height = 1024 * 2
      spotLight.shadow.bias = -0.00001
      scene.add(spotLight)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.target = new THREE.Vector3(0, 0.6, 0)
      controls.maxDistance = 4
      controls.minDistance = 0.5
      controls.maxPolarAngle = Math.PI

      function resizeRendererToDisplaySize (renderer) {
        const canvas = renderer.domElement
        const width = window.innerWidth
        const height = window.innerHeight
        const canvasPixelWidth = canvas.width / window.devicePixelRatio
        const canvasPixelHeight = canvas.height / window.devicePixelRatio
        const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height

        if (needResize) renderer.setSize(width, height, false)
        return needResize
      }

      function animate () {
        controls.update()

        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement
          camera.aspect = canvas.clientWidth / canvas.clientHeight
          camera.updateProjectionMatrix()
        }

        renderer.render(scene, camera)
        animationReq = requestAnimationFrame(animate)
      }

      animate()
    }

    const initModel = async (type) => {
      const { width } = await image2Object(props.baseImgUrl)
      const cm = width * (2.54 / props.dpi)
      const repeatTimes = MODEL_INFO[type].size / cm

      scene.children.forEach((item) => {
        if (item.type === 'Group') {
          scene.remove(item)
        }
      })

      const baseTexture = new THREE.TextureLoader().load(props.baseImgUrl)
      baseTexture.wrapS = THREE.RepeatWrapping
      baseTexture.wrapT = THREE.RepeatWrapping
      baseTexture.repeat.set(repeatTimes, repeatTimes)
      baseTexture.flipY = MODEL_INFO[type].flipY

      baseTexture.needsUpdate = true

      const normalTexture = new THREE.TextureLoader().load(props.normalImgUrl)
      normalTexture.wrapS = THREE.RepeatWrapping
      normalTexture.wrapT = THREE.RepeatWrapping
      normalTexture.repeat.set(repeatTimes, repeatTimes)
      normalTexture.flipY = MODEL_INFO[type].flipY

      normalTexture.needsUpdate = true

      const manager = new THREE.LoadingManager()

      manager.onStart = (url, itemsLoaded, itemsTotal) => {
        // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
        showLoading.value = true
      }

      manager.onLoad = () => {
        // console.log('Loading complete!')
        showLoading.value = false
      }

      manager.onProgress = (url, itemsLoaded, itemsTotal) => {
        // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
      }

      manager.onError = (url) => {
        // console.log('There was an error loading ' + url)
        showLoading.value = false
      }

      const modelPath = `${baseUrl}/${MODEL_INFO[type].filePath}/scene.gltf`

      const loader = new GLTFLoader(manager)
      loader.load(modelPath, (gltf) => {
        const model = gltf.scene
        model.scale.set(0.5, 0.5, 0.5)

        model.traverse((obj) => {
          if (!obj.isMesh) return
          obj.receiveShadow = true
          obj.castShadow = true

          if (obj.name.includes('Mesh_')) {
            const normalMaterial = new THREE.MeshPhongMaterial({
              map: baseTexture,
              normalMap: normalTexture
            })
            obj.material = normalMaterial
            obj.material.map.anisotropy = 16
            obj.material.roughness = 0.5
          }
        })
        scene.add(model)
      })
    }

    const screenshotClick = () => {
      const resizedCanvas = getResizedCanvas(canvas.value, outputWidth, outputHeight)

      resizedCanvas.toBlob((blob) => {
        const fileName = `screencapture-${outputWidth}x${outputHeight}.png`
        const url = window.URL.createObjectURL(blob)
        downloadDataURLFile(url, fileName)
      })

      function getResizedCanvas (canvas, newWidth, newHeight) {
        const tmpCanvas = document.createElement('canvas')
        tmpCanvas.width = newWidth
        tmpCanvas.height = newHeight

        const ctx = tmpCanvas.getContext('2d')
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight)

        return tmpCanvas
      }
    }

    onMounted(() => {
      initScene()
      initModel(modelTypes[0])
    })

    onUnmounted(() => {
      cancelAnimationFrame(animationReq)
      scene = null
      camera = null
      renderer = null
    })

    return {
      outputWidth,
      outputHeight,
      modelTypes,
      settings,
      canvas,
      showLoading,
      initModel,
      screenshotClick,
      getModelCoverImg
    }
  }
}
</script>

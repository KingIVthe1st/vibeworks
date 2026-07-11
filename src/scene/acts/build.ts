import {
  AdditiveBlending,
  BoxGeometry,
  DataTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  RGBAFormat,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  UnsignedByteType,
  Vector2,
  Vector3,
} from 'three'
import { localProgress } from '../../scroll/progress'
import type { CameraKeyframes } from '../camera'
import { onStageFrame } from '../stage'
import { loadActTextures } from '../textures'
import type { Act, Stage } from '../types'

const PLATFORM_IDS = ['atomicity', 'growthos', 'robin'] as const
const TEXTURE_URLS = [
  '/images/atomicity-dashboard.webp',
  '/images/growthos-dashboard.webp',
  '/images/robintrade-dashboard.webp',
]

const screenVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const screenFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uBoot;
  varying vec2 vUv;

  void main() {
    vec3 source = texture2D(uMap, vUv).rgb;
    float revealed = step(vUv.y, uBoot);
    float wipeLine = (1.0 - smoothstep(0.0, 0.02, abs(vUv.y - uBoot)))
      * step(0.001, uBoot) * step(uBoot, 0.999);
    vec3 darkScreen = source * 0.025 + vec3(0.004, 0.003, 0.012);
    vec3 color = mix(darkScreen, source, revealed);
    color += vec3(0.486, 0.361, 1.0) * wipeLine * 0.9;
    gl_FragColor = vec4(color, 1.0);
  }
`

interface MonitorRig {
  group: Group
  material: ShaderMaterial
  figure: HTMLElement
  phase: number
}

interface RectBounds {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export function isMonitorRectRenderable(rect: RectBounds, viewportWidth: number, viewportHeight: number): boolean {
  const values = [rect.top, rect.right, rect.bottom, rect.left, rect.width, rect.height]
  if (!values.every(Number.isFinite) || rect.width <= 0 || rect.height <= 0) return false

  const expandedIntersectionHeight = Math.min(rect.bottom, viewportHeight * 1.5)
    - Math.max(rect.top, -viewportHeight * 0.5)
  const onScreenIntersectionHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
  const onScreenIntersectionWidth = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0)

  return expandedIntersectionHeight > 0
    && onScreenIntersectionHeight > 0
    && onScreenIntersectionWidth > 0
}

export interface BuildAct extends Act {
  setPlatformRanges(ranges: ReadonlyMap<string, [number, number]>): void
}

function createBlackTexture(): DataTexture {
  const texture = new DataTexture(new Uint8Array([1, 1, 4, 255]), 1, 1, RGBAFormat, UnsignedByteType)
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

export function createBuildCameraKeyframes(previous: CameraKeyframes): CameraKeyframes {
  return {
    actIds: ['hero', 'design', ...PLATFORM_IDS],
    actStops: [0, 0.2, 0.4, 0.6, 0.8, 1],
    landscape: {
      position: [
        ...previous.landscape.position,
        [3.12, 5.08, 3.58],
        [3.08, 5.04, 3.62],
        [3.03, 5.0, 3.66],
        [2.98, 4.96, 3.7],
        [2.93, 4.92, 3.74],
        [2.88, 4.88, 3.78],
      ],
      lookAt: [
        ...previous.landscape.lookAt,
        [0, 0.12, 0],
        [0, 0.115, 0],
        [0, 0.11, 0],
        [0, 0.105, 0],
        [0, 0.1, 0],
        [0, 0.095, 0],
      ],
    },
    portrait: {
      position: [
        ...previous.portrait.position,
        [1.69, 6.33, 5.57],
        [1.67, 6.3, 5.6],
        [1.65, 6.27, 5.63],
        [1.63, 6.24, 5.66],
        [1.61, 6.21, 5.69],
        [1.59, 6.18, 5.72],
      ],
      lookAt: [
        ...previous.portrait.lookAt,
        [0, 0.15, 0],
        [0, 0.145, 0],
        [0, 0.14, 0],
        [0, 0.135, 0],
        [0, 0.13, 0],
        [0, 0.125, 0],
      ],
    },
  }
}

export function createBuildAct(
  onAtomicityBoot: (local: number, dock: Vector3) => void,
  onBuildProgress: (local: number) => void,
): BuildAct {
  const monitors: MonitorRig[] = []
  const platformRanges = new Map<string, [number, number]>()
  const blackTexture = createBlackTexture()
  let stageRef: Stage | null = null
  let loadedTextures: Texture[] = []
  let loading = false
  let loadGeneration = 0
  let buildLocal = 0
  let globalProgress = 0
  const pointerTarget = new Vector2()
  const pointerCurrent = new Vector2()
  const ndc = new Vector3()
  const rayDirection = new Vector3()
  const cameraForward = new Vector3()
  const worldPosition = new Vector3()
  const dockPosition = new Vector3()

  const ensureTextures = () => {
    if (loading || loadedTextures.length > 0) return
    loading = true
    const generation = ++loadGeneration
    void loadActTextures(TEXTURE_URLS)
      .then((textures) => {
        if (generation !== loadGeneration) {
          textures.forEach((texture) => texture.dispose())
          return
        }
        loadedTextures = textures
        for (let index = 0; index < monitors.length; index += 1) {
          monitors[index].material.uniforms.uMap.value = textures[index]
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (generation === loadGeneration) loading = false
      })
  }

  const disposeTextures = () => {
    if (loadedTextures.length === 0 && !loading) return
    loadGeneration += 1
    loading = false
    loadedTextures.forEach((texture) => texture.dispose())
    loadedTextures = []
    for (let index = 0; index < monitors.length; index += 1) {
      monitors[index].material.uniforms.uMap.value = blackTexture
    }
  }

  return {
    id: 'platforms',
    range: [0, 0],
    init(stage) {
      stageRef = stage
      // A normalized monitor makes its final world scale derive entirely from
      // the live DOM figure rectangle, including responsive layout changes.
      const screenGeometry = new PlaneGeometry(2, 2)
      const frameGeometry = new BoxGeometry(1, 1, 1)
      const frameMaterial = new MeshBasicMaterial({
        color: 0x7c5cff,
        transparent: true,
        opacity: 0.62,
        toneMapped: false,
      })
      const glowMaterial = new MeshBasicMaterial({
        color: 0x7c5cff,
        transparent: true,
        opacity: 0.075,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      })

      for (let index = 0; index < PLATFORM_IDS.length; index += 1) {
        const figure = document.querySelector<HTMLElement>(`#platforms article[data-platform="${PLATFORM_IDS[index]}"] .device-frame`)
        if (!figure) continue
        const material = new ShaderMaterial({
          vertexShader: screenVertex,
          fragmentShader: screenFragment,
          uniforms: {
            uMap: { value: blackTexture },
            uBoot: { value: 0 },
          },
          toneMapped: false,
        })
        const group = new Group()
        group.name = `build-monitor-${PLATFORM_IDS[index]}`

        const glow = new Mesh(screenGeometry, glowMaterial)
        glow.position.z = -0.035
        glow.scale.set(1.1, 1.1, 1)
        group.add(glow)

        const screen = new Mesh(screenGeometry, material)
        screen.position.z = 0.012
        group.add(screen)

        const top = new Mesh(frameGeometry, frameMaterial)
        top.position.y = 0.985
        top.scale.set(2, 0.03, 0.045)
        const bottom = new Mesh(frameGeometry, frameMaterial)
        bottom.position.y = -0.985
        bottom.scale.copy(top.scale)
        const left = new Mesh(frameGeometry, frameMaterial)
        left.position.x = -0.985
        left.scale.set(0.03, 2, 0.045)
        const right = new Mesh(frameGeometry, frameMaterial)
        right.position.x = 0.985
        right.scale.copy(left.scale)
        group.add(top, bottom, left, right)

        group.visible = false
        stage.scene.add(group)
        monitors.push({ group, material, figure, phase: index * 1.7 })
      }

      const finePointer = matchMedia('(hover: hover) and (pointer: fine)')
      const onPointerMove = (event: PointerEvent) => {
        pointerTarget.set(
          (event.clientX / window.innerWidth - 0.5) * 16,
          (0.5 - event.clientY / window.innerHeight) * 16,
        )
      }
      if (finePointer.matches) window.addEventListener('pointermove', onPointerMove, { passive: true })

      const depth = 4
      onStageFrame(stage, (time, dt) => {
        if (!stageRef) return
        const pointerAlpha = 1 - Math.exp(-dt * 7)
        pointerCurrent.lerp(pointerTarget, pointerAlpha)
        stageRef.camera.getWorldDirection(cameraForward)
        const verticalSpan = 2 * depth * Math.tan(stageRef.camera.fov * Math.PI / 360)

        for (let index = 0; index < monitors.length; index += 1) {
          const monitor = monitors[index]
          // Hide the complete rig before inspecting or applying a rect. This
          // prevents stale/default transforms from exposing a frame or glow.
          monitor.group.visible = false
          const rect = monitor.figure.getBoundingClientRect()
          // localProgress remains 1 after an act, so both bounds are needed.
          // Requiring a positive on-screen intersection also keeps a future
          // article's shell from peeking into the current article transition.
          const active = buildLocal > 0 && buildLocal < 1
          if (!active || !isMonitorRectRenderable(rect, window.innerWidth, window.innerHeight)) continue

          const centerX = rect.left + rect.width * 0.5 + pointerCurrent.x
          const centerY = rect.top + rect.height * 0.5 + pointerCurrent.y + Math.sin(time * 0.72 + monitor.phase) * 4
          ndc.set(centerX / window.innerWidth * 2 - 1, -(centerY / window.innerHeight * 2 - 1), 0.5)
          ndc.unproject(stageRef.camera)
          rayDirection.copy(ndc).sub(stageRef.camera.position).normalize()
          const rayDistance = depth / Math.max(0.001, rayDirection.dot(cameraForward))
          worldPosition.copy(stageRef.camera.position).addScaledVector(rayDirection, rayDistance)

          const worldHeight = verticalSpan * rect.height / window.innerHeight
          const worldWidth = worldHeight * rect.width / rect.height
          monitor.group.position.copy(worldPosition)
          monitor.group.quaternion.copy(stageRef.camera.quaternion)
          monitor.group.rotateY((centerX < window.innerWidth * 0.5 ? 1 : -1) * Math.PI / 30)
          // Compensate the shallow presentation tilt so the projected shell
          // still occupies the figure width rather than shrinking away from it.
          const tiltCompensation = 1 / Math.cos(Math.PI / 30)
          monitor.group.scale.set(
            worldWidth * 0.5 * tiltCompensation,
            worldHeight * 0.5,
            Math.min(worldWidth, worldHeight) * 0.5,
          )
          monitor.group.visible = true

          if (index === 0) {
            dockPosition.set(0, 0, 0.04 * monitor.group.scale.z)
              .applyQuaternion(monitor.group.quaternion)
              .add(worldPosition)
            const range = platformRanges.get(PLATFORM_IDS[0])
            onAtomicityBoot(range ? localProgress(globalProgress, range) : 0, dockPosition)
          }
        }
      })
    },
    update(local, _dt, global = 0) {
      buildLocal = Math.min(1, Math.max(0, local))
      globalProgress = global
      onBuildProgress(buildLocal)
      for (let index = 0; index < monitors.length; index += 1) {
        const range = platformRanges.get(PLATFORM_IDS[index])
        const boot = range ? localProgress(global, range) : 0
        monitors[index].material.uniforms.uBoot.value = boot
      }

      if (!stageRef || this.range[1] <= this.range[0]) return
      const margin = Math.max(0.015, (this.range[1] - this.range[0]) * 0.16)
      const nearAct = global >= this.range[0] - margin && global <= this.range[1] + margin
      if (nearAct) ensureTextures()
      else disposeTextures()
    },
    setPlatformRanges(ranges) {
      platformRanges.clear()
      ranges.forEach((range, id) => platformRanges.set(id, range))
    },
  }
}

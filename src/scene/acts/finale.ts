import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three'
import type { CameraKeyframes } from '../camera'
import { onStageFrame } from '../stage'
import type { Act, Stage } from '../types'

interface FinaleActs {
  operators: Act
  support: Act
  shipped: Act
}

interface MiniDrone {
  group: Group
  body: Mesh
}

const radialGlowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const radialGlowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5));
    if (d > 0.5) discard;
    float glow = pow(smoothstep(0.5, 0.0, d), 2.0);
    gl_FragColor = vec4(uColor * (1.0 + glow), glow * uOpacity);
  }
`

function smoothstep(value: number): number {
  const clamped = Math.min(1, Math.max(0, value))
  return clamped * clamped * (3 - 2 * clamped)
}

export function createFinaleCameraKeyframes(previous: CameraKeyframes): CameraKeyframes {
  const landscapeEnd = previous.landscape.position[previous.landscape.position.length - 1]
  const portraitEnd = previous.portrait.position[previous.portrait.position.length - 1]
  const landscapeLook = previous.landscape.lookAt[previous.landscape.lookAt.length - 1]
  const portraitLook = previous.portrait.lookAt[previous.portrait.lookAt.length - 1]
  return {
    actIds: [...(previous.actIds ?? []), 'studio', 'support', 'start'],
    actStops: [...(previous.actStops ?? [0, 1]).map((stop) => stop * 0.72), 0.82, 0.91, 1],
    landscape: {
      position: [
        ...previous.landscape.position,
        [landscapeEnd[0] - 0.08, landscapeEnd[1] + 0.08, landscapeEnd[2] + 0.42],
        [landscapeEnd[0] - 0.12, landscapeEnd[1] + 0.1, landscapeEnd[2] + 0.5],
        [landscapeEnd[0] - 0.16, landscapeEnd[1] + 0.06, landscapeEnd[2] + 0.36],
      ],
      lookAt: [
        ...previous.landscape.lookAt,
        [landscapeLook[0], landscapeLook[1] - 0.03, landscapeLook[2]],
        [landscapeLook[0], landscapeLook[1] - 0.05, landscapeLook[2]],
        [landscapeLook[0], landscapeLook[1] - 0.02, landscapeLook[2]],
      ],
    },
    portrait: {
      position: [
        ...previous.portrait.position,
        [portraitEnd[0] - 0.04, portraitEnd[1] + 0.06, portraitEnd[2] + 0.46],
        [portraitEnd[0] - 0.06, portraitEnd[1] + 0.08, portraitEnd[2] + 0.54],
        [portraitEnd[0] - 0.08, portraitEnd[1] + 0.04, portraitEnd[2] + 0.4],
      ],
      lookAt: [
        ...previous.portrait.lookAt,
        [portraitLook[0], portraitLook[1] - 0.025, portraitLook[2]],
        [portraitLook[0], portraitLook[1] - 0.04, portraitLook[2]],
        [portraitLook[0], portraitLook[1] - 0.015, portraitLook[2]],
      ],
    },
  }
}

export function createFinaleActs(): FinaleActs {
  let stageRef: Stage | null = null
  let initialized = false
  let machine: Group | null = null
  let landing: Group | null = null
  let packet: Group | null = null
  let packetGlow: MeshBasicMaterial | null = null
  let padGeometry: BufferGeometry | null = null
  let padVertexCount = 0
  let operatorLocal = 0
  let supportLocal = 0
  let shippedLocal = 0
  let blueprintMaterial: LineBasicMaterial | null = null
  let monitorFrameMaterial: LineBasicMaterial | null = null
  let screenMaterial: MeshBasicMaterial | null = null
  let screenGlowMaterial: ShaderMaterial | null = null
  let droneMaterial: MeshBasicMaterial | null = null
  let droneGlowMaterial: ShaderMaterial | null = null
  let statusMaterial: MeshBasicMaterial | null = null
  const drones: MiniDrone[] = []
  const center = new Vector3()
  const ndcPoint = new Vector3()
  const rayDirection = new Vector3()
  const cameraForward = new Vector3()

  const placeAtScreen = (group: Group, centerX: number, centerY: number, depth: number, scale: number) => {
    if (!stageRef) return
    ndcPoint.set(centerX / window.innerWidth * 2 - 1, 1 - centerY / window.innerHeight * 2, 0.5)
    ndcPoint.unproject(stageRef.camera)
    stageRef.camera.getWorldDirection(cameraForward)
    rayDirection.copy(ndcPoint).sub(stageRef.camera.position).normalize()
    const distance = depth / Math.max(0.001, rayDirection.dot(cameraForward))
    center.copy(stageRef.camera.position).addScaledVector(rayDirection, distance)
    group.position.copy(center)
    group.quaternion.copy(stageRef.camera.quaternion)
    group.scale.setScalar(scale)
  }

  const setMachineIntensity = (ambient: boolean) => {
    if (!blueprintMaterial || !monitorFrameMaterial || !screenMaterial || !screenGlowMaterial || !droneMaterial || !droneGlowMaterial || !statusMaterial) return
    blueprintMaterial.opacity = ambient ? 0.11 : 0.62
    monitorFrameMaterial.opacity = ambient ? 0.1 : 0.72
    screenMaterial.opacity = ambient ? 0.06 : 0.2
    screenGlowMaterial.uniforms.uOpacity.value = ambient ? 0.035 : 0.16
    droneMaterial.opacity = ambient ? 0.12 : 0.85
    droneGlowMaterial.uniforms.uOpacity.value = ambient ? 0.04 : 0.5
    statusMaterial.opacity = ambient ? 0.12 : 0.82
  }

  const initialize = (stage: Stage) => {
    if (initialized) return
    initialized = true
    stageRef = stage

    machine = new Group()
    machine.name = 'finale-miniature-machine'
    machine.visible = false
    blueprintMaterial = new LineBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.62, depthWrite: false, toneMapped: false })
    const chassis = new LineSegments(new EdgesGeometry(new BoxGeometry(2.1, 1.08, 0.3)), blueprintMaterial)
    machine.add(chassis)

    monitorFrameMaterial = new LineBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.72, depthWrite: false, toneMapped: false })
    screenMaterial = new MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.2, blending: AdditiveBlending, depthWrite: false, toneMapped: false })
    screenGlowMaterial = new ShaderMaterial({
      vertexShader: radialGlowVertex,
      fragmentShader: radialGlowFragment,
      uniforms: { uColor: { value: new Vector3(0.486, 0.361, 1) }, uOpacity: { value: 0.16 } },
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    })
    for (let index = 0; index < 2; index += 1) {
      const monitor = new Group()
      const shell = new LineSegments(new EdgesGeometry(new BoxGeometry(0.82, 0.5, 0.055)), monitorFrameMaterial)
      const screen = new Mesh(new PlaneGeometry(0.72, 0.4), screenMaterial)
      const screenGlow = new Mesh(new PlaneGeometry(0.94, 0.6), screenGlowMaterial)
      screenGlow.position.z = -0.012
      screen.position.z = 0.031
      monitor.add(screenGlow, shell, screen)
      monitor.position.set(index === 0 ? -0.52 : 0.52, index === 0 ? 0.18 : -0.12, 0.3)
      monitor.rotation.y = index === 0 ? 0.12 : -0.12
      machine.add(monitor)
    }

    droneMaterial = new MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false, toneMapped: false })
    droneGlowMaterial = new ShaderMaterial({
      vertexShader: radialGlowVertex,
      fragmentShader: radialGlowFragment,
      uniforms: { uColor: { value: new Vector3(0.486, 0.361, 1) }, uOpacity: { value: 0.5 } },
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    })
    statusMaterial = new MeshBasicMaterial({ color: 0x3ddc84, transparent: true, opacity: 0.82, blending: AdditiveBlending, depthWrite: false, toneMapped: false })
    for (let index = 0; index < 3; index += 1) {
      const group = new Group()
      const glow = new Mesh(new PlaneGeometry(0.31, 0.31), droneGlowMaterial)
      const body = new Mesh(new OctahedronGeometry(0.052, 0), droneMaterial)
      const status = new Mesh(new SphereGeometry(0.018, 6, 4), statusMaterial)
      status.position.set(0.055, 0.035, 0.02)
      group.add(glow, body, status)
      drones.push({ group, body })
      machine.add(group)
    }
    stage.scene.add(machine)

    landing = new Group()
    landing.name = 'shipped-landing'
    landing.visible = false
    const segments = stage.tier.name === 'low' ? 40 : 72
    const positions: number[] = []
    for (let index = 0; index < segments; index += 1) {
      const a0 = index / segments * Math.PI * 2
      const a1 = (index + 1) / segments * Math.PI * 2
      positions.push(Math.cos(a0), Math.sin(a0) * 0.32, 0, Math.cos(a1), Math.sin(a1) * 0.32, 0)
    }
    for (let spoke = 0; spoke < 8; spoke += 1) {
      const angle = spoke / 8 * Math.PI * 2
      positions.push(0, 0, 0, Math.cos(angle), Math.sin(angle) * 0.32, 0)
    }
    padGeometry = new BufferGeometry()
    padGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    padVertexCount = positions.length / 3
    padGeometry.setDrawRange(0, 0)
    const pad = new LineSegments(padGeometry, new LineBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.62, depthWrite: false }))
    pad.rotation.x = -0.18
    landing.add(pad)

    packet = new Group()
    const core = new Mesh(new SphereGeometry(0.065, 10, 7), new MeshBasicMaterial({ color: 0xffffff, toneMapped: false }))
    packetGlow = new MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.42, blending: AdditiveBlending, depthWrite: false, toneMapped: false })
    const glow = new Mesh(new SphereGeometry(0.18, 10, 7), packetGlow)
    packet.add(glow, core)
    landing.add(packet)
    stage.scene.add(landing)

    const studio = document.querySelector<HTMLElement>('#studio')
    const studioShell = studio?.querySelector<HTMLElement>('.section-shell')
    const studioHeading = studio?.querySelector<HTMLElement>('.section-heading')
    const operatorGrid = studio?.querySelector<HTMLElement>('.operator-grid')
    const support = document.querySelector<HTMLElement>('#support')
    const supportShell = support?.querySelector<HTMLElement>('.section-shell')
    const supportHeading = support?.querySelector<HTMLElement>('.section-heading')
    const planGrid = support?.querySelector<HTMLElement>('.plan-grid')
    const start = document.querySelector<HTMLElement>('#start')
    const startInner = start?.querySelector<HTMLElement>('.start-inner')
    const startCta = start?.querySelector<HTMLElement>('.start-cta')

    onStageFrame(stage, (time) => {
      if (!stageRef || !machine || !landing || !packet || !packetGlow || !padGeometry) return
      machine.visible = false
      landing.visible = false

      if (operatorLocal > 0 && operatorLocal < 1 && studio && studioShell && studioHeading && operatorGrid) {
        const sectionRect = studio.getBoundingClientRect()
        const shellRect = studioShell.getBoundingClientRect()
        const headingRect = studioHeading.getBoundingClientRect()
        const gridRect = operatorGrid.getBoundingClientRect()
        if (sectionRect.bottom > 0 && sectionRect.top < window.innerHeight && shellRect.width > 0 && gridRect.height > 0) {
          const x = stageRef.portrait ? shellRect.left + shellRect.width * 0.5 : shellRect.right - Math.min(shellRect.width * 0.17, 190)
          const y = stageRef.portrait ? headingRect.bottom + Math.min((gridRect.top - headingRect.bottom) * 0.5, 90) : headingRect.top + headingRect.height * 0.48
          const recede = 1 - smoothstep(operatorLocal) * 0.36
          placeAtScreen(machine, x, y, 5, (stageRef.portrait ? 0.34 : 0.46) * recede)
          setMachineIntensity(false)
          drones.forEach((drone, index) => {
            const angle = time * (0.42 + index * 0.05) + index * Math.PI * 2 / 3
            drone.group.visible = true
            drone.group.position.set(Math.cos(angle) * 1.45, Math.sin(angle * 1.3) * 0.72, Math.sin(angle) * 0.38)
            drone.body.rotation.set(time * 0.5, angle, time * 0.3)
          })
          machine.visible = true
        }
      } else if (supportLocal > 0 && supportLocal < 1 && support && supportShell && supportHeading && planGrid) {
        const sectionRect = support.getBoundingClientRect()
        const shellRect = supportShell.getBoundingClientRect()
        const headingRect = supportHeading.getBoundingClientRect()
        const plansRect = planGrid.getBoundingClientRect()
        if (sectionRect.bottom > 0 && sectionRect.top < window.innerHeight && shellRect.width > 0 && plansRect.height > 0) {
          const x = stageRef.portrait ? shellRect.right - 62 : shellRect.right - 90
          const y = Math.max(sectionRect.top + 74, headingRect.top + 52)
          placeAtScreen(machine, x, y, 5.4, stageRef.portrait ? 0.2 : 0.25)
          setMachineIntensity(true)
          drones.forEach((drone, index) => {
            drone.group.visible = index < 2
            const angle = time * 0.22 + index * Math.PI
            drone.group.position.set(Math.cos(angle) * 1.55, Math.sin(angle) * 0.46, Math.sin(angle) * 0.3)
            drone.body.rotation.set(time * 0.2, angle, 0)
          })
          machine.visible = true
        }
      }

      if (shippedLocal > 0 && shippedLocal < 1 && start && startInner && startCta) {
        const sectionRect = start.getBoundingClientRect()
        const innerRect = startInner.getBoundingClientRect()
        const ctaRect = startCta.getBoundingClientRect()
        if (sectionRect.bottom > 0 && sectionRect.top < window.innerHeight && innerRect.width > 0 && ctaRect.height > 0) {
          const x = innerRect.left + innerRect.width * 0.5
          const y = Math.min(sectionRect.bottom - 70, ctaRect.bottom + (stageRef.portrait ? 118 : 96))
          placeAtScreen(landing, x, y, 4.6, stageRef.portrait ? 0.68 : 0.82)
          const draw = smoothstep((shippedLocal - 0.12) / 0.48)
          const visibleVertices = Math.floor(padVertexCount * draw / 2) * 2
          padGeometry.setDrawRange(0, visibleVertices)
          const descend = smoothstep(shippedLocal / 0.7)
          const settle = smoothstep((shippedLocal - 0.7) / 0.3)
          packet.position.set(0, 1.35 * (1 - descend) + 0.14 - settle * 0.06, 0.12)
          packet.scale.setScalar(0.78 + Math.sin(time * 2.1) * 0.04 * (1 - settle))
          packetGlow.opacity = 0.42 * (1 - smoothstep((shippedLocal - 0.7) / 0.22))
          landing.visible = true
        }
      }
    })
  }

  return {
    operators: {
      id: 'studio',
      range: [0, 0],
      init: initialize,
      update(local) { operatorLocal = Math.min(1, Math.max(0, local)) },
    },
    support: {
      id: 'support',
      range: [0, 0],
      init: initialize,
      update(local) { supportLocal = Math.min(1, Math.max(0, local)) },
    },
    shipped: {
      id: 'start',
      range: [0, 0],
      init: initialize,
      update(local) { shippedLocal = Math.min(1, Math.max(0, local)) },
    },
  }
}

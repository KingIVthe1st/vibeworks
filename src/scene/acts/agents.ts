import {
  AdditiveBlending,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OctahedronGeometry,
  PlaneGeometry,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from 'three'
import type { CameraKeyframes } from '../camera'
import { onStageFrame } from '../stage'
import type { Act, Stage } from '../types'

const glowVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    float distanceFromCenter = distance(vUv, vec2(0.5));
    if (distanceFromCenter > 0.5) discard;
    float glow = pow(smoothstep(0.5, 0.0, distanceFromCenter), 2.2);
    gl_FragColor = vec4(uColor * (1.0 + glow * 0.7), glow * 0.62);
  }
`

function smoothstep(value: number): number {
  const clamped = Math.min(1, Math.max(0, value))
  return clamped * clamped * (3 - 2 * clamped)
}

function seededRandom(seed = 0xa63e175): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

export function createAgentsCameraKeyframes(previous: CameraKeyframes): CameraKeyframes {
  const landscapeEnd = previous.landscape.position[previous.landscape.position.length - 1]
  const portraitEnd = previous.portrait.position[previous.portrait.position.length - 1]
  const landscapeLook = previous.landscape.lookAt[previous.landscape.lookAt.length - 1]
  const portraitLook = previous.portrait.lookAt[previous.portrait.lookAt.length - 1]
  return {
    actIds: [...(previous.actIds ?? []), 'agents'],
    actStops: [...(previous.actStops ?? [0, 1]).map((stop) => stop * 0.84), 1],
    landscape: {
      position: [...previous.landscape.position, [landscapeEnd[0] - 0.12, landscapeEnd[1] + 0.08, landscapeEnd[2] + 0.36]],
      lookAt: [...previous.landscape.lookAt, [landscapeLook[0], landscapeLook[1] - 0.03, landscapeLook[2]]],
    },
    portrait: {
      position: [...previous.portrait.position, [portraitEnd[0] - 0.06, portraitEnd[1] + 0.05, portraitEnd[2] + 0.42]],
      lookAt: [...previous.portrait.lookAt, [portraitLook[0], portraitLook[1] - 0.02, portraitLook[2]]],
    },
  }
}

export function createAgentsAct(): Act {
  let stageRef: Stage | null = null
  let swarm: Group | null = null
  let body: InstancedMesh | null = null
  let glow: InstancedMesh | null = null
  let status: InstancedMesh | null = null
  let dockPulse: Group | null = null
  let localProgress = 0
  const center = new Vector3()
  const ndcPoint = new Vector3()
  const rayDirection = new Vector3()
  const cameraForward = new Vector3()
  const dummy = new Object3D()
  const bodyPosition = new Vector3()
  const dotPosition = new Vector3()
  const dotOffset = new Vector3(0.055, 0.04, 0.045)
  const projectedPosition = new Vector3()
  let phase = new Float32Array(0)
  let rateA = new Float32Array(0)
  let rateB = new Float32Array(0)
  let radiusX = new Float32Array(0)
  let radiusY = new Float32Array(0)
  let radiusZ = new Float32Array(0)

  return {
    id: 'agents',
    range: [0, 0],
    init(stage) {
      stageRef = stage
      const count = Math.max(6, Math.round(24 * stage.tier.instances))
      const random = seededRandom()
      phase = new Float32Array(count)
      rateA = new Float32Array(count)
      rateB = new Float32Array(count)
      radiusX = new Float32Array(count)
      radiusY = new Float32Array(count)
      radiusZ = new Float32Array(count)

      swarm = new Group()
      swarm.name = 'agents-swarm'
      swarm.visible = false
      body = new InstancedMesh(
        new OctahedronGeometry(0.045, 0),
        new MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
        count,
      )
      glow = new InstancedMesh(
        new PlaneGeometry(0.22, 0.22),
        new ShaderMaterial({
          vertexShader: glowVertex,
          fragmentShader: glowFragment,
          uniforms: { uColor: { value: new Vector3(0.486, 0.361, 1) } },
          transparent: true,
          blending: AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
        count,
      )
      status = new InstancedMesh(
        new SphereGeometry(0.014, 6, 4),
        new MeshBasicMaterial({ color: 0x3ddc84, blending: AdditiveBlending, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }),
        count,
      )
      dockPulse = new Group()
      const goldGlow = new Mesh(
        new PlaneGeometry(0.38, 0.38),
        new ShaderMaterial({
          vertexShader: glowVertex.replace('instanceMatrix * ', ''),
          fragmentShader: glowFragment,
          uniforms: { uColor: { value: new Vector3(0.91, 0.702, 0.294) } },
          transparent: true,
          blending: AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      )
      const goldCore = new Mesh(
        new OctahedronGeometry(0.058, 0),
        new MeshBasicMaterial({ color: 0xe8b34b, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
      )
      dockPulse.add(goldGlow, goldCore)
      dockPulse.visible = false
      body.frustumCulled = false
      glow.frustumCulled = false
      status.frustumCulled = false
      swarm.add(glow, body, status, dockPulse)
      stage.scene.add(swarm)

      for (let index = 0; index < count; index += 1) {
        phase[index] = random() * Math.PI * 2
        rateA[index] = 0.42 + random() * 0.45
        rateB[index] = 0.58 + random() * 0.52
        radiusX[index] = 0.5 + random() * 0.72
        radiusY[index] = 0.35 + random() * 0.52
        radiusZ[index] = 0.26 + random() * 0.55
      }

      const section = document.querySelector<HTMLElement>('#agents')
      const shell = section?.querySelector<HTMLElement>('.section-shell')
      const heading = section?.querySelector<HTMLElement>('.section-heading')
      const cards = section?.querySelector<HTMLElement>('.card-grid')
      const depth = 4.6

      onStageFrame(stage, (time) => {
        if (!stageRef || !swarm || !body || !glow || !status || !dockPulse || !section || !shell || !heading || !cards) return
        swarm.visible = false
        const sectionRect = section.getBoundingClientRect()
        const shellRect = shell.getBoundingClientRect()
        const headingRect = heading.getBoundingClientRect()
        const cardsRect = cards.getBoundingClientRect()
        const active = localProgress > 0 && localProgress < 1
        const intersects = sectionRect.bottom > 0 && sectionRect.top < window.innerHeight
        if (!active || !intersects || shellRect.width <= 0 || headingRect.height <= 0 || cardsRect.height <= 0) return

        const centerX = stageRef.portrait
          ? cardsRect.left + cardsRect.width * 0.5
          : shellRect.right - Math.min(shellRect.width * 0.19, 220)
        const centerY = stageRef.portrait
          ? headingRect.bottom + Math.max(24, (cardsRect.top - headingRect.bottom) * 0.5)
          : headingRect.top + headingRect.height * 0.5
        ndcPoint.set(centerX / window.innerWidth * 2 - 1, 1 - centerY / window.innerHeight * 2, 0.5)
        ndcPoint.unproject(stageRef.camera)
        stageRef.camera.getWorldDirection(cameraForward)
        rayDirection.copy(ndcPoint).sub(stageRef.camera.position).normalize()
        const distance = depth / Math.max(0.001, rayDirection.dot(cameraForward))
        center.copy(stageRef.camera.position).addScaledVector(rayDirection, distance)
        swarm.position.copy(center)
        swarm.quaternion.copy(stageRef.camera.quaternion)
        swarm.scale.setScalar(stageRef.portrait ? 0.86 : 1)
        swarm.updateWorldMatrix(true, false)
        swarm.visible = true

        const entry = smoothstep(localProgress / 0.24)
        const cycle = time % 4
        const dockIn = smoothstep((cycle - 0.6) / 0.8)
        const dockOut = smoothstep((cycle - 1.8) / 0.8)
        const dockAmount = dockIn * (1 - dockOut)
        const goldPhase = Math.min(1, Math.max(0, (cycle - 1.4) / 0.4))
        const goldStrength = cycle >= 1.4 && cycle <= 1.8 ? Math.sin(goldPhase * Math.PI) : 0

        for (let index = 0; index < body.count; index += 1) {
          const p = phase[index]
          let x = Math.sin(time * rateA[index] + p) * radiusX[index]
          let y = Math.sin(time * rateB[index] + p * 1.37) * radiusY[index]
          let z = Math.cos(time * rateA[index] * 0.82 + p) * radiusZ[index]
          const edgePush = (1 - entry) * 2.4
          x += Math.sign(x || Math.sin(p)) * edgePush
          y += Math.sign(y || Math.cos(p)) * edgePush * 0.55
          if (index === 0) {
            x *= 1 - dockAmount
            y *= 1 - dockAmount
            z *= 1 - dockAmount
          }
          bodyPosition.set(x, y, z)
          const depthScale = 0.72 + ((z / Math.max(0.001, radiusZ[index])) * 0.5 + 0.5) * 0.46
          projectedPosition.copy(bodyPosition).applyMatrix4(swarm.matrixWorld).project(stageRef.camera)
          const screenX = (projectedPosition.x * 0.5 + 0.5) * window.innerWidth
          const screenY = (1 - (projectedPosition.y * 0.5 + 0.5)) * window.innerHeight
          const edgeDistance = Math.min(screenX / window.innerWidth, 1 - screenX / window.innerWidth, screenY / window.innerHeight, 1 - screenY / window.innerHeight)
          const edgeFade = smoothstep(edgeDistance / 0.06)
          const overHeading = screenX >= headingRect.left - 18 && screenX <= headingRect.right + 18
            && screenY >= headingRect.top - 18 && screenY <= headingRect.bottom + 18
          const overCards = screenY >= cardsRect.top - 12 && screenY <= cardsRect.bottom + 12
          const safeAreaFade = overHeading || overCards ? 0 : 1
          const visualFade = edgeFade * safeAreaFade
          dummy.position.copy(bodyPosition)
          dummy.rotation.set(time * 0.7 + p, time * 0.5 + p, time * 0.35)
          dummy.scale.setScalar(entry * depthScale * visualFade * (index === 0 ? 1 + goldStrength * 0.9 : 1))
          dummy.updateMatrix()
          body.setMatrixAt(index, dummy.matrix)

          dummy.position.copy(bodyPosition)
          dummy.rotation.set(0, 0, 0)
          dummy.scale.setScalar(entry * depthScale * visualFade * (index === 0 ? 1 + goldStrength * 1.4 : 1))
          dummy.updateMatrix()
          glow.setMatrixAt(index, dummy.matrix)

          dotPosition.copy(bodyPosition).add(dotOffset)
          dummy.position.copy(dotPosition)
          dummy.rotation.set(0, 0, 0)
          dummy.scale.setScalar(entry * visualFade * (index === 0 ? 1 + goldStrength * 1.8 : 1))
          dummy.updateMatrix()
          status.setMatrixAt(index, dummy.matrix)

          if (index === 0) {
            dockPulse.position.copy(bodyPosition)
            dockPulse.scale.setScalar(entry * depthScale * visualFade * goldStrength * 1.7)
            dockPulse.visible = visualFade > 0 && goldStrength > 0.01
          }
        }
        body.instanceMatrix.needsUpdate = true
        glow.instanceMatrix.needsUpdate = true
        status.instanceMatrix.needsUpdate = true
      })
    },
    update(local) {
      localProgress = Math.min(1, Math.max(0, local))
    },
  }
}

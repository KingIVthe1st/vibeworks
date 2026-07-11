import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Points,
  QuadraticBezierCurve3,
  ShaderMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from 'three'
import type { CameraKeyframes } from '../camera'
import { onStageFrame } from '../stage'
import type { Act, Stage } from '../types'

const NODE_COORDINATES: Array<[number, number]> = [
  [0.58, -1.3], [0.22, -0.2], [0.72, 0.72], [0.1, 1.86],
  [-0.48, 2.65], [-0.78, -2.36], [-0.18, -1.78], [0.45, 2.95],
]

const gridVertex = /* glsl */ `
  uniform float uPointSize;
  uniform float uViewportHeight;
  varying float vEdgeAlpha;
  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = max(1.0, uPointSize * uViewportHeight * 0.5 / max(1.0, -viewPosition.z));
    vec2 screenUv = gl_Position.xy / gl_Position.w * 0.5 + 0.5;
    float edgeDistance = min(min(screenUv.x, 1.0 - screenUv.x), min(screenUv.y, 1.0 - screenUv.y));
    vEdgeAlpha = smoothstep(0.0, 0.06, edgeDistance);
  }
`

const gridFragment = /* glsl */ `
  varying float vEdgeAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.12, d) * 0.58 * vEdgeAlpha;
    gl_FragColor = vec4(vec3(0.486, 0.361, 1.0), alpha);
  }
`

function spherePoint(latitude: number, longitude: number, radius = 1): Vector3 {
  const cosLatitude = Math.cos(latitude)
  return new Vector3(
    Math.cos(longitude) * cosLatitude * radius,
    Math.sin(latitude) * radius,
    Math.sin(longitude) * cosLatitude * radius,
  )
}

export function fibonacciSpherePositions(count: number): Float32Array {
  const positions = new Float32Array(Math.max(0, count) * 3)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / Math.max(1, count - 1)) * 2
    const radius = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = goldenAngle * index
    positions[index * 3] = Math.cos(theta) * radius
    positions[index * 3 + 1] = y
    positions[index * 3 + 2] = Math.sin(theta) * radius
  }
  return positions
}

function smoothstep(value: number): number {
  const clamped = Math.min(1, Math.max(0, value))
  return clamped * clamped * (3 - 2 * clamped)
}

export function createDeployCameraKeyframes(previous: CameraKeyframes): CameraKeyframes {
  const landscapeEnd = previous.landscape.position[previous.landscape.position.length - 1]
  const portraitEnd = previous.portrait.position[previous.portrait.position.length - 1]
  const landscapeLook = previous.landscape.lookAt[previous.landscape.lookAt.length - 1]
  const portraitLook = previous.portrait.lookAt[previous.portrait.lookAt.length - 1]
  return {
    actIds: [...(previous.actIds ?? []), 'process'],
    actStops: [...(previous.actStops ?? [0, 1]).map((stop) => stop * 0.86), 1],
    landscape: {
      position: [...previous.landscape.position, [landscapeEnd[0] - 0.1, landscapeEnd[1] + 0.06, landscapeEnd[2] + 0.28]],
      lookAt: [...previous.landscape.lookAt, [landscapeLook[0], landscapeLook[1] - 0.02, landscapeLook[2]]],
    },
    portrait: {
      position: [...previous.portrait.position, [portraitEnd[0] - 0.04, portraitEnd[1] + 0.04, portraitEnd[2] + 0.32]],
      lookAt: [...previous.portrait.lookAt, [portraitLook[0], portraitLook[1] - 0.02, portraitLook[2]]],
    },
  }
}

export function createDeployAct(onParticleHandoff: (local: number, packet: Vector3) => void): Act {
  let stageRef: Stage | null = null
  let root: Group | null = null
  let globe: Group | null = null
  let packet: Group | null = null
  let liveNodes: InstancedMesh | null = null
  let localProgress = 0
  const curves: QuadraticBezierCurve3[] = []
  const nodePositions: Vector3[] = []
  const center = new Vector3()
  const ndcPoint = new Vector3()
  const rayDirection = new Vector3()
  const cameraForward = new Vector3()
  const packetPosition = new Vector3()
  const packetWorld = new Vector3()
  const dummy = new Object3D()

  return {
    id: 'process',
    range: [0, 0],
    init(stage) {
      stageRef = stage
      root = new Group()
      root.name = 'deploy-network'
      root.visible = false
      globe = new Group()
      root.add(globe)
      stage.scene.add(root)

      const pointCount = Math.max(180, Math.round(900 * stage.tier.instances))
      const pointGeometry = new BufferGeometry()
      pointGeometry.setAttribute('position', new Float32BufferAttribute(fibonacciSpherePositions(pointCount), 3))
      const gridMaterial = new ShaderMaterial({
        vertexShader: gridVertex,
        fragmentShader: gridFragment,
        uniforms: {
          uPointSize: { value: stage.portrait ? 0.026 : 0.022 },
          uViewportHeight: { value: window.innerHeight * stage.tier.dpr },
        },
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
      const grid = new Points(pointGeometry, gridMaterial)
      globe.add(grid)

      NODE_COORDINATES.forEach(([latitude, longitude]) => nodePositions.push(spherePoint(latitude, longitude, 1.025)))
      const arcMaterial = new MeshBasicMaterial({
        color: 0x7c5cff,
        transparent: true,
        opacity: 0.23,
        blending: AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      })
      for (let index = 0; index < 12; index += 1) {
        const start = nodePositions[(index + 3) % nodePositions.length]
        const end = nodePositions[index % nodePositions.length]
        const midpoint = new Vector3().copy(start).add(end).normalize().multiplyScalar(1.38)
        const curve = new QuadraticBezierCurve3(start.clone(), midpoint, end.clone())
        curves.push(curve)
        globe.add(new Mesh(
          new TubeGeometry(curve, stage.tier.name === 'high' ? 32 : 20, 0.008, 4, false),
          arcMaterial,
        ))
      }

      liveNodes = new InstancedMesh(
        new SphereGeometry(0.036, stage.tier.name === 'high' ? 10 : 6, 6),
        new MeshBasicMaterial({ color: 0x3ddc84, blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false }),
        nodePositions.length,
      )
      liveNodes.frustumCulled = false
      globe.add(liveNodes)

      packet = new Group()
      const packetCore = new Mesh(
        new SphereGeometry(0.052, 8, 6),
        new MeshBasicMaterial({ color: 0x7c5cff, blending: AdditiveBlending, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }),
      )
      const packetGlow = new Mesh(
        new SphereGeometry(0.105, 8, 6),
        new MeshBasicMaterial({ color: 0x7c5cff, transparent: true, opacity: 0.24, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
      )
      packet.add(packetGlow, packetCore)
      globe.add(packet)

      const section = document.querySelector<HTMLElement>('#process')
      const shell = section?.querySelector<HTMLElement>('.section-shell')
      const heading = section?.querySelector<HTMLElement>('.process-heading')
      const proof = section?.querySelector<HTMLElement>('.proof-strip')
      const cards = section?.querySelector<HTMLElement>('.engagement-grid')
      const depth = 4.8

      onStageFrame(stage, (time) => {
        if (!stageRef || !root || !globe || !packet || !liveNodes || !section || !shell || !heading || !proof || !cards) return
        root.visible = false
        const sectionRect = section.getBoundingClientRect()
        const shellRect = shell.getBoundingClientRect()
        const headingRect = heading.getBoundingClientRect()
        const proofRect = proof.getBoundingClientRect()
        const cardsRect = cards.getBoundingClientRect()
        const active = localProgress > 0 && localProgress < 1
        const intersects = sectionRect.bottom > 0 && sectionRect.top < window.innerHeight
        if (!active || !intersects || shellRect.width <= 0 || headingRect.height <= 0 || proofRect.height <= 0 || cardsRect.height <= 0) return

        const desiredCenterX = stageRef.portrait
          ? proofRect.left + proofRect.width * 0.5
          : shellRect.right - Math.min(shellRect.width * 0.2, 230)
        const centerX = stageRef.portrait
          ? desiredCenterX
          : Math.min(window.innerWidth * 0.88, Math.max(desiredCenterX, headingRect.right + 180))
        const centerY = stageRef.portrait
          ? headingRect.bottom + Math.min(90, Math.max(32, (proofRect.top - headingRect.bottom) * 0.5))
          : headingRect.top + headingRect.height * 0.48
        ndcPoint.set(centerX / window.innerWidth * 2 - 1, 1 - centerY / window.innerHeight * 2, 0.5)
        ndcPoint.unproject(stageRef.camera)
        stageRef.camera.getWorldDirection(cameraForward)
        rayDirection.copy(ndcPoint).sub(stageRef.camera.position).normalize()
        const distance = depth / Math.max(0.001, rayDirection.dot(cameraForward))
        center.copy(stageRef.camera.position).addScaledVector(rayDirection, distance)
        root.position.copy(center)
        root.quaternion.copy(stageRef.camera.quaternion)
        root.scale.setScalar(stageRef.portrait ? 0.78 : 1.04)
        root.visible = true
        gridMaterial.uniforms.uPointSize.value = stageRef.portrait ? 0.026 : 0.022
        gridMaterial.uniforms.uViewportHeight.value = window.innerHeight * stageRef.tier.dpr

        globe.rotation.set(0.12, time * 0.075, time * 0.018)
        const pathProgress = Math.min(11.9999, localProgress * 12)
        const arcIndex = Math.floor(pathProgress)
        const arcLocal = pathProgress - arcIndex
        curves[arcIndex].getPoint(arcLocal, packetPosition)
        packet.position.copy(packetPosition)
        packet.scale.setScalar(smoothstep((localProgress - 0.07) / 0.12))

        for (let nodeIndex = 0; nodeIndex < nodePositions.length; nodeIndex += 1) {
          let latestArrival = -100
          for (let arc = nodeIndex; arc < 12; arc += nodePositions.length) {
            if (pathProgress >= arc + 1) latestArrival = arc + 1
          }
          const live = pathProgress >= nodeIndex + 1
          const sinceArrival = pathProgress - latestArrival
          const flare = sinceArrival >= 0 && sinceArrival < 0.7 ? Math.pow(1 - sinceArrival / 0.7, 2) : 0
          dummy.position.copy(nodePositions[nodeIndex])
          dummy.rotation.set(0, 0, 0)
          dummy.scale.setScalar(live ? 1 + flare * 3.2 : 0.001)
          dummy.updateMatrix()
          liveNodes.setMatrixAt(nodeIndex, dummy.matrix)
        }
        liveNodes.instanceMatrix.needsUpdate = true
        globe.updateWorldMatrix(true, false)
        packetWorld.copy(packetPosition)
        globe.localToWorld(packetWorld)
        onParticleHandoff(localProgress, packetWorld)
      })
    },
    update(local) {
      localProgress = Math.min(1, Math.max(0, local))
      if (localProgress === 0 || localProgress === 1) onParticleHandoff(localProgress, packetWorld)
    },
  }
}

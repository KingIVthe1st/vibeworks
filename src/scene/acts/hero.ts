import {
  AdditiveBlending,
  BackSide,
  BufferGeometry,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  InstancedMesh,
  Mesh,
  Object3D,
  PlaneGeometry,
  Points,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
} from 'three'
import type { CameraKeyframes } from '../camera'
import { onStageFrame } from '../stage'
import type { Act, Stage } from '../types'

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uDpr;
  uniform float uPulse;
  uniform vec3 uAnchor;

  void main() {
    vec3 p = position + uAnchor;
    p.x += sin(uTime * 0.37) * 0.10 + sin(uTime * 0.83 + 1.7) * 0.035;
    p.y += sin(uTime * 0.29 + 0.8) * 0.08 + cos(uTime * 0.71) * 0.025;
    p.z += cos(uTime * 0.31 + 2.1) * 0.06;

    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = min(96.0, uSize * uPulse * uDpr * (6.0 / max(1.0, -viewPosition.z)));
  }
`

const particleFragment = /* glsl */ `
  uniform float uBrightness;
  uniform float uPulse;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    float falloff = smoothstep(0.5, 0.0, dist);
    float core = smoothstep(0.14, 0.0, dist);
    vec3 violet = vec3(0.486, 0.361, 1.0);
    vec3 color = mix(violet, vec3(1.0), core);
    float energy = uBrightness * uPulse;
    float alpha = pow(falloff, 2.4) * mix(0.55, 1.0, core) * energy;
    gl_FragColor = vec4(color * energy, alpha);
  }
`

const streakVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform float uPortrait;
  uniform vec3 uAnchor;
  varying vec2 vUv;

  void main() {
    vec3 p = position;
    p.x *= uPulse * mix(1.0, 0.82, uPortrait);
    p += uAnchor;
    p.x += sin(uTime * 0.37) * 0.10 + sin(uTime * 0.83 + 1.7) * 0.035;
    p.y += sin(uTime * 0.29 + 0.8) * 0.08 + cos(uTime * 0.71) * 0.025;
    p.z += cos(uTime * 0.31 + 2.1) * 0.06;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const streakFragment = /* glsl */ `
  uniform float uBrightness;
  uniform float uPulse;
  varying vec2 vUv;

  void main() {
    vec2 p = abs(vUv - 0.5);
    float horizontal = pow(smoothstep(0.5, 0.0, p.x), 2.0);
    float vertical = pow(smoothstep(0.5, 0.0, p.y), 5.0);
    float alpha = horizontal * vertical * 0.10 * uBrightness * uPulse;
    gl_FragColor = vec4(vec3(0.486, 0.361, 1.0), alpha);
  }
`

const dustVertex = /* glsl */ `
  attribute float aOpacity;
  attribute float aPhase;
  attribute float aBand;
  attribute float aNear;
  uniform float uTime;
  uniform float uPortrait;
  uniform vec3 uAnchor;
  varying float vOpacity;
  varying vec2 vUv;

  void main() {
    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
    float depthRate = mix(0.55, 0.18, aBand);
    worldPosition.x += sin(uTime * depthRate + aPhase) * mix(0.10, 0.025, aBand);
    worldPosition.y += cos(uTime * depthRate * 0.7 + aPhase * 1.3) * mix(0.08, 0.02, aBand);
    worldPosition.x *= mix(1.0, 0.62, uPortrait);
    worldPosition.y *= mix(1.0, 1.22, uPortrait);
    worldPosition.xyz += uAnchor * aNear;
    vOpacity = aOpacity;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
  }
`

const dustFragment = /* glsl */ `
  varying float vOpacity;
  varying vec2 vUv;

  void main() {
    float dist = distance(vUv, vec2(0.5));
    float mote = smoothstep(0.5, 0.05, dist);
    gl_FragColor = vec4(vec3(0.64, 0.57, 1.0), mote * vOpacity);
  }
`

const voidVertex = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const voidFragment = /* glsl */ `
  uniform vec2 uResolution;

  float dither(vec2 p) {
    return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    uv = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float radial = 1.0 - smoothstep(0.05, 0.78, length(uv));
    vec3 center = vec3(0.02745, 0.01961, 0.07059);
    vec3 color = center * radial;
    color += (dither(gl_FragCoord.xy) - 0.5) / 255.0;
    gl_FragColor = vec4(max(color, 0.0), 1.0);
  }
`

function seededRandom(seed = 0x7c5cff): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 4294967296
  }
}

function createDust(stage: Stage): { mesh: InstancedMesh; material: ShaderMaterial } {
  const count = Math.round(400 * stage.tier.instances)
  const geometry = new PlaneGeometry(0.022, 0.022)
  const opacity = new Float32Array(count)
  const phase = new Float32Array(count)
  const band = new Float32Array(count)
  const near = new Float32Array(count)
  const material = new ShaderMaterial({
    vertexShader: dustVertex,
    fragmentShader: dustFragment,
    uniforms: {
      uTime: { value: 0 },
      uPortrait: { value: stage.portrait ? 1 : 0 },
      uAnchor: { value: new Vector3() },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    toneMapped: false,
  })
  const mesh = new InstancedMesh(geometry, material, count)
  const dummy = new Object3D()
  const random = seededRandom()
  const depthBands = [-2.8, -0.4, 2.2]

  for (let i = 0; i < count; i += 1) {
    const bandIndex = i % depthBands.length
    const normalizedBand = bandIndex / (depthBands.length - 1)
    const nearParticle = random() < 0.24
    const scale = 0.45 + random() * 1.15
    if (nearParticle) {
      const radius = Math.cbrt(random()) * 1.5
      const azimuth = random() * Math.PI * 2
      const polar = Math.acos(2 * random() - 1)
      dummy.position.set(
        radius * Math.sin(polar) * Math.cos(azimuth),
        radius * Math.sin(polar) * Math.sin(azimuth),
        radius * Math.cos(polar),
      )
    } else {
      dummy.position.set(
        (random() - 0.5) * 14,
        (random() - 0.5) * 8,
        depthBands[bandIndex] + (random() - 0.5) * 1.4,
      )
    }
    dummy.scale.setScalar(scale)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
    opacity[i] = 0.04 + random() * 0.08
    phase[i] = random() * Math.PI * 2
    band[i] = normalizedBand
    near[i] = nearParticle ? 1 : 0
  }

  geometry.setAttribute('aOpacity', new InstancedBufferAttribute(opacity, 1))
  geometry.setAttribute('aPhase', new InstancedBufferAttribute(phase, 1))
  geometry.setAttribute('aBand', new InstancedBufferAttribute(band, 1))
  geometry.setAttribute('aNear', new InstancedBufferAttribute(near, 1))
  mesh.instanceMatrix.needsUpdate = true
  mesh.frustumCulled = false
  mesh.renderOrder = -1
  return { mesh, material }
}

export const heroCameraKeyframes: CameraKeyframes = {
  landscape: {
    position: [
      [-0.627, 0.34, 5.967],
      [0, 0.38, 6],
      [0.627, 0.42, 5.967],
    ],
    lookAt: [
      [-0.05, 0.14, 0],
      [0, 0.17, 0],
      [0.05, 0.2, 0],
    ],
  },
  portrait: {
    position: [
      [-0.889, 1.58, 8.453],
      [0, 1.62, 8.5],
      [0.889, 1.66, 8.453],
    ],
    lookAt: [
      [-0.04, 1.18, 0],
      [0, 1.2, 0],
      [0.04, 1.22, 0],
    ],
  },
}

export function createHeroAct(): Act {
  let particleMaterial: ShaderMaterial | null = null
  let streakMaterial: ShaderMaterial | null = null
  let dustMaterial: ShaderMaterial | null = null
  let voidMaterial: ShaderMaterial | null = null
  let stageRef: Stage | null = null
  let localProgress = 0

  return {
    id: 'hero',
    range: [0, 0.12],
    init(stage) {
      stageRef = stage

      voidMaterial = new ShaderMaterial({
        vertexShader: voidVertex,
        fragmentShader: voidFragment,
        uniforms: { uResolution: { value: new Vector2(1, 1) } },
        side: BackSide,
        depthWrite: false,
        toneMapped: false,
      })
      const environment = new Mesh(new SphereGeometry(35, stage.tier.name === 'low' ? 24 : 48, 24), voidMaterial)
      environment.renderOrder = -100
      stage.scene.add(environment)

      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0], 3))
      particleMaterial = new ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: stage.portrait ? 44 : 55 },
          uDpr: { value: stage.tier.dpr },
          uPulse: { value: 1 },
          uBrightness: { value: 0.88 },
          uAnchor: { value: new Vector3() },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      })
      const particle = new Points(geometry, particleMaterial)
      particle.frustumCulled = false
      particle.renderOrder = 2
      stage.scene.add(particle)

      streakMaterial = new ShaderMaterial({
        vertexShader: streakVertex,
        fragmentShader: streakFragment,
        uniforms: {
          uTime: { value: 0 },
          uPulse: { value: 1 },
          uPortrait: { value: stage.portrait ? 1 : 0 },
          uBrightness: { value: 0.88 },
          uAnchor: { value: new Vector3() },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      })
      const streak = new Mesh(new PlaneGeometry(0.68, 0.035), streakMaterial)
      streak.frustumCulled = false
      streak.renderOrder = 1
      stage.scene.add(streak)

      const dust = createDust(stage)
      dustMaterial = dust.material
      stage.scene.add(dust.mesh)

      const resolution = new Vector2()
      onStageFrame(stage, (time) => {
        if (!particleMaterial || !streakMaterial || !dustMaterial || !voidMaterial || !stageRef) return
        const portrait = stageRef.portrait
        const pulse = 1 + Math.sin(time * (Math.PI * 2 / 3.5)) * 0.06
        const anchor = particleMaterial.uniforms.uAnchor.value as Vector3
        anchor.set(portrait ? 0 : 1.72, portrait ? 1.45 : 0.28, 0)
        particleMaterial.uniforms.uTime.value = time
        particleMaterial.uniforms.uSize.value = portrait ? 44 : 55
        particleMaterial.uniforms.uPulse.value = pulse
        streakMaterial.uniforms.uTime.value = time
        streakMaterial.uniforms.uPulse.value = pulse
        streakMaterial.uniforms.uPortrait.value = portrait ? 1 : 0
        streakMaterial.uniforms.uAnchor.value.copy(anchor)
        dustMaterial.uniforms.uTime.value = time
        dustMaterial.uniforms.uPortrait.value = portrait ? 1 : 0
        dustMaterial.uniforms.uAnchor.value.copy(anchor)
        stageRef.renderer.getDrawingBufferSize(resolution)
        voidMaterial.uniforms.uResolution.value.copy(resolution)
      })
    },
    update(local, _dt) {
      localProgress = Math.min(1, Math.max(0, local))
      const eased = localProgress * localProgress * (3 - 2 * localProgress)
      const brightness = 0.88 + eased * 0.42
      if (particleMaterial) particleMaterial.uniforms.uBrightness.value = brightness
      if (streakMaterial) streakMaterial.uniforms.uBrightness.value = brightness
    },
  }
}

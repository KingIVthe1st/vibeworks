import { SRGBColorSpace, Texture, TextureLoader } from 'three'

export async function loadActTextures(urls: string[]): Promise<Texture[]> {
  const loader = new TextureLoader()
  return Promise.all(urls.map(async (url) => {
    const texture = await loader.loadAsync(url)
    texture.colorSpace = SRGBColorSpace
    texture.anisotropy = 4
    texture.needsUpdate = true
    return texture
  }))
}

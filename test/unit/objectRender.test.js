import {describe, it, expect} from 'vitest'
import {
  File,
  FileAudio,
  FileVideo,
  Image,
  MapTrifold,
} from '../../src/icons/phosphor.js'
import {renderIcon} from '../../src/objectRender.js'

describe('renderIcon checksum', () => {
  it('uses checksum from media object itself', () => {
    const obj = {
      object_type: 'media',
      object: {handle: 'mh1', checksum: 'abc123'},
    }
    expect(renderIcon(obj).values).to.include('abc123')
  })

  it('resolves checksum from extended.media for non-media objects', () => {
    const obj = {
      object_type: 'person',
      object: {
        handle: 'ph1',
        media_list: [{ref: 'mh2', rect: []}],
        extended: {
          media: [{handle: 'mh2', checksum: 'def456'}],
        },
      },
    }
    expect(renderIcon(obj).values).to.include('def456')
  })
})

describe('renderIcon media type', () => {
  const media = mime => ({
    object_type: 'media',
    object: {handle: 'mh1', checksum: 'abc', mime},
  })

  it.each([
    ['audio/mpeg', FileAudio],
    ['application/vnd.google-earth.kml+xml', MapTrifold],
    ['application/zip', File],
  ])('renders the type icon for %s without a thumbnail', (mime, path) => {
    const result = renderIcon(media(mime))
    expect(result.strings.join('')).not.to.include('grampsjs-img')
    expect(result.values).to.include(path)
  })

  it.each([
    ['image/jpeg', Image],
    ['video/mp4', FileVideo],
    ['application/pdf', File],
  ])('renders a thumbnail for %s falling back to its icon', (mime, path) => {
    const result = renderIcon(media(mime))
    expect(result.strings.join('')).to.include('grampsjs-img')
    expect(result.values).to.include(path)
  })
})

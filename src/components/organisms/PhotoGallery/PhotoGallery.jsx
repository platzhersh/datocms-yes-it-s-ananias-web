import React, { useCallback, useState } from 'react'
import Gallery from 'react-photo-gallery'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

const PhotoGallery = ({ photos }) => {
  const [index, setIndex] = useState(-1)

  const openLightbox = useCallback((_event, { index }) => setIndex(index), [])

  return (
    <div>
      <Gallery photos={photos} onClick={openLightbox} />
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={Math.max(index, 0)}
        slides={photos.map((p) => ({ src: p.src, srcSet: p.srcSet, alt: p.title }))}
      />
    </div>
  )
}

export default PhotoGallery

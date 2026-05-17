import React from 'react'
import { gql } from '@apollo/client'
import TextBlockContainer from '../atoms/TextBlockContainer'
import PhotoGallery from '../organisms/PhotoGallery/PhotoGallery'
import { QueryLoader } from '../organisms/QueryLoader/QueryLoader'
import { FadeInStagger } from '../atoms/FadeIn/FadeIn'

const aboutQuery = gql`
  query about {
    about {
      content {
        ... on TextBlockRecord {
          __typename
          id
          text
        }
        ... on TextImageBlockRecord {
          __typename
          id
          text
          image {
            url
            customData
            responsiveImage {
              base64
              srcSet
              src
              webpSrcSet
              width
              title
              sizes
              aspectRatio
              height
              alt
            }
          }
        }
      }
    }
  }
`

const About = () => (
  <QueryLoader
    query={aboutQuery}
    successCallback={(data) => {
      const galleryConfig = data.about.content
        .filter((c) => c.image)
        .map((c) => ({
          src: c.image.url,
          title: c.image.responsiveImage.title,
          width: 3,
          height: 4
        }))

      return (
        <section>
          <FadeInStagger>
            {data.about.content.map((contentBlock) => (
              <div key={contentBlock.id}>
                <TextBlockContainer dangerouslySetInnerHTML={{ __html: contentBlock.text }} />
              </div>
            ))}
          </FadeInStagger>
          <PhotoGallery photos={galleryConfig} />
        </section>
      )
    }}
  />
)

export default About

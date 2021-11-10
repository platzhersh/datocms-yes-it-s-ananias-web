import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import TextBlockContainer from '../atoms/TextBlockContainer'
import PhotoGallery from '../organisms/PhotoGallery/PhotoGallery'

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

const About = (props) => {
  return (
    <Query query={aboutQuery}>
      {({ data, loading, error }) => {
        if (loading) return 'Loading...'
        if (error) return `ERROR: ${error}`

        const images = data.about.content
          .filter((c) => c.image)
          .map((i) => i.image)

        const galleryConfig = images.map((i) => ({
          src: i.url,
          width: 3,
          height: 4,
        }))

        console.log('images, galleryConfig', images, galleryConfig)

        return (
          <section>
            <div>
              {data.about.content.map((contentBlock) => (
                <div key={contentBlock.id}>
                  <TextBlockContainer
                    dangerouslySetInnerHTML={{ __html: contentBlock.text }}
                  />
                </div>
              ))}
            </div>
            <PhotoGallery photos={galleryConfig} />
          </section>
        )
      }}
    </Query>
  )
}

export default About

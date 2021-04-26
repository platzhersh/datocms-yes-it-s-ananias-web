import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Image } from 'react-datocms'
import styled from 'styled-components/macro'

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

const StyledImage = styled(Image)`
width: auto;
`

const About = props => {
  return (
    <Query query={aboutQuery}>
      {({ data, loading, error }) => {
        if (loading) return 'Loading...'
        if (error) return `ERROR: ${error}`

        return (
          <section>
            <div>
              {data.about.content.map(contentBlock => (
                <div key={contentBlock.id}>

                  <p>{contentBlock.text}</p>

                  {contentBlock.image && <StyledImage
                    data={contentBlock.image.responsiveImage}
                                         />}
                </div>
              ))}
            </div>
          </section>
        )
      }}
    </Query>
  )
}

export default About

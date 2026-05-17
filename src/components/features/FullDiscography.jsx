import React from 'react'
import { gql } from '@apollo/client'
import { StructuredText } from 'react-datocms'
import TextBlockContainer from '../atoms/TextBlockContainer'
import { QueryLoader } from '../organisms/QueryLoader/QueryLoader'

const discographyQuery = gql`
  query fullDiscography {
    fulldiscography {
      content {
        value
      }
    }
  }
`

const Discography = () => (
  <QueryLoader
    query={discographyQuery}
    successCallback={(data) => (
      <section>
        <TextBlockContainer>
          <StructuredText data={data.fulldiscography.content.value} />
        </TextBlockContainer>
      </section>
    )}
  />
)

export default Discography

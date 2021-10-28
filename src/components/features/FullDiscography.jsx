import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { StructuredText } from 'react-datocms'
import TextBlockContainer from '../atoms/TextBlockContainer'

const discography = gql`
  query fullDiscography {
    fulldiscography {
      content {
        value
      }
    }
  }
`

const Discography = (props) => {
  return (
    <Query query={discography}>
      {({ data, loading, error }) => {
        if (loading) return 'Loading...'
        if (error) return `ERROR: ${error}`

        return (
          <section>
            <TextBlockContainer>
              <StructuredText data={data.fulldiscography.content.value} />
            </TextBlockContainer>
          </section>
        )
      }}
    </Query>
  )
}

export default Discography

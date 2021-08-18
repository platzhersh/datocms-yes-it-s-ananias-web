import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const discography = gql`

query fullDiscography {
  fulldiscography {
    content {
        value
    }
  }
}
`

const Discography = props => {
  return (
    <Query query={discography}>
      {({ data, loading, error }) => {
        if (loading) return 'Loading...'
        if (error) return `ERROR: ${error}`

        return (
          <section>
            <div>
              work in progress
              {/* {data && data.fulldiscography.content.value} */}
            </div>
          </section>
        )
      }}
    </Query>
  )
}

export default Discography

import React from 'react'
import gql from 'graphql-tag'
import { ReleaseCard } from '../molecules/ReleaseCard/ReleaseCard'
import { QueryLoader } from '../organisms/QueryLoader/QueryLoader'
import { ReleaseFragment } from '../../queries/fragments/ReleaseFragment'

const releasesQuery = gql`
  query allReleases {
    allReleases(orderBy: listposition_ASC) {
      ${ReleaseFragment}
    }
  }
`

const Releases = (_props) => {
  return (
    <QueryLoader
      query={releasesQuery}
      successCallback={(data) => (
        <section>
          <div>
            {data.allReleases.map((release) => (
              <ReleaseCard release={release} />
            ))}
          </div>
        </section>
      )}
    />
  )
}

export default Releases

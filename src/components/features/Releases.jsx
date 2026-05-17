import React from 'react'
import { gql } from '@apollo/client'
import { ReleaseCard } from '../molecules/ReleaseCard/ReleaseCard'
import { QueryLoader } from '../organisms/QueryLoader/QueryLoader'
import { FadeInStagger } from '../atoms/FadeIn/FadeIn'
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
          <FadeInStagger>
            {data.allReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </FadeInStagger>
        </section>
      )}
    />
  )
}

export default Releases

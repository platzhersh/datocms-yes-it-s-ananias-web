import gql from 'graphql-tag'
import React from 'react'
import { QueryLoader } from '../../organisms/QueryLoader/QueryLoader'
import { ReleaseCard } from '../ReleaseCard/ReleaseCard'
import { ReleaseFragment } from '../../../queries/fragments/ReleaseFragment'
import { VideoFragment } from '../../../queries/fragments/VideoFragment'
import { VideoCard } from '../VideoCard/VideoCard'

const featuredContentQuery = gql`
  query FeaturedContentQuery {
    home {
      featuredRelease {
      ${ReleaseFragment}
      }
      featuredVideo {
        ${VideoFragment}
      }
      showFeaturedRelease
      showFeaturedVideo
    }
  }
`

export const FeaturedContent = (_props) => {
  return (
    <QueryLoader
      query={featuredContentQuery}
      successCallback={(data) => {
        const { home } = data
        const {
          featuredRelease,
          showFeaturedRelease,
          showFeaturedVideo,
          featuredVideo,
        } = home
        return (
          <>
            {home && showFeaturedRelease && featuredRelease ? (
              <section>
                <div>
                  <ReleaseCard release={featuredRelease} />
                </div>
              </section>
            ) : null}
            {home && showFeaturedVideo && featuredVideo ? (
              <section>
                <div>
                  <VideoCard video={featuredVideo} />
                </div>
              </section>
            ) : null}
          </>
        )
      }}
    />
  )
}

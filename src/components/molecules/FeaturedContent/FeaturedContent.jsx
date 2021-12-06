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
      featuredvideos {
        ${VideoFragment}
      }
      showFeaturedRelease
      showFeaturedVideos
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
          featuredvideos,
          showFeaturedVideos,
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
            {home && showFeaturedVideos && featuredvideos
              ? featuredvideos.map((video) => (
                  <section>
                    <div>
                      <VideoCard video={video} />
                    </div>
                  </section>
                ))
              : null}
          </>
        )
      }}
    />
  )
}

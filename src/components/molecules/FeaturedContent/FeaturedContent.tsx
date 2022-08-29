import gql from 'graphql-tag'
import React from 'react'
import { QueryLoader } from '../../organisms/QueryLoader/QueryLoader'
import { ReleaseCard } from '../ReleaseCard/ReleaseCard'
import { ReleaseFragment } from '../../../queries/fragments/ReleaseFragment'
import { VideoFragment } from '../../../queries/fragments/VideoFragment'
import { VideoCard } from '../VideoCard/VideoCard'
import { Video } from '../../../models/video'
import { Release } from '../../../models/Release'

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

interface FeaturedContentData {
  home: {
    featuredRelease: Release
    showFeaturedRelease: boolean
    featuredvideos: Video[]
    showFeaturedVideos: boolean
  }
}

export const FeaturedContent = () => {
  return (
    <QueryLoader
      query={featuredContentQuery}
      successCallback={(data: FeaturedContentData) => {
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
                  <ReleaseCard
                    release={featuredRelease}
                    key={featuredRelease.id}
                  />
                </div>
              </section>
            ) : null}
            {home && showFeaturedVideos && featuredvideos
              ? featuredvideos.map((video) => (
                  <section>
                    <div>
                      <VideoCard video={video} key={video.id} />
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

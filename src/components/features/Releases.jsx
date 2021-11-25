import gql from 'graphql-tag'
import React from 'react'
import { Image } from 'react-datocms'
import styled from 'styled-components/macro'
import { ItemContainer } from '../atoms/ItemContainer/ItemContainer'
import { PurchaseLink } from '../molecules/ActionButtonMediaLink/PurchaseLink'
import { SpotifyLink } from '../molecules/ActionButtonMediaLink/SpotifyLink'
import { YoutubeLink } from '../molecules/ActionButtonMediaLink/YoutubeLink'
import { QueryLoader } from '../organisms/QueryLoader/QueryLoader'

const releasesQuery = gql`
  query allReleases {
    allReleases(orderBy: listposition_ASC) {
      id
      cover {
        responsiveImage {
          alt
          aspectRatio
          base64
          bgColor
          height
          sizes
          src
          srcSet
          webpSrcSet
          width
          title
        }
      }
      releaseyear
      title
      mediatyp
      spotifyUrl
      youtubeUrl

      shopAnalyticsTrackingId
      shopButtonText
      shopProductUrl
      highlight
    }
  }
`

const StyledAlbumListItem = styled(ItemContainer)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const CoverImageContainer = styled.div`
  flex: 0 0 300px;
  width: 300px;
  height: auto;
  max-width: 100%;
  background: #777;
`

const StyledAlbumDescription = styled.div`
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const ReleaseInfos = styled.div`
  padding: 0 1em 1em 1em;
  max-width: 400px;
`

const ActionItems = styled.div`
  display: flex;
  flex-direction: row;
  & > * {
    margin-right: 0.5em;
    margin-bottom: 0.5em;
  }
`

const Releases = (props) => {
  return (
    <QueryLoader
      query={releasesQuery}
      successCallback={(data) => (
        <section>
          <div>
            {data.allReleases.map((release) => (
              <StyledAlbumListItem inverse={release.highlight} key={release.id}>
                <CoverImageContainer>
                  {release.cover && (
                    <Image data={release.cover.responsiveImage} />
                  )}
                </CoverImageContainer>
                <StyledAlbumDescription>
                  <ReleaseInfos>
                    <h2>{release.title}</h2>
                    {release.mediatyp && <p>{release.mediatyp}</p>}
                    <p>Release: {release.releaseyear}</p>
                  </ReleaseInfos>
                  <ActionItems>
                    {release.shopProductUrl && (
                      <PurchaseLink
                        inverse={release.highlight}
                        url={release.shopProductUrl}
                        text={release.shopButtonText}
                      />
                    )}
                    {release.spotifyUrl && (
                      <SpotifyLink
                        inverse={release.highlight}
                        url={release.spotifyUrl}
                      />
                    )}
                    {release.youtubeUrl && (
                      <YoutubeLink
                        inverse={release.highlight}
                        url={release.youtubeUrl}
                      />
                    )}
                  </ActionItems>
                </StyledAlbumDescription>
              </StyledAlbumListItem>
            ))}
          </div>
        </section>
      )}
    />
  )
}

export default Releases

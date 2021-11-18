import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Image } from 'react-datocms'
import styled from 'styled-components/macro'
import ItemContainer from '../atoms/ItemContainer'
import { SpotifyLink } from '../molecules/ActionButtonMediaLink/SpotifyLink'
import { YoutubeLink } from '../molecules/ActionButtonMediaLink/YoutubeLink'
import { ActionButton } from '../atoms/ActionButton/ActionButton'
import { ExternalLink } from '../atoms/ExternalLink'
import { LoadingPlaceholder } from '../atoms/LoadingPlaceholder/LoadingPlaceholder'

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
    }
  }
`

const StyledAlbumListItem = styled(ItemContainer)`
  display: flex;
  flex-wrap: wrap;
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
    <Query query={releasesQuery}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingPlaceholder />
        if (error) return `ERROR: ${error}`

        return (
          <section>
            <div>
              {data.allReleases.map((release) => (
                <StyledAlbumListItem key={release.id}>
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
                        <ExternalLink url={release.shopProductUrl}>
                          <ActionButton text={release.shopButtonText} />
                        </ExternalLink>
                      )}
                      {release.spotifyUrl && (
                        <SpotifyLink url={release.spotifyUrl} />
                      )}
                      {release.youtubeUrl && (
                        <YoutubeLink url={release.youtubeUrl} />
                      )}
                    </ActionItems>
                  </StyledAlbumDescription>
                </StyledAlbumListItem>
              ))}
            </div>
          </section>
        )
      }}
    </Query>
  )
}

export default Releases

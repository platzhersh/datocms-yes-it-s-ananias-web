import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Image } from 'react-datocms'
import styled from 'styled-components/macro'

const releasesQuery = gql`

query allReleases {
    allReleases {
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
      }
  }
`

const StyledAlbumListItem = styled.div`
  display: flex;

`

const CoverImageContainer = styled.div`
    flex: 0 0 300px;
    width: 300px; height: 300px;
`

const StyledAlbumDescription = styled(Image)`
    flex: 1 1 auto;
`

const Releases = props => {
  return (
    <Query query={releasesQuery}>
      {({ data, loading, error }) => {
        if (loading) return 'Loading...'
        if (error) return `ERROR: ${error}`

        console.log('data', data)

        return (
          <section>
            <div>
              {data.allReleases.map(release => (
                <StyledAlbumListItem key={release.id}>
                  <CoverImageContainer>
                    {release.cover && release.cover.responsiveImage && <Image data={release.cover.responsiveImage} />}
                  </CoverImageContainer>
                  <StyledAlbumDescription>
                    <p>{release.title}</p>
                    <p>{release.releaseyear}</p>
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

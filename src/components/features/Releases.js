import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { Image } from 'react-datocms'
import styled from 'styled-components/macro'
import ItemContainer from '../atoms/ItemContainer'

const releasesQuery = gql`

query allReleases {
    allReleases(orderBy: releaseyear_DESC) {
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

const StyledAlbumListItem = styled(ItemContainer)`
  display: flex;
  flex-wrap: wrap;
`;

const CoverImageContainer = styled.div`
    flex: 0 0 300px;
    width: 300px; 
    height: auto;
    max-width: 100%;
    background: #777;
`;

const StyledAlbumDescription = styled.div`
    flex: 1 1 auto;
    display: flex;
    align-items: center;
`

const Releases = props => {
  return (
    <Query query={releasesQuery}>
            {({data, loading, error}) => {
      if (loading) return 'Loading...'
      if (error) return `ERROR: ${error}`

      return (
        <section>
                        <div>
                            {data.allReleases.map(release => (
          <StyledAlbumListItem key={release.id}>
                                    <CoverImageContainer>
                                        {release.cover && <Image data={release.cover.responsiveImage} />}
                                    </CoverImageContainer>
                                    <StyledAlbumDescription>
                                        <h2>{release.title}</h2>
                                        <p>Release: {release.releaseyear}</p>
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


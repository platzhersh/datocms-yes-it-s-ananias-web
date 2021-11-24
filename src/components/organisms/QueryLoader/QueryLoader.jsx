import React from 'react'
import { Query } from 'react-apollo'
import { ErrorMessage } from '../../atoms/ErrorMessage/ErrorMessage'
import { LoadingPlaceholder } from '../../atoms/LoadingPlaceholder/LoadingPlaceholder'

export const QueryLoader = (props) => {
  const { query, successCallback } = props

  return (
    <Query query={query}>
      {({ data, loading, error }) => {
        if (loading) return <LoadingPlaceholder />
        if (error) return <ErrorMessage error={error} />
        return successCallback(data)
      }}
    </Query>
  )
}

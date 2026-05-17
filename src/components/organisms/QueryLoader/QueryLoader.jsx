import React from 'react'
import { useQuery } from '@apollo/client'
import { ErrorMessage } from '../../atoms/ErrorMessage/ErrorMessage'
import { LoadingPlaceholder } from '../../atoms/LoadingPlaceholder/LoadingPlaceholder'

export const QueryLoader = ({ query, successCallback }) => {
  const { data, loading, error } = useQuery(query)
  if (loading) return <LoadingPlaceholder />
  if (error) return <ErrorMessage error={error} />
  return successCallback(data)
}

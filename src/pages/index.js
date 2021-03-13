import React from 'react'
import { Redirect } from '@reach/router'

const IndexPage = () => {
  return <Redirect from="/" to="docs/v2" noThrow />
}

export default IndexPage
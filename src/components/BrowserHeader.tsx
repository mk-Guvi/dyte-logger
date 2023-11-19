import Head from 'next/head'
import { FC, useMemo } from 'react'

interface HeadersI {
  title?: string
  description?: string
}

export const BrowserHeader: FC<HeadersI> = (props) => {
  const browserTitle = useMemo(() => `${props.title || 'Logger'}`, [
    props.title,
  ])

  return (
    <Head>
      <title>{`${browserTitle}`}</title>
      <meta name="description" content={props.description || 'Logger'} />
    </Head>
  )
}

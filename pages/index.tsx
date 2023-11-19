import Image from 'next/image'
import { Inter } from 'next/font/google'
import { H5, Icon } from '@/src/components'
import Link from 'next/link'
import { appService } from '@/src/utils'
import LoggerContainer from '@/src/containers/loggerContainers/LoggerContainer'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div
      className={`flex gap-6 overflow-auto relative  w-screen min-h-screen flex-col ${inter.className}`}
    >
      <LoggerContainer />
    </div>
  )
}

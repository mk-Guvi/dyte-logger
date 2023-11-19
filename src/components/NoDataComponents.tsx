import { ReactElement } from 'react'
import NoDataSvg from '../../assets/images/noDataImage.svg'
import { H3, H4 } from './Typography'

type Props = {
  label?: string
  children?: ReactElement
  imageClassName?: string
  containerClassName?: string
  subLabel?: string
}

export function NoDataComponent({
  label,
  children,
  imageClassName,
  containerClassName,
  subLabel,
}: Props) {
  return (
    <div
      className={`flex flex-col text-center items-center justify-center p-2 gap-4 ${
        containerClassName || ''
      }`}
    >
      <img
        src={NoDataSvg.src}
        className={`h-1/2 w-[60%] sm:w-[70%] ${imageClassName || ''}`}
        alt="no data"
      />
      <H4>{label}</H4>
      {subLabel ? <H3>{subLabel}</H3> : null}
      {children}
    </div>
  )
}

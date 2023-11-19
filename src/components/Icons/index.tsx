import React, { FC, MouseEventHandler, Ref } from 'react'
import IconInner, { IconTypeT } from './iconInner'
import { Tooltip, TooltipProps } from 'antd'

interface IconPropsI {
  icon: IconTypeT
  className?: string
  fill?: string
  otherProps?: any
  strokeWidth?: number
  onClick?: MouseEventHandler<SVGSVGElement>
  id?: string
  tooltip?: TooltipProps
}
// eslint-disable-next-line react/display-name
export const Icon: FC<IconPropsI> = React.forwardRef(
  (props, ref: Ref<SVGSVGElement>) => {
    const {
      icon,
      id,
      strokeWidth = 2,
      className,
      fill = 'none',
      tooltip,
      ...otherProps
    } = props
    if (!icon) {
      return null
    }

    return (
      <Tooltip {...tooltip}>
        <svg
          width={'100%'}
          height={'100%'}
          ref={ref}
          id={id}
          viewBox="0 0 24 24"
          fill={fill}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={`${className || ''} h-6 w-6  `}
          {...otherProps}
          onClick={props.onClick}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <IconInner icon={icon} />
        </svg>
      </Tooltip>
    )
  },
)

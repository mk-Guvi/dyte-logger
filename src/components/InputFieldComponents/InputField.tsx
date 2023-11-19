import { Tooltip } from 'antd'
import React, { InputHTMLAttributes } from 'react'
import tw from 'tailwind-styled-components'
import { IconTypeT } from '../Icons/iconInner'
import { Icon } from '..'

export type IconEntitiesT = {
  icon: IconTypeT
  iconClassName?: string
  onClick?: () => void
}

export type AppInputFieldPropsT = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  containerClassName?: string
  iconLeft?: IconEntitiesT
  iconRight?: IconEntitiesT
  onClearValue?: () => void
}

// eslint-disable-next-line react/display-name
export const AppInputField = React.memo(
  React.forwardRef(
    (props: AppInputFieldPropsT, ref?: React.LegacyRef<HTMLInputElement>) => {
      const {
        className,
        error,
        iconLeft,
        iconRight,
        containerClassName,
        disabled,
        ...restProps
      } = props

      return (
        <div
          className={` ${containerClassName || ''} ${
            disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'
          }
        !ring-0 border rounded-lg  !outline-none    text-[1rem] 
        ${
          error
            ? `        border-red-400 focus-within:ring-offset-0`
            : `      focus-within:border-dark focus:ring-offset-0`
        }
          flex items-center h-[2.8rem] `}
        >
          {iconLeft ? (
            <Icon
              icon={iconLeft.icon}
              className={`${
                iconLeft?.iconClassName || ''
              } px-2 h-[2.3rem] w-[2.3rem]`}
              onClick={iconLeft?.onClick}
            />
          ) : null}

          <InputField
            ref={ref}
            disabled={disabled || props?.readOnly}
            autoComplete={'off'}
            {...restProps}
          />

          {iconRight ? (
            <Icon
              icon={iconRight.icon}
              className={`${iconRight?.iconClassName || ''}
              px-2 h-[2.3rem] w-[2.3rem]`}
              onClick={iconRight?.onClick}
            />
          ) : null}
        </div>
      )
    },
  ),
)

export const InputField = tw.input`${(props) => props?.className || ''}
${(props) => (props?.disabled ? 'cursor-not-allowed' : '')}
          border-0
          focus-visible:outline-none
          focus-visible:ring-0
          bg-transparent
          focus:ring-0
          active:ring-0
          ring-0          
         px-2
         caret-gray-600  w-full h-full`

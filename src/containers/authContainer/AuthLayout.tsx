import { H2 } from '@/src/components/Typography'
import { ReactNode } from 'react'

type AuthLayoutPropsT = {
  children: ReactNode
}

export const AuthLayout = (props: AuthLayoutPropsT) => {
  return (
    <div className=" bg-slate-50  h-screen w-screen grid lg:grid-cols-2">
      <div className="hidden  bg-black text-white h-full w-full justify-center lg:flex items-center ">
        <H2>_Logger.</H2>
      </div>
      <div className="p-4  grid m-auto gap-4  w-full   max-w-[28rem]">
        {props?.children}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { AuthLayout } from './AuthLayout'
import { AppInputField, H1, SmallText } from '@/src/components'
import { useRouter } from 'next/router'
import { appService, validateEmail } from '@/src/utils'
import { Button } from 'antd'
import Link from 'next/link'
import axios from 'axios'
import { LANG } from '@/src/constants'

function SignupContainer() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [state, setState] = useState({
    emailId: '',
    password: '',
    emailError: '',
    passwordError: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async () => {
    try {
      let passwordError = ''
      let emailError = ''
      if (!state.emailId) {
        emailError = 'Enter email'
      } else {
        const isValid = validateEmail(state.emailId)
        if (!isValid) emailError = 'Invalid Email'
      }
      if (!state.password) {
        passwordError = 'Enter password'
      }
      handleState({ passwordError, emailError })
      if (!passwordError && !emailError) {
        setLoading(true)
        const { data: response } = await axios.post('/user/signup', {
          emailId: state.emailId,
          password: state?.password,
        })
        setLoading(false)
        if (response?.status) {
          appService.storeProfileDetailsToCookies({
            refreshToken: response?.data?.refreshToken,
            token: response?.data?.token,
            tokenExpiresAt: response?.data?.tokenExpiresAt,
            user: response?.data?.user,
          })
          router.push('/')
        } else {
          setError(response?.error || LANG.COMMON.NETWORK_ERROR)
        }
      }
    } catch (e) {
      console.error(e)
      setError(LANG.COMMON.NETWORK_ERROR)
      setLoading(false)
    }
  }

  const handleState = (payload: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...payload }))
  }

  return (
    <AuthLayout>
      <div className="flex  flex-col gap-3 px-2">
        <H1>Sign Up</H1>
        <SmallText>Create a new account</SmallText>
      </div>

      <form className=" rounded-lg shadow-lg bg-white flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-3">
          <label className="font-normal text-sm" htmlFor="email">
            Email address
          </label>

          <AppInputField
            value={state.emailId}
            id={'email'}
            iconRight={{ icon: 'at-sign' }}
            onChange={(e) => {
              handleState({ emailId: e.target.value, emailError: '' })
            }}
          />
          {state?.emailError ? (
            <SmallText className="text-red-700">{state?.emailError}</SmallText>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-normal text-sm" htmlFor="email">
            Password
          </label>

          <AppInputField
            value={state.password}
            iconRight={{
              icon: showPassword ? 'eye' : 'eye-off',
              onClick: () => setShowPassword((prev) => !prev),
            }}
            placeholder="Enter a password"
            id={'password'}
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => {
              handleState({ password: e.target.value, passwordError: '' })
            }}
          />
          {state?.passwordError ? (
            <SmallText className="text-red-700">
              {state?.passwordError}
            </SmallText>
          ) : null}
        </div>

        <Button
          onClick={handleSubmit}
          loading={loading}
          size="large"
          className="!w-full !bg-black !text-white"
        >
          Signup
        </Button>
        {error ? (
          <span className="text-red-700 text-center">{error}</span>
        ) : null}
      </form>

      <div className="text-sm text-center">
        <span>Already have an account?</span>

        <Link href={'/login'}>
          <span className="text-blue-700"> Login</span>
        </Link>
      </div>
    </AuthLayout>
  )
}

export default SignupContainer

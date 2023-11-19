import Cookie from 'js-cookie'

import { SmallText } from '../components'
import { STORAGE_KEYS } from '../constants'
import { User } from '../modals'
import axios from 'axios'

type ProfileT = {
  token: string
  refreshToken: string
  tokenExpiresAt: number
  user: User
}
class AppServicer {
  /** Used to clear local data for example on sign out or session expired */
  async clear() {
    Cookie.remove(STORAGE_KEYS.APP_PROFILE)
  }

  checkTokenValidity(expiresAt: number) {
    // Get the current timestamp in milliseconds
    const currentTimestamp = new Date().getTime()

    // Check if the token's expiration timestamp is in the future (not expired)
    if (expiresAt > currentTimestamp) {
      // Token is valid
      return true
    } else {
      // Token has expired
      return false
    }
  }
  async getUpdatedToken(refreshToken: string) {
    try {
      const response = await axios.post('/user/token', {
        data: {
          refreshToken,
        },
      })
      if (response?.data?.token) {
        return {
          token: response?.data?.token,
          tokenExpiresAt: response?.data?.tokenExpiresAt,
          refreshToken: response?.data?.refreshToken,
        }
      } else {
        return null
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }
  async getAccessTokenFromStorage(manual?: ProfileT) {
    try {
      const getTokenDetails = manual || this.getProfileDetailsFromLocalStorage()
      if (getTokenDetails?.token && getTokenDetails?.refreshToken) {
        const isAccessTokenExpired = this.checkTokenValidity(
          getTokenDetails?.tokenExpiresAt,
        )
        if (isAccessTokenExpired) {
          const result = await this.getUpdatedToken(
            getTokenDetails?.refreshToken,
          )
          if (result?.refreshToken && result?.token && result?.tokenExpiresAt) {
            this.storeProfileDetailsToCookies({
              ...getTokenDetails,
              refreshToken: result?.refreshToken,
              token: result?.token,
              tokenExpiresAt: result?.tokenExpiresAt,
            })
            return result?.token
          } else {
            throw new Error('Failed to get Refresh token')
          }
        } else {
          return getTokenDetails?.token
        }
      }

      return null
    } catch {
      return null
    }
  }

  storeProfileDetailsToCookies(payload: ProfileT) {
    Cookie.set(STORAGE_KEYS.APP_PROFILE, JSON.stringify(payload))
  }

  getProfileDetailsFromLocalStorage() {
    try {
      let getProfile = Cookie.get(STORAGE_KEYS.APP_PROFILE)
      if (getProfile) {
        return JSON.parse(getProfile) as ProfileT
      }
      return null
    } catch {
      return null
    }
  }
}

export const appService = new AppServicer()

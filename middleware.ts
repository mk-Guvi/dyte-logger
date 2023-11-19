import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { STORAGE_KEYS } from './src/constants'
import { appService } from './src/utils'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()
  const profile = req?.cookies?.get(STORAGE_KEYS.APP_PROFILE)
  res.headers.append('Access-Control-Allow-Origin', '*')
  
  if(profile?.value){
    const result = await appService.getAccessTokenFromStorage(
      JSON?.parse(profile?.value),
    )
    if (result && req?.nextUrl?.pathname === '/login') {
      
      return NextResponse.redirect(req?.nextUrl?.origin,302)
    }
  }
  
  // add the remaining CORS headers to the response
  res.headers.append('Access-Control-Allow-Credentials', 'true')
  res.headers.append(
    'Access-Control-Allow-Methods',
    'GET,DELETE,PATCH,POST,PUT',
  )
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,x-api-key',
  )

  return res
}

// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/', '/login'],
}

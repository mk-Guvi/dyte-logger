import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
    
    let res = NextResponse.next();

  res.headers.append('Access-Control-Allow-Origin', '*');

  // add the remaining CORS headers to the response
  res.headers.append('Access-Control-Allow-Credentials', 'true');
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.headers.append(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,x-api-key',
  );
  
  return res;
}
 
// Supports both a single string value or an array of matchers
export const config = {
  matcher: ['/', ],
}
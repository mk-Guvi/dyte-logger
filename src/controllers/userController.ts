import { NextResponse } from 'next/server'
import { connectMongo } from '../lib/mongoConnection'
import { UserModel } from '../modals'
import { compareHashedPassword, generateHash, generateToken } from './helpers'

export const signupUser = async (req: Request) => {
  try {
    await connectMongo()
    const body = await req.json()
    if (!body?.emailId || !body?.password) {
      return NextResponse.json({
        status: false,
        error: `${!body?.emailId ? 'Email Id' : 'Password'} required`,
      })
    } else {
      const user = await UserModel.create({
        emailId: body?.emailId,
        password: await generateHash(body?.password),
      })
      if (!user?.emailId) {
        throw new Error('Failed to create user')
      }
      return NextResponse.json({
        status: true,
        data: {
          user,
          ...generateToken({
            emailId: user?.emailId,
            role: user?.role,
          }),
        },
      })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({
      status: false,
    })
  }
}

export const loginUser = async (req: Request) => {
  try {
    await connectMongo()
    const body = await req.json()
    if (!body?.emailId || !body?.password) {
      return NextResponse.json({
        status: false,
        error: `${!body?.emailId ? 'Email Id' : 'Password'} required`,
      })
    } else {
      
      const user = await UserModel.findOne({
        emailId: body?.emailId,
      })

      if (!user) {
        return NextResponse.json({
          status: false,
          error: 'Invalid credentials',
        })
      } else {
        const checkPassword = await compareHashedPassword(
          user?.password,
          body?.password,
        )
        if (!checkPassword) {
          return NextResponse.json({
            status: false,
            error: 'Invalid credentials',
          })
        } else {
          return NextResponse.json({
            status: true,
            data: {
              user,
              ...generateToken({
                emailId: user?.emailId,
                role: user?.role,
              }),
            },
          })
        }
      }
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({
      status: false,
      error: 'Failed to login',
    })
  }
}

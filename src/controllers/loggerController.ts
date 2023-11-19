import { NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { connectMongo } from '../lib/mongoConnection'
import { loggerModel } from '../modals'
import { addSingleLog, getAllLogsService } from '../services'

export const getLogs = async (req: Request) => {
  try {
    
    const body = await req?.json()
    const {error,result,totalCount} = await getAllLogsService(body)
    
    if(error){
      throw new Error(`${error}`)
    }
    return NextResponse.json({
      status: true,      
      data: result,
      totalCount
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({
      status: false,
      error:"Failed to get Logs"
    })
  }
}

export const addLog = async (req: Request) => {
  try {
    await connectMongo()
    const { result, error } = await addSingleLog(await req.json())
    if (error) {
      throw new Error(`${error}`)
    }
    return NextResponse.json({
      status: true,
      data: result,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({
      status: false,
      error: 'Failed to add log',
    })
  }
}

import {  getLogs } from '@/src/controllers';



export async function POST(req: Request) {
    return await getLogs(req)
  }
import { validateAndGenerateToken } from "@/src/controllers/userController";

export async function POST(req: Request) {
    return await validateAndGenerateToken(req)
  }
import { loginUser } from "@/src/controllers/userController";

export async function POST(req: Request) {
    return await loginUser(req)
  }
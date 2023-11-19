import { signupUser } from "@/src/controllers/userController";

export async function POST(req: Request) {
    return await signupUser(req)
  }
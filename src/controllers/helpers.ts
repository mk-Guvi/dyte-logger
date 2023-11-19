import { compare, hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const generateHash = async (plainPassword: string) => {
  return await hash(plainPassword, 12)
}

export const compareHashedPassword = async (
  hashedPassword: string,
  password: string,
) => {
  return await compare(password, hashedPassword)
}

type generateTokenPayloadT={
    emailId: string
    role:string
}
export const generateToken = (payload:generateTokenPayloadT) => {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInToSeconds("24h");
  return {
    token: jwt.sign(payload, `${process.env.JWT_SECRET}`, {
      expiresIn: '24h',
    }),
    tokenExpiresAt:expiresAt,
    refreshToken: jwt.sign(payload, `${process.env.JWT_SECRET}`, {
      expiresIn: '100h',
    }),  }
}

// Helper function to convert expiresIn string to seconds
const expiresInToSeconds = (expiresIn: string): number => {
    const unit = expiresIn.charAt(expiresIn.length - 1).toLowerCase();
    const value = parseInt(expiresIn.substring(0, expiresIn.length - 1));
  
    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 0;
    }
  };

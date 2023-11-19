import mongoose, { Schema, Document, models } from 'mongoose'

export interface User extends Document {
  emailId: string
  role: 'ADMIN' | 'ACCOUNT_USER'
  password: string
}

export const userSchema: Schema = new Schema({
  emailId: { type: String, unique: true, required: true },
  role: { type: String, default: 'ADMIN' },
  password: String,
})

export const UserModel =
  models.users || mongoose.model<User>('users', userSchema)

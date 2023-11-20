import mongoose, { Schema, Document, models } from 'mongoose'

export interface Logger extends Document {
  level: string
  message: string
  resourceId: string
  timestamp: Date
  traceId: string
  spanId: string
  commit: string
  metadata: {
    parentResourceId: string
  }
}

export const loggerSchema: Schema = new Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: { type: Date, default: () => new Date() },
  traceId: String,
  spanId: String,
  commit: String,
  metadata: {
    parentResourceId: String,
  },
}).index({_id:1})

export const loggerModel=models.logs||mongoose.model<Logger>('logs', loggerSchema)

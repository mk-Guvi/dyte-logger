import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
  } catch (error: any) {
    console.error(
      `Error connecting to MongoDB: ${error?.message || "Unknown Error"}`
    );
  }
};

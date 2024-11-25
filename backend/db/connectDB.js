import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("CONNECTED DB @", conn.connection.host);
  } catch (error) {
    console.error("ERROR IN CONNECTING TO DB", error.message);
    process.exit(1);
  }
};

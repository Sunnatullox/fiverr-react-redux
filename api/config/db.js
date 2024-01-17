import mongoose from 'mongoose'
import{ config } from 'dotenv'
config()


const dbConnect = async() => {
  try {
    mongoose.set("strictQuery", false);
     mongoose.connect(process.env.MONGODB_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true
     });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database error");
  }
};
export default dbConnect;
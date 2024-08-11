import mongoose from "mongoose";


const connectDB = async () =>{
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/EV') // TODO: env variable
        console.log('MongoDB connected');
    } catch(e){
        console.log(e);
    }
}

export { connectDB };


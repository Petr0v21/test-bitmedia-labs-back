import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const dbConnect = () => {
  mongoose.connect(process.env.DB!, {});

  mongoose.connection.on('connected', () => {
    console.log('Connected to database sucessfully');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Error while connecting to database :' + err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongodb connection disconnected');
  });
};

export default dbConnect;

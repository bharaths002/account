import 'dotenv/config';
import mongoose from 'mongoose';

const dbCon = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Mongodb is conntected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export default dbCon;
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dbCon from './utils/db.js';
import authRoutes from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

console.log('DB_URL:', process.env.DB_URL);

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS); 

dbCon();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

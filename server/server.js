const express = require('express');
const cors = require('cors');
const dbCon = require('./utils/db.js');
const authRoutes = require('./routes/auth.js');

const app = express();

app.use(cors({ origin: 'https://[your-frontend-service-name].onrender.com' }));
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
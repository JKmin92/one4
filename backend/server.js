import app from './app.js';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve();
dotenv.config({path:path.join(__dirname, 'backend/config/.env')});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
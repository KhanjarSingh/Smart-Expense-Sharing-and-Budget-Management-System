import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 5001;

process.on('exit', (code) => console.log('Process exit event with code: ', code));
process.on('uncaughtException', (err) => console.log('uncaughtException:', err));
process.on('unhandledRejection', (err) => console.log('unhandledRejection:', err));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Keep process alive explicitly if needed
setInterval(() => {}, 1000000);

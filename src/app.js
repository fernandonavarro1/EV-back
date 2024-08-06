import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import routes from "./routes/auth.routes.js";
import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:3001', // TODO: env
    optionsSuccessStatus: 200,
    credentials: true,
};

const app = express()

app.use(morgan('dev'));
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions));
app.use("/api",routes)

export default app;

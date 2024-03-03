import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import routes from './routes';
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "./docs/swagger_output.json";

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { PORT = 3000, MONGODB_URI } = process.env;

// CREATE EXPRESS APP
const app: Application = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ROUTES
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// START SERVER
let server: any = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
}

// START SERVER AND CONNECT TO MONGODB
Promise.all([server, mongoose.connect(MONGODB_URI)])
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error(err);
  });

// EXPORT APP
export default app;

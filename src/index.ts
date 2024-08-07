import express from 'express';
import contributorRoutes from './routes/contributorRoutes';
// import { AppDataSource } from './config/db';
import 'reflect-metadata';

import dotenv from 'dotenv';

dotenv.config();


// Create Express app
const app = express();
app.use(express.json());

// Set up routes
app.use('/contributor', contributorRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

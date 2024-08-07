import { DataSource } from 'typeorm';
import { Contributor } from '../models/contributor';
import { Repository } from '../models/repository';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Contributor, Repository],
  synchronize: true,
  logging: true
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('DB Connection has been established successfully.');
  })
  .catch((error) => console.log('Unable to connect to the database:', error));


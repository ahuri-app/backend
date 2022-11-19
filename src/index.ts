import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
if (!process.env.DATABASE_FILE_PATH) {
  console.error('DATABASE_FILE_PATH is not set in the .env!');
  process.exit(1);
}
if (!process.env.PORT) {
  console.error('PORT is not set in the .env!');
  process.exit(1);
}
if (!process.env.SALT) {
  console.error('SALT is not set in the .env!');
  process.exit(1);
}

const server = express();

server.listen(Number(process.env.PORT), () =>
  console.log(`Server started at 0.0.0.0:${process.env.PORT}`),
);

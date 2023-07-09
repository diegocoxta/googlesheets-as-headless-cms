import path from 'path';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const server = express();

server.use(express.static(path.dirname(process.env.PUBLIC_API_FILE)));

server.listen(process.env.PUBLIC_API_SERVER_PORT, () => {
  console.log(`server running on port ${process.env.PUBLIC_API_SERVER_PORT}`)
});

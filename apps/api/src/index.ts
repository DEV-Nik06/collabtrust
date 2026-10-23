import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';

const port = process.env.PORT || 3000;
const app = createApp();

app.listen(port, () => {
  console.log(`[CollabTrust API] Server listening on port ${port} (NODE_ENV: ${process.env.NODE_ENV || 'development'})`);
});

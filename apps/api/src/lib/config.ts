import dotenv from 'dotenv';
import path from 'path';

// Load .env from monorepo root (go up 2 levels from apps/api)
const envPath = path.join(process.cwd(), '../../.env');
dotenv.config({ path: envPath });

interface Config {
  port: number;
  nodeEnv: string;
}

const config: Config = {
  port: Number(process.env.API_PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'dev',
};

export default config;
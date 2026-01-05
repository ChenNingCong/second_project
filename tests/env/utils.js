import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { configDotenv } from 'dotenv';
export const loadEnv = (relativePath) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  return configDotenv({ path: resolve(__dirname, relativePath) });
};
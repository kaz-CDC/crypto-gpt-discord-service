import dotenv from 'dotenv';

dotenv.config();

// service config
export const IS_PROD_ENV: boolean = process.env.NODE_ENV === 'production';
export const IS_DEV_ENV: boolean = process.env.NODE_ENV === 'development';
export const DEFAULT_ENV: string = IS_DEV_ENV ? 'development' : 'production';

// urls
export const API_BASE_URL: string = process.env.API_BASE_URL!;

// keys
export const CRYPTO_GPT_BASE_API: string = process.env.CRYPTO_GPT_BASE_API!;
export const CRYPTO_GPT_WRITE_API_KEY: string = process.env.CRYPTO_GPT_WRITE_API_KEY!;
export const DISCORD_TOKEN: string = process.env.DISCORD_TOKEN!;

// misc
export const DISCORD_BOT_LOGO: string = 'https://i.postimg.cc/BnvYLWGP/discord-bot-logo.png';
export const DISCORD_CHANNEL_ID: string = process.env.DISCORD_CHANNEL_ID!;

import dotenv from 'dotenv';
dotenv.config();

export const WALLET_PRIVAT_KEY = process.env.WALLET_PRIVAT_KEY;
export const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
export const FAUCET_URL = process.env.FAUCET_URL;
export const TIMEOUT = 30000;
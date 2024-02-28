import axios, { AxiosInstance, AxiosResponse } from 'axios';

import { CRYPTO_GPT_BASE_API } from '#src/helpers/constants.js';
import { CryptoGptResponse } from '#src/lib/interfaces/cryptoGpt.js';
import { logger } from '#src/helpers/logger.js';

export const cryptoGptInstance: AxiosInstance = axios.create({
  baseURL: CRYPTO_GPT_BASE_API,
});

/**
 * Asynchronously sends a query string to the Crypto GPT model and retrieves a response.
 * Handles API requests and manages errors, returning the response content or null in case of an error.
 *
 * @param {string} query - The context or prompt to send to the Crypto GPT model.
 * @returns {Promise<string|null>} A promise resolving to the Crypto GPT response content or null if an error occurs.
 *
 * @example
 * const response = await cryptoGptInstance('Describe the process of photosynthesis.');
 */

export const queryCryptoGptModel = async (query: string): Promise<string> => {
  const url = '/search';
  try {
    const response: AxiosResponse<CryptoGptResponse> = await cryptoGptInstance.post<CryptoGptResponse>(url, { query });
    return response.data.message;
  } catch (e) {
    logger.error(`[CryptoGPT/query] - ${e}`);
    return '';
  }
};

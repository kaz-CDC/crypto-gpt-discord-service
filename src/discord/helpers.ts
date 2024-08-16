import { Client } from 'discord.js';
import { LastRequestTimes } from '../lib/interfaces/cryptoGpt.js';

const lastRequestTimes: LastRequestTimes = {};

/**
 * Utilities for managing rate limits and other Discord bot operations.
 *
 * @namespace discordUtils
 */
export const discordUtils = {
  /**
   * Enforces a rate limit for user requests to prevent spamming.
   * If a user has made a request within the last 30 seconds, they are temporarily blocked from making another request.
   *
   * @param {string | number} userId - The unique identifier for the user making the request. Can be either a string or number, but is treated as a string for lookup purposes.
   * @returns {string | boolean} - Returns true if the request is allowed, or a string with a rate limit message if the request is blocked.
   *
   * @example
   * discordUtils.rateLimit(message.author.id)
   */
  rateLimit: (userId: string | number): string | boolean => {
    const currentTime = Date.now();
    const lastRequestTime = lastRequestTimes[userId] || 0;
    const timeDiff = currentTime - lastRequestTime;

    if (timeDiff < 30000) {
      return 'Rate Limit hit. 1 request per user every 30 sec.';
    } else {
      lastRequestTimes[userId] = currentTime;
      return true;
    }
  },

  /**
   * Calculates the time until the next request can be made by a user and returns a message with this information.
   * This function is intended to be called if a rate limit check fails, to inform the user how long they need to wait.
   *
   * @param {string | number} userId - The unique identifier for the user.
   * @returns {string} - A message indicating how many seconds the user needs to wait before making another request.
   *
   * @example
   * discordUtils.getTimeUntilNextRequest(message.author.id)
   */
  getTimeUntilNextRequest: (userId: string | number): string => {
    const currentTime = Date.now();
    const lastRequestTime = lastRequestTimes[userId] || 0;
    const timeDiff = currentTime - lastRequestTime;
    const timeLeft = 30000 - timeDiff;

    // Calculate remaining time in seconds, ensuring it's at least 1 second.
    const secondsLeft = Math.max(Math.ceil(timeLeft / 1000), 1);

    return `Please wait ${secondsLeft} more second(s) before making another request.`;
  },

  /**
   * Schedules sending a welcome message to the specified Discord channel every 24 hours.
   *
   * @param {Client} client - The Discord client instance.
   * @param {Function} sendMessageFunction - The function that sends the welcome message.
   */
  scheduleWelcomeMessage: (client: Client, sendMessageFunction: (client: Client) => Promise<void>): void => {
    setInterval(() => {
      sendMessageFunction(client);
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  },
};

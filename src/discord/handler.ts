import { Client, GuildMember, Message, TextChannel } from 'discord.js';
import { logger } from '#src/helpers/logger.js';
import { queryCryptoGptModel } from '#src/integrations/crypto-gpt-api.js';
import { discordUtils } from './helpers.js';
import { DISCORD_BOT_LOGO, DISCORD_CHANNEL_ID } from '#src/helpers/constants.js';

/**
 * Discord bot utilities for handling messages and logging.
 *
 * @namespace discord
 */
export const discord = {
  /**
   * Handles incoming Discord messages by querying the Crypto GPT model and sending back a response.
   * Messages from bots, including itself, are ignored to prevent loops.
   *
   * @async
   * @param {Message} message - The Discord message object.
   * @returns {Promise<void>} Nothing is returned, but a response may be sent in the Discord channel.
   *
   * @example
   * client.on('messageCreate', discord.handleMessages);
   */
  handleMessages: async (message: Message): Promise<void> => {
    if (message.author.bot) return;

    const allowedChannelId = DISCORD_CHANNEL_ID;

    if (message.channel.id !== allowedChannelId) return;

    const userId = message.author.id;
    const userName = message.author.username;
    const rateLimit = discordUtils.rateLimit(userId);

    if (rateLimit !== true) {
      const waitMessage = discordUtils.getTimeUntilNextRequest(userId);
      await message.channel.send(`<@${userId}> - ${rateLimit} ${waitMessage}`);
      return;
    }

    if (message.content) {
      try {
        const response = await queryCryptoGptModel(message.content);
        logger.info(response);
        await message.channel.send(`<@${userId}> - ${response}`);
      } catch (e) {
        console.error('Error sending message:', e);
      }
    }

    logger.info(`Message received: ${message.content}`);
  },

  /**
   * Logs the successful login of the Discord bot client.
   * Throws an error if no client user is found, indicating login failure.
   *
   * @param {Client<boolean>} client - The Discord client instance.
   * @throws {Error} Throws an error if no client user is found.
   *
   * @example
   * client.on('ready', discord.handleLogs);
   */
  handleLogs: (client: Client): void => {
    if (!client.user) {
      throw new Error('No client user found');
    }

    logger.info(`Logged in as ${client.user.tag}!`);
  },

  /**
   * Sets the bot's avatar to a specified image file.
   * The path to the avatar image is relative to the project's root directory.
   *
   * @async
   * @param {Client} client - The Discord client instance.
   * @returns {Promise<void>} Nothing is returned, but the bot's avatar is updated.
   *
   * @example
   * discord.setBotAvatar(client);
   */
  setBotAvatar: async (client: Client): Promise<void> => {
    if (!client.user) {
      throw new Error('No client user found');
    }

    try {
      const avatar = DISCORD_BOT_LOGO;
      await client.user.setAvatar(avatar);
      logger.info('Bot avatar updated successfully.');
    } catch (e) {
      logger.error('Failed to update bot avatar:', e);
    }
  },

  /**
   * Sends a welcome message to new guild members.
   *
   * @async
   * @param {GuildMember} member - The member who has joined a guild.
   * @returns {Promise<void>} - A promise that resolves when the welcome message has been sent.
   */
  sendWelcomeMessage: async (member: GuildMember): Promise<void> => {
    const welcomeChannelId = DISCORD_CHANNEL_ID;

    try {
      const welcomeChannel = (await member.client.channels.fetch(welcomeChannelId)) as TextChannel;
      const welcomeMessage = `Welcome to Crypto GPT, ${member.user.username}! Here's how to get started with our bot:
    
          1. To ask a question, simply type \`[your question]\` in the #crypto-gpt channel.
          2. To get the latest BlockHeight, type \`Get the latest BlockHeight\`.
          3. For the current BlockHeight, type \`Get the current BlockHeight\`.
      `;

      await welcomeChannel.send(welcomeMessage);
      logger.info(`Welcome message sent to ${member.user.tag}`);
    } catch (e) {
      logger.error('Failed to send welcome message:', e);
    }
  },
};

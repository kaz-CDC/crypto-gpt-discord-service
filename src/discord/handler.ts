import { Client, Message, GatewayIntentBits, Typing } from 'discord.js';
import { logger } from '../helpers/logger.js';

// Bot configuration (formerly in constants.js)
export const CONFIG = {
  // Channel for suspicious activity alerts
  ALERT_CHANNEL_ID: '1415155467822563349',
  
  // Keywords that trigger alerts
  KEYWORDS: ['help', 'support', 'helpdesk', 'support ticket'],
  
  // Time window to check for keywords (minutes)
  TIME_WINDOW: 2,
  
  // Number of recent messages to fetch
  MESSAGE_LIMIT: 10
} as const;

// Create a single client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageTyping
  ]
});

export const discord = {
  /**
   * MAIN ENTRY POINT - Initializes bot and attaches all event handlers
   * This replaces the old bot.js file's setup logic
   */
  initialize: async (token: string): Promise<void> => {
    if (!token) {
      throw new Error('DISCORDJS_BOT_TOKEN is not defined in environment variables');
    }

    client.once('ready', discord.handleLogs);
    client.on('typingStart', discord.handleTypingStart);
    client.on('messageCreate', discord.handleMessages);

    await client.login(token);
    logger.info('Bot initialization complete');
  },

  /**
   * Clean shutdown - call this when stopping the bot
   */
  destroy: async (): Promise<void> => {
    await client.destroy();
    logger.info('Bot shut down gracefully');
  },

  /**
   * Handles incoming messages (simplified - just logs, no GPT)
   */
  handleMessages: async (message: Message): Promise<void> => {
    if (message.author.bot) return;
    
    logger.info(
      `[${message.guild?.name || 'DM'} - #${
        'name' in message.channel ? message.channel.name : 'DM'
      }] ${message.author.tag}: ${message.content}`
    );
  },

  /**
   * Handles bot ready event (replaces bot.js client.once('ready'))
   */
  handleLogs: (): void => {
    if (!client.user) {
      throw new Error('Bot failed to login - no user found');
    }
    logger.info(`Bot logged in as ${client.user.tag}!`);
  },

  /**
   * Handles typing detection (moved from bot.js)
   * Sends alerts when users type after help-related messages
   */
  handleTypingStart: async (typing: Typing): Promise<void> => {
    if (typing.user.bot) return;

    // Ignore non-text channels and DMs
    if (!typing.guild || !typing.channel.isTextBased() || typing.channel.isDMBased()) {
      return;
    }

    try {
      const recentMessages = await typing.channel.messages.fetch({ 
        limit: CONFIG.MESSAGE_LIMIT 
      });
      
      const cutoffTime = Date.now() - (CONFIG.TIME_WINDOW * 60 * 1000);
      
      const hasRecentKeywords = recentMessages.some(message => {
        if (message.createdTimestamp < cutoffTime) return false;
        const content = message.content.toLowerCase();
        return CONFIG.KEYWORDS.some(keyword => content.includes(keyword));
      });

      if (hasRecentKeywords) {
        await discord.sendAlert(typing);
      }
    } catch (error) {
      logger.error('Typing handler error:', error);
    }
  },

  /**
   * Sends suspicious activity alert to configured channel
   * @private
   */
  sendAlert: async (typing: Typing): Promise<void> => {
    if (!typing.guild) return;

    const alertChannel = typing.guild.channels.cache.get(CONFIG.ALERT_CHANNEL_ID);

    if (!alertChannel?.isTextBased()) {
      logger.warn(`Alert channel ${CONFIG.ALERT_CHANNEL_ID} not found`);
      return;
    }

    await alertChannel.send(
      `🚨 **Suspicious Activity Detected**\n` +
      `User: <@${typing.user.id}> (${typing.user.tag})\n` +
      `Channel: ${typing.channel}\n` +
      `Time: ${new Date().toLocaleString()}\n\n` +
      `This user started typing shortly after a help-related message was posted.`
    );

    logger.info(`Alert sent: ${typing.user.tag} in ${'name' in typing.channel ? typing.channel.name : typing.channel.id}`);
  },

  /**
   * Utility to set bot avatar (optional, kept for flexibility)
   */
  setBotAvatar: async (avatarPath: string): Promise<void> => {
    if (!client.user) throw new Error('No client user found');
    
    try {
      await client.user.setAvatar(avatarPath);
      logger.info('Bot avatar updated successfully.');
    } catch (e) {
      logger.error('Failed to update bot avatar:', e);
    }
  }
};

// Export client for advanced use cases
export { client };
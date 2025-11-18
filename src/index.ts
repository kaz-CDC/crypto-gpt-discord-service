import { discord } from './discord/handler.js';
import 'dotenv/config';


const token = process.env.DISCORDJS_BOT_TOKEN;

if (!token) {
  console.error('ERROR: DISCORDJS_BOT_TOKEN not found in .env file');
  process.exit(1);
}

// Start the bot
discord.initialize(token).catch(error => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down bot...');
  await discord.destroy();
  process.exit(0);
});

import { Client, GatewayIntentBits } from 'discord.js';
import { discord } from './discord/handler.js';
import { DISCORD_TOKEN } from './helpers/constants.js';
import { discordUtils } from './discord/helpers.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMembers, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent],
});

client.on('ready', discord.handleLogs);
client.on('ready', discord.setBotAvatar);
client.on('messageCreate', discord.handleMessages);
client.on('ready', () => discordUtils.scheduleWelcomeMessage(client, discord.sendWelcomeMessage));

client.login(DISCORD_TOKEN);

import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import { agent, createPost } from './bsky.js';

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// When the client is ready, run this code (only once).
client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// React to message on creation
client.on(Events.MessageCreate, async (message) => {
    if (message.channelId === process.env.CHANNEL_ID) {
        message.react(process.env.REACTION);
    }
});

client.on(Events.MessageReactionAdd, async (reaction) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }

    let reactions = (await reaction.message.fetch()).reactions.cache;

    createPost(reaction, reactions, agent);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

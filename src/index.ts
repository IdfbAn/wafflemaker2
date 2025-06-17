// Require the necessary discord.js classes
import { Agent, AtpAgent, CredentialSession } from '@atproto/api';
import 'dotenv/config';
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';

// Create a Bluesky agent 
const agent = new AtpAgent({
    service: 'https://bsky.social',
});

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

    if (reaction.emoji.toString() !== '⬆️' && reaction.message.channelId === process.env.CHANNEL_ID) {
        if (reactions.get('⬆️') !== undefined && reactions.get('⬆️').me) {
            console.log("This message has already been posted!");
        }

        // If required reaction count has been reached for the first time on this message
        if (reactions.get(process.env.REACTION).count === parseInt(process.env.REACTION_COUNT)) {
            await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD!});
            await agent.post({
                text: reaction.message.toString()
            });
            reaction.message.react('⬆️');
        }
    }
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);

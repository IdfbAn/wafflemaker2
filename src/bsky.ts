import { AtpAgent, RichText } from '@atproto/api';
import { Collection, MessageReaction, PartialMessageReaction } from 'discord.js';

// Create a Bluesky agent 
export const agent = new AtpAgent({
    service: 'https://bsky.social',
});

export async function createPost(reaction: MessageReaction | PartialMessageReaction, reactions: Collection<string, MessageReaction>, agent: AtpAgent) {
    if (reaction.emoji.toString() !== '⬆️' && reaction.message.channelId === process.env.CHANNEL_ID) {
        if (reactions.get('⬆️') !== undefined && reactions.get('⬆️').me) {
            console.log("This message has already been posted!"); // If required reaction count has already been reached on this message
        } else if (reactions.get(process.env.REACTION).count === parseInt(process.env.REACTION_COUNT)) {
            await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD! });
            const rt = new RichText({ text: reaction.message.toString() });
            await rt.detectFacets(agent);
            await agent.post({
                text: rt.text
            });
            reaction.message.react('⬆️');
        } // If required reaction count has been reached for the first time on this message
    }
}

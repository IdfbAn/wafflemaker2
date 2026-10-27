import { Client } from '@atproto/lex';
import { PasswordSession } from '@atproto/lex-password-session';
import { post } from '@bsky/sdk';
import { Collection, MessageReaction, PartialMessageReaction } from 'discord.js';

const session = await PasswordSession.login({
  service: 'https://bsky.social',
  identifier: process.env.BLUESKY_USERNAME!,
  password: process.env.BLUESKY_PASSWORD!
});
export const bskyClient = new Client(session);

export async function createPost(reaction: MessageReaction | PartialMessageReaction,
    reactions: Collection<string, MessageReaction>, client: Client) {
    if (reaction.emoji.toString() !== '⬆️' && reaction.message.channelId === process.env.CHANNEL_ID) {
        if (reactions.get('⬆️') !== undefined && reactions.get('⬆️')!.me) {
            console.log("This message has already been posted!"); // If required reaction count has already been reached on this message
        } else if (reactions.get(process.env.REACTION!)!.count === parseInt(process.env.REACTION_COUNT!)) {
            await client.call(post, {
                text: reaction.message.toString()
            });
            reaction.message.react('⬆️');
        } // If required reaction count has been reached for the first time on this message
    }
}

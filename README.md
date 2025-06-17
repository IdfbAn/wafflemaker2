# wafflemaker2
Posts a Discord message to the specified Bluesky account once it gets enough of the specified reaction.

## .env
For this to work in your Discord bot, you'll need to create a file whose full filename is `.env` (don't forget the dot!),
and put the following:
```
BLUESKY_USERNAME=insert_bsky_username_here
BLUESKY_PASSWORD=insert_bsky_password_here
DISCORD_TOKEN=insert_bot_token_here
CHANNEL_ID=insert_discord_channel_id_here
REACTION=insert_emoji_here
REACTION_COUNT=insert_number_here
```
Replace the example values with your real ones. Make sure to add 1 to amount you want in REACTION_COUNT to accomodate for the bot's own reaction.

## Run
To run this in your Discord bot:
1. Install [Node.js](https://nodejs.org)
2. Run this command in the root of this repo's directory: `npm install`
3. Run this command (doesn't matter where): `npm install -g typescript`
4. Run this command in the root of this repo's directory: `tsc && node .`

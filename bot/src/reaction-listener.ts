import { MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';

export const listen = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
) => {
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

    // Now the message has been cached and is fully available
    console.log('reaction: ==> ', reaction.emoji.name);
    console.log('reaction user: ==> ', user.username);
    const ogMessage = await reaction.message.channel.messages.fetch(reaction.message.id);
    console.log('og message: ==> ', ogMessage.content);
    console.log('og message author: ==> ', ogMessage.author.username);
};

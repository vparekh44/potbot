import { createClient } from '@supabase/supabase-js';
import { MessageReaction, PartialMessageReaction, PartialUser, User, Channel } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

interface Reaction {
    senderId: string;
    receiverId: string;
    emoji: string;
    serverId: string;
    messageId: string;
    createdAt: string;
    supabase: any;
}

export const insertReactionToDb = async ({
    senderId,
    receiverId,
    emoji,
    serverId,
    messageId,
    createdAt,
    supabase,
}: Reaction): Promise<void> => {
    // const supabase = createClient(
    //     'https://royjlygoakdbzebykdws.supabase.co',
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJveWpseWdvYWtkYnplYnlrZHdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2Njk2OTc2NywiZXhwIjoxOTgyNTQ1NzY3fQ.9igCyaGm6y6K9xL5Oxy7VTu2vU8VJ4R_AUfxk4EccRM'
    // );

    try {
        const { data, error } = await supabase.from('reactions').insert({
            id: uuidv4(),
            sender_id: senderId,
            receiver_id: receiverId,
            emoji,
            server_id: serverId,
            message_id: messageId,
            created_at: createdAt,
        });
        console.log('Data, error', data, error);
    } catch (e) {
        console.log('error in insertReactionToDb', e);
    }
};

export const listen = async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    supabase: any
): Promise<void> => {
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
    // console.log('reaction: ==> ', reaction.emoji.name);
    // console.log('reaction user: ==> ', user.username);
    const ogMessage = await reaction.message.channel.messages.fetch(reaction.message.id);
    // console.log('messages: ==> ', reaction.message);
    // console.log('reaction: ==> ', reaction);
    // console.log('og message: ==> ', ogMessage.content);
    // console.log('og message author: ==> ', ogMessage.author.username);

    insertReactionToDb({
        senderId: user.id,
        receiverId: ogMessage.author.id,
        emoji: reaction.emoji.name,
        serverId: ogMessage.guildId,
        messageId: ogMessage.id,
        createdAt: new Date().toISOString(),
        supabase,
    });
};

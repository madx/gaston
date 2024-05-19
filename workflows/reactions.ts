import { Message, MessageReaction, PartialMessageReaction, TextChannel } from "discord.js";
import { Bot } from "../bot";
import { departialize } from "../discord";

const STARBOARD_CHANNEL_ID = "starboard_channel_id";
const STAR_EMOJIS = ["🔖", "🔥", "❤️", "⭐"];
const REQUIRED_COUNT = 5;

export default async function reactions(bot: Bot) {
  const handler = handleReaction(bot);
  bot.discord.on("messageReactionAdd", handler);
  bot.discord.on("messageReactionRemove", handler);
}

function handleReaction(bot: Bot) {
  return async (
    partialMessageReaction: MessageReaction | PartialMessageReaction,
  ) => {
    const messageReaction = await departialize(partialMessageReaction);
    const { message: partialMessage } = messageReaction;
    const message = await departialize(partialMessage);
    const isInGuildChannel = message.guild === bot.guild;

    if (isInGuildChannel && STAR_EMOJIS.includes(messageReaction.emoji.name)) {
      await checkAndAddToStarboard(bot, message);
    }
  };
}

async function checkAndAddToStarboard(bot: Bot, message: Message) {
  let totalCount = 0;

  for (const emoji of STAR_EMOJIS) {
    const reaction = message.reactions.cache.get(emoji);
    if (reaction) {
      totalCount += reaction.count;
    }
  }

  if (totalCount >= REQUIRED_COUNT) {
    const starboardChannel = message.guild?.channels.cache.get(STARBOARD_CHANNEL_ID) as TextChannel;
    if (starboardChannel) {
      await starboardChannel.send(`⭐ **${message.author.username}**: ${message.content}\n${message.url}`);
      bot.logger.info("starboard", `${message.author.username}'s message added to starboard`);
    }
  }
}

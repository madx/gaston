import {
  type Message,
  type MessageReaction,
  type PartialMessageReaction,
} from "discord.js";
import { type Bot } from "../bot.ts";
import { departialize } from "../discord.ts";

const PIN_EMOJI = "📌";

export default async function pins(bot: Bot) {
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
    const emoji = messageReaction.emoji.name;
    const isInGuildChannel = message.guild === bot.guild;

    if (isInGuildChannel && emoji === PIN_EMOJI) {
      await pinOrUnpinMessage(bot, message, messageReaction.count);
    }
  };
}

async function pinOrUnpinMessage(bot: Bot, message: Message, count: number) {
  if (count === 1) {
    await message.pin();
    bot.logger.info("pins", `${message.author.displayName} pinned a message`);
  }

  if (count === 0) {
    await message.unpin();
    bot.logger.info("pins", `${message.author.displayName} unpinned a message`);
  }
}

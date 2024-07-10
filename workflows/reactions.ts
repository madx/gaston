import {
  EmbedBuilder,
  Message,
  MessageReaction,
  PartialMessageReaction,
  TextChannel,
} from "discord.js";
import { Bot } from "../bot";
import { departialize } from "../discord";

const STAR_EMOJIS = ["🔖", "🔥", "❤️", "⭐", "💜", "🩵", "👀"];
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

    if (
      isInGuildChannel &&
      STAR_EMOJIS.includes(messageReaction.emoji.name ?? "")
    ) {
      await checkAndAddToStarboard(bot, message);
    }
  };
}

async function checkAndAddToStarboard(bot: Bot, message: Message) {
  const totalCount = STAR_EMOJIS.map(
    (emoji) => message.reactions.cache.get(emoji)?.count ?? 0,
  ).reduce((total, count) => total + count);

  const starboardChannel = message.guild?.channels.cache.get(
    bot.env.STARBOARD_CHANNEL_ID,
  ) as TextChannel;

  if (totalCount < REQUIRED_COUNT || starboardChannel === null) {
    return;
  }

  const embed = new EmbedBuilder()
    .setColor(0xf9f06b)
    .setURL(message.url)
    .setAuthor({
      name: message.author.displayName,
      iconURL: message.author.avatarURL() ?? undefined,
    })
    .setDescription(message.content);

  await starboardChannel.send({ embeds: [embed] });

  bot.logger.info(
    "starboard",
    `${message.author.username}'s message added to starboard`,
  );
}

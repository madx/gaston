import Discord, { GatewayIntentBits, Partials } from "discord.js";

export function createDiscordClient() {
  return new Discord.Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.GuildMember,
      Partials.Channel,
      Partials.Message,
      Partials.Reaction,
    ],
  });
}

type PotentiallyPartial =
  | Discord.User
  | Discord.PartialUser
  | Discord.GuildMember
  | Discord.PartialGuildMember
  | Discord.Channel
  | Discord.Message
  | Discord.PartialMessage
  | Discord.MessageReaction
  | Discord.PartialMessageReaction;

export async function departialize<
  T extends PotentiallyPartial,
  R extends ReturnType<T["fetch"]>,
>(thing: T): Promise<R> {
  if (thing.partial) {
    return (await thing.fetch()) as R;
  } else {
    return thing as unknown as R;
  }
}

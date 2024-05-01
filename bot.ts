import Discord, {
  Collection,
  EmbedBuilder,
  Guild,
  GuildMember,
  TextChannel,
} from "discord.js";
import { EventEmitter } from "node:events";
import * as commands from "./commands";
import { BotCommand } from "./commands";
import { Env } from "./env";
import { DISCORD_COLORS, LogEvent, Logger } from "./logger";
import * as workflows from "./workflows";

export const AVAILABILITY = {
  PUBLIC: "public",
  MOD: "mod",
  ADMIN: "admin",
  BOT_MASTER: "bot-master",
} as const;

type Availability = (typeof AVAILABILITY)[keyof typeof AVAILABILITY];

type InitializingBot = {
  // EVENT: typeof EVENT;
  AVAILABILITY: typeof AVAILABILITY;
  discord: Discord.Client;
  env: Env;
  logger: Logger;
  channels: Record<string, TextChannel>;
  commands: Collection<string, BotCommand>;
  events: EventEmitter;
  guild?: Guild;
  emojis: Record<string, Discord.GuildEmoji>;
  isBotMaster: (guildMember: GuildMember) => boolean;
  onReady: () => Promise<void>;
};

type Bot = Required<InitializingBot>;

interface CreateBotDependencies {
  discord: Discord.Client;
  env: Env;
  logger: Logger;
}

export default function createBot({
  discord,
  env,
  logger,
}: CreateBotDependencies) {
  const bot: InitializingBot = {
    AVAILABILITY,
    discord,
    env,
    logger,
    channels: {},
    commands: new Collection(),
    events: new EventEmitter(),
    guild: undefined,
    emojis: {},

    isBotMaster(guildMember: GuildMember) {
      return guildMember.id === bot.env.BOT_MASTER_ID;
    },

    async onReady() {
      bot.logger.info("core", "🤖 Logged in to Discord");

      bot.guild = bot.discord.guilds.cache.get(bot.env.GUILD_ID);

      if (!isBotInGuild(bot)) {
        return bot.logger.fatal("core", "Unable to retrieve default guild");
      }

      try {
        await syncEmojis(bot);
        await registerCommands(bot);
        await registerWorkflows(bot);
      } catch (error) {
        bot.logger.fatal("core", "Startup failed", error as Error);
      }

      bot.logger.events.on("log", (logEvent: LogEvent) => log(bot, logEvent));

      bot.logger.info("core", "🔥 I'm ready!");
    },
  };

  return bot;
}

function isBotInGuild(bot: InitializingBot): bot is Bot {
  return bot.guild !== undefined;
}

async function log(bot: Bot, { level, scope, message, error }: LogEvent) {
  if (!bot.channels.bot) {
    return;
  }

  const description = `**[${scope}]** ${message}`;
  const embed = new EmbedBuilder()
    .setColor(DISCORD_COLORS[level])
    .setDescription(
      error ? `${description}\n\`\`\`\n${error.stack}\`\`\`` : description,
    );
  bot.channels.bot.send({ embeds: [embed] });

  if (["error", "fatal"].includes(level)) {
    bot.channels.bot.send(`<@${bot.env.BOT_MASTER_ID}> :arrow_up:`);
  }

  if (level === "warn") {
    // TODO: Find a better way to handle moderation pings
    bot.channels.bot.send(`${bot.roles.mod} :arrow_up:`);
  }
}

async function syncEmojis(bot: Bot) {
  bot.emojis = bot.guild.emojis.cache.reduce(
    (emojis, emoji) => ({ ...emojis, [emoji.name ?? emoji.identifier]: emoji }),
    {},
  );
}

async function registerCommands(bot: Bot) {
  bot.logger.info("core", "Registering commands...");

  const commandBuilders = Object.values(commands);

  for (const buildCommand of commandBuilders) {
    try {
      const command = await Promise.resolve(buildCommand(bot)); // TODO: improve typing
      bot.commands.set(command.name, command);
    } catch (error) {
      bot.logger.fatal("core", buildCommand.name, error);
    }
  }

  bot.logger.info(
    "core",
    `Enabled commands: ${bot.commands.map((c) => c.name).join(", ")}`,
  );
}

async function registerWorkflows(bot: Bot) {
  bot.logger.info("core", "Registering workflows...");

  const workflowList = Object.values(workflows);

  for (const registerWorkflow of workflowList) {
    try {
      await registerWorkflow(bot);
    } catch (error) {
      bot.logger.fatal("core", registerWorkflow.name, error);
    }
  }

  bot.logger.info(
    "core",
    `Enabled workflows: ${workflowList
      .map((workflow) => workflow.name)
      .join(", ")}`,
  );
}

export type { Availability, Bot };

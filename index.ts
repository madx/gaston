import createBot from "./bot";
import { createDiscordClient } from "./discord";
import { createEnv } from "./env";
import { createLogger } from "./logger";

const logger = createLogger();
const env = createEnv(process.env, logger);
const discord = createDiscordClient();

const bot = createBot({
  env,
  discord,
  logger,
});

discord.once("ready", bot.onReady);
await discord.login(env.DISCORD_API_TOKEN);

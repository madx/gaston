import { createBot } from "./bot.ts";
import { createDatabase } from "./database.ts";
import { createDiscordClient } from "./discord.ts";
import { createEnv } from "./env.ts";
import { createLogger } from "./logger.ts";

const logger = createLogger();
const env = createEnv(process.env, logger);
const discord = createDiscordClient();
const db = await createDatabase(env.DATABASE_URL);

const bot = createBot({
  db,
  discord,
  env,
  logger,
});

discord.once("ready", bot.onReady);
await discord.login(env.DISCORD_API_TOKEN);

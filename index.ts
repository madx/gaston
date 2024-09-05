import { createBot } from "./bot";
import { createDatabase } from "./database";
import { createDiscordClient } from "./discord";
import { createEnv } from "./env";
import { createLogger } from "./logger";

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

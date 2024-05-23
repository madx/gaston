import type { Logger } from "./logger";
import { pick, pluralize } from "./utils";

const REQUIRED_ENVIRONMENT_VARIABLES = [
  "BOT_MASTER_ID",
  "GUILD_ID",
  "DISCORD_API_TOKEN",
  "STARBOARD_CHANNEL_ID"
] as const;

type HostEnv = Record<string, string | undefined>;
type SafeEnv = Record<string, string>;
type Env = {
  [K in (typeof REQUIRED_ENVIRONMENT_VARIABLES)[number]]: string;
};

function isSafeEnv(environment: HostEnv): environment is SafeEnv {
  return REQUIRED_ENVIRONMENT_VARIABLES.every(
    (variable) => process.env[variable] !== undefined,
  );
}

export function createEnv(environment: HostEnv, logger: Logger): Env {
  if (!isSafeEnv(environment)) {
    const missing = REQUIRED_ENVIRONMENT_VARIABLES.filter(
      (variable) => process.env[variable] === undefined,
    );

    logger.fatal(
      "core/createEnv",
      `Missing environment ${pluralize(
        "variable",
        missing.length,
      )}: ${missing.join(", ")}`,
    );
  }

  return pick(environment, REQUIRED_ENVIRONMENT_VARIABLES);
}

export type { Env };

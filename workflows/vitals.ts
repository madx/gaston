import { Bot } from "../bot";
import { pick } from "../utils";

const LOG_SCOPE = "workflow/vitals";

export default async function vitals(bot: Bot) {
  // Make sure the deploy command is available
  const deployCommand = bot.commands.get("deploy");

  if (!deployCommand) {
    bot.logger.fatal(LOG_SCOPE, "Unable to find the deploy command");
  }

  await bot.guild.commands.create({
    ...pick(deployCommand, ["name", "description"]),
    defaultMemberPermissions: "0",
  });

  bot.logger.info(LOG_SCOPE, "Registered deploy command");
}

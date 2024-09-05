import { type Interaction } from "discord.js";
import { type Bot } from "../bot.ts";
import { type BotCommand } from "../commands/index.ts";

const LOG_SCOPE = "workflows/commands";

export default async function commands(bot: Bot) {
  bot.discord.on("interactionCreate", async (interaction: Interaction) => {
    const { commands } = bot;

    if (
      !interaction.isChatInputCommand() ||
      !commands.has(interaction.commandName)
    ) {
      return;
    }

    const command = commands.get(interaction.commandName) as BotCommand;

    try {
      await command?.execute(interaction);
      bot.logger.info(
        LOG_SCOPE,
        `${interaction.member} (${interaction.user.username}) used **${interaction}** in ${interaction.channel}`,
      );
    } catch (error) {
      bot.logger.error(
        LOG_SCOPE,
        `Error while executing ${command.name}`,
        error,
      );
    }
  });
}

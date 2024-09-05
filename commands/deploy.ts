import { PermissionFlagsBits } from "discord.js";
import { type Availability, type Bot } from "../bot.ts";
import { pick } from "../utils.ts";
import { type BotCommandBuilder } from "./index.ts";

const command: BotCommandBuilder = function deploy(bot) {
  return {
    name: "deploy",
    description: "🤖 Update available commands and permissions",
    availability: bot.AVAILABILITY.BOT_MASTER,

    async execute(interaction) {
      const { commands, guild } = bot;

      const commandList = [...commands.values()];

      // Create commands, private by default
      await guild.commands.set(
        commandList.map((command) => ({
          ...pick(command, ["name", "description", "options"]),
          defaultMemberPermissions:
            convertAvailabilityToDefaultMemberPermissions(
              bot,
              command.availability,
            ),
        })),
      );

      await interaction.reply("🤖 Commands deployed!");
    },
  };
};

// TODO: This is not really suited everywhere, it would be better to comeup with something simpler/more configurable
function convertAvailabilityToDefaultMemberPermissions(
  bot: Bot,
  availability: Availability,
) {
  switch (availability) {
    case bot.AVAILABILITY.PUBLIC:
      return PermissionFlagsBits.UseApplicationCommands;
    case bot.AVAILABILITY.MOD:
      return PermissionFlagsBits.KickMembers;
    case bot.AVAILABILITY.ADMIN:
      return PermissionFlagsBits.Administrator;
    case bot.AVAILABILITY.BOT_MASTER:
      return PermissionFlagsBits.ManageGuild;
  }
}

export default command;

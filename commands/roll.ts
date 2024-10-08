import { parse, pool } from "dicebag";
import { ApplicationCommandOptionType } from "discord.js";
import { type BotCommandBuilder } from "./index.ts";

const MAX_EXPRESSION_LENGTH = 30;

const command: BotCommandBuilder = function roll(bot) {
  return {
    name: "roll",
    description: "Roll some dice!",
    availability: bot.AVAILABILITY.PUBLIC,
    options: [
      {
        name: "expression",
        description: "A dice expression to roll",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],

    async execute(interaction) {
      const expression = interaction.options.getString("expression", true);

      try {
        if (
          expression.match(/\d{3}d/) ||
          expression.length > MAX_EXPRESSION_LENGTH
        ) {
          await interaction.reply({
            content: `Nah, too many dice here :person_shrugging:`,
            ephemeral: true,
          });
          return;
        }

        const dice = parse(
          expression.replace("F", "3-2"), // Handle Fudge dice
        );
        const roll = pool(dice);
        const sum = roll.reduce((sum: number, roll: number) => sum + roll, 0);
        const list = roll.map((d: number) => `**\` ${d} \`**`).join(" ");
        const prefix = `🎲 **Rolling ${expression}:**`;

        await interaction.reply(
          `${prefix} ${list}${roll.length > 1 ? ` = **\` ${sum} \`**` : ""}`,
        );
      } catch (error) {
        await interaction.reply(
          `Sorry, I don't know how to roll \`${expression}\` :person_shrugging:`,
        );
      }
    },
  };
};

export default command;

import type {
  ApplicationCommandOptionData,
  ChatInputCommandInteraction,
} from "discord.js";
import type { Bot } from "../bot.ts";
import { AVAILABILITY } from "../bot.ts";

type BotCommand = {
  name: string;
  description: string;
  availability: (typeof AVAILABILITY)[keyof typeof AVAILABILITY];
  options?: ApplicationCommandOptionData[];
  execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
};

type BotCommandBuilder = (bot: Bot) => BotCommand;

export { default as deploy } from "./deploy.ts";
export { default as roll } from "./roll.ts";
export { default as say } from "./say.ts";
export type { BotCommand, BotCommandBuilder };

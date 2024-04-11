import type {
  ApplicationCommandOptionData,
  ChatInputCommandInteraction,
} from "discord.js";
import { AVAILABILITY, Bot } from "../bot";

type BotCommand = {
  name: string;
  description: string;
  availability: (typeof AVAILABILITY)[keyof typeof AVAILABILITY];
  options?: ApplicationCommandOptionData[];
  execute: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
};

type BotCommandBuilder = (bot: Bot) => BotCommand;

export { default as deploy } from "./deploy";
export { default as roll } from "./roll";
export type { BotCommand, BotCommandBuilder };

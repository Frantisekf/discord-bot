import { Message } from "discord.js";
import { Client } from "@typeit/discord";

export default class Command {
  message: Message;
  client: Client;
  args: string[];

  constructor(message: Message, client: Client, args: string[]) {
    this.message = message;
    this.client = client;
    this.args = args;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async execute() {}
}

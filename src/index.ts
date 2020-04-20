import { Discord, On, Client } from "@typeit/discord";
import { Message } from "discord.js";
import { config } from "dotenv";
import CommandsList from "./commands";
import Command from "./command";
import "./env";

@Discord
export class AppDiscord {
  private static client: Client;
  private prefix = "!";

  static start() {
    console.log(process.env.TOKEN);

    if (!process) {
      throw new Error(
        "Token has not been set. Define token in .local.env at root directory"
      );
    }

    console.info("Initializing");
    this.client = new Client();

    this.client
      .login(process.env.TOKEN, `${__dirname}/*Discord.ts`)
      .then(() => {
        console.info("Bot logged in");
      });
  }

  @On("message")
  async onMessage(message: Message, client: Client) {
    if (AppDiscord.client.user.id !== message.author.id) {
      if (message.content[0] === this.prefix) {
        // eslint-disable-next-line prefer-const
        let [cmd, ...args] = message.content
          .replace(this.prefix, "")
          .split(" ");

        cmd = cmd.toLowerCase();

        if (cmd === "hello") {
          message.reply("Hello 🍻!");
          return;
        }

        if (cmd === "help") {
          message.reply(
            `Use something from this: ${Object.keys(CommandsList).join(", ")}`
          );
          return;
        }

        let command: typeof Command;

        // Iterates over Commands from the CommandsList and case insensitively finds the one matching users command
        for(let key in CommandsList) {
          if(key.toLowerCase() === cmd) {
            command = CommandsList[key];
            break;
          }
        }

        if (command) {
          console.info(`${cmd} [${args.join(", ")}] - execution`);

          try {
            new command(message, client, args).execute();
          } catch (e) {
            console.error(e);
            message.channel.send("check console");
          }

          return;
        }

        message.reply(
          `I dont know this command ${Object.keys(CommandsList).join(", ")}`
        );
      }
    }
  }
}

AppDiscord.start();

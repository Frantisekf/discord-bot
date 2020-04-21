import * as fs from "fs";

import Command from "../command";
import TheBot from "../bot/theBot";
import { getRandomInt } from "../utils/random";
import Logger from "../utils/logger";

export default class MilujiSvojiPraci extends Command {
  async execute() {
    if (this.message.member && this.message.member.voice.channel) {
      const theBot: TheBot = TheBot.getInstance();

      const mspFolder = `${process.cwd()}/data/audio/msp`;
      const files = fs.readdirSync(mspFolder);
      const fileToPlay = files[getRandomInt(0, files.length)];
      Logger.log(`Playing ${mspFolder}/${fileToPlay}`);

      await theBot.joinVoice(this.message.member.voice.channel);
      await theBot.playAudioFile(`${mspFolder}/${fileToPlay}`);
    } else {
      this.message.reply("You need to join a voice channel first!");
    }
  }
}

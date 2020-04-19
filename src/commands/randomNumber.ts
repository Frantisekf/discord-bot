import Command from "../command";
import { getRandomInt } from "../utils/random";

export default class RandomNumber extends Command {
  async execute() {
    this.message.reply(getRandomInt(-5, 500));
  }
}
